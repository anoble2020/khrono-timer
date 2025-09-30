import {
  CapacitorHealthkit,
  QueryOutput,
  SampleNames,
  ActivityData,
  OtherData,
} from '@perfood/capacitor-healthkit';

export interface HealthMetrics {
  heartRate: number | null;
  caloriesBurned: number;
  isConnected: boolean;
}

export interface WorkoutSession {
  startTime: Date;
  endTime: Date | null;
  totalCalories: number;
  averageHeartRate: number;
  maxHeartRate: number;
  heartRateReadings: number[];
}

class HealthKitService {
  private isAuthorized = false;
  private workoutSession: WorkoutSession | null = null;
  // Throttle caches
  private lastHeartRateFetchMs = 0;
  private cachedHeartRate: number | null = null;
  private lastCaloriesFetchMs = 0;
  private cachedCalories = 0;

  // HealthKit permissions we need
  private readonly READ_PERMISSIONS = [
    // v1 plugin supports these strings; needed for calories/workouts
    'calories',
    'activity',
  ];

  private readonly WRITE_PERMISSIONS = [
    'activity',
  ];

  /**
   * Check if HealthKit is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      console.log('[HealthKitService] Checking if HealthKit is available...');
      await CapacitorHealthkit.isAvailable();
      console.log('[HealthKitService] HealthKit is available');
      return true;
    } catch (error) {
      console.error('[HealthKitService] HealthKit not available:', error);
      return false;
    }
  }

  /**
   * Request authorization from the user
   */
  async requestAuthorization(): Promise<boolean> {
    try {
      await CapacitorHealthkit.requestAuthorization({
        all: [],
        read: this.READ_PERMISSIONS,
        write: this.WRITE_PERMISSIONS,
      });
      
      this.isAuthorized = true;
      return true;
    } catch (error) {
      console.error('[HealthKitService] Authorization failed:', error);
      this.isAuthorized = false;
      return false;
    }
  }

  /**
   * Check if we have authorization
   */
  isAuthorizedForHealthKit(): boolean {
    return this.isAuthorized;
  }

  /**
   * Start a new workout session
   */
  startWorkoutSession(): void {
    if (!this.isAuthorized) {
      console.warn('[HealthKitService] Cannot start workout session - not authorized');
      return;
    }

    this.workoutSession = {
      startTime: new Date(),
      endTime: null,
      totalCalories: 0,
      averageHeartRate: 0,
      maxHeartRate: 0,
      heartRateReadings: [],
    };

    // No internal polling; UI will pull at most once per second
  }

  /**
   * End the current workout session
   */
  endWorkoutSession(): WorkoutSession | null {
    if (!this.workoutSession) {
      return null;
    }

    this.workoutSession.endTime = new Date();

    const session = { ...this.workoutSession };
    this.workoutSession = null;
    return session;
  }

  /**
   * Get current health metrics
   */
  async getCurrentMetrics(): Promise<HealthMetrics> {
    console.debug('[HealthKitService] getCurrentMetrics called, isAuthorized:', this.isAuthorized);
    
    if (!this.isAuthorized) {
      console.debug('[HealthKitService] not authorized, returning default metrics');
      return {
        heartRate: null,
        caloriesBurned: 0,
        isConnected: false,
      };
    }

    try {
      console.debug('[HealthKitService] fetching heart rate and calories in parallel...');
      const startTime = performance.now();
      
      const [heartRate, calories] = await Promise.all([
        this.getCurrentHeartRateThrottled(),
        this.getCaloriesBurnedThrottled(),
      ]);

      const totalTime = performance.now() - startTime;
      console.debug('[HealthKitService] metrics fetched in', totalTime.toFixed(2), 'ms:', { heartRate, calories });

      return {
        heartRate,
        caloriesBurned: calories,
        isConnected: true,
      };
    } catch (error) {
      console.error('[HealthKitService] Error getting metrics:', error);
      return {
        heartRate: null,
        caloriesBurned: 0,
        isConnected: false,
      };
    }
  }

  /**
   * Get current heart rate
   */
  private async getCurrentHeartRate(): Promise<number | null> {
    try {
      const endDate = new Date();
      // Expand window to last 60 minutes to avoid missing samples due to sync delays
      const startDate = new Date(endDate.getTime() - 60 * 60 * 1000);

      const queryOptions = {
        sampleName: SampleNames.HEART_RATE,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        // Fetch all within window; we'll pick the most recent
        limit: 0,
      };

      console.debug('[HealthKitService] calling CapacitorHealthkit.queryHKitSampleType for heart rate...');
      const startTime = performance.now();
      const result: QueryOutput<OtherData> = await CapacitorHealthkit.queryHKitSampleType(queryOptions);
      const queryTime = performance.now() - startTime;
      console.debug('[HealthKitService] heart rate query completed in', queryTime.toFixed(2), 'ms, results:', result.resultData?.length || 0);
      
      if (result.resultData && result.resultData.length > 0) {
        // Choose the most recent by endDate
        const latest = result.resultData.reduce((latest, curr) => {
          return new Date(curr.endDate) > new Date(latest.endDate) ? curr : latest;
        }, result.resultData[0]);
        const heartRate = Math.round(latest.value);
        console.debug('[HealthKitService] selected latest heart rate:', heartRate);
        return heartRate;
      }

      console.debug('[HealthKitService] no heart rate data found');
      return null;
    } catch (error) {
      console.error('[HealthKitService] Error getting heart rate:', error);
      return null;
    }
  }

  private async getCurrentHeartRateThrottled(): Promise<number | null> {
    const now = Date.now();
    if (now - this.lastHeartRateFetchMs < 1000) {
      console.debug('[HealthKitService] returning cached heart rate:', this.cachedHeartRate);
      return this.cachedHeartRate;
    }
    console.debug('[HealthKitService] fetching fresh heart rate...');
    const hr = await this.getCurrentHeartRate();
    this.lastHeartRateFetchMs = now;
    this.cachedHeartRate = hr;
    console.debug('[HealthKitService] heart rate fetched and cached:', hr);
    return hr;
  }

  /**
   * Get calories burned during workout
   */
  private async getCaloriesBurned(): Promise<number> {
    if (!this.workoutSession) {
      console.debug('[HealthKitService] no workout session, returning 0 calories');
      return 0;
    }

    try {
      const queryOptions = {
        sampleName: SampleNames.ACTIVE_ENERGY_BURNED,
        startDate: this.workoutSession.startTime.toISOString(),
        endDate: new Date().toISOString(),
        limit: 0,
      };

      console.debug('[HealthKitService] calling CapacitorHealthkit.queryHKitSampleType for calories...');
      const startTime = performance.now();
      const result: QueryOutput<OtherData> = await CapacitorHealthkit.queryHKitSampleType(queryOptions);
      const queryTime = performance.now() - startTime;
      console.debug('[HealthKitService] calories query completed in', queryTime.toFixed(2), 'ms, results:', result.resultData?.length || 0);
      
      if (result.resultData && result.resultData.length > 0) {
        const totalCalories = result.resultData.reduce((sum, data) => sum + data.value, 0);
        const rounded = Math.round(totalCalories);
        console.debug('[HealthKitService] calculated total calories:', rounded);
        return rounded;
      }

      console.debug('[HealthKitService] no calories data found');
      return 0;
    } catch (error) {
      console.error('[HealthKitService] Error getting calories:', error);
      return 0;
    }
  }

  private async getCaloriesBurnedThrottled(): Promise<number> {
    const now = Date.now();
    // Only re-query calories every 3 seconds
    if (now - this.lastCaloriesFetchMs < 3000) {
      console.debug('[HealthKitService] returning cached calories:', this.cachedCalories);
      return this.cachedCalories;
    }
    console.debug('[HealthKitService] fetching fresh calories...');
    const cal = await this.getCaloriesBurned();
    this.lastCaloriesFetchMs = now;
    this.cachedCalories = cal;
    console.debug('[HealthKitService] calories fetched and cached:', cal);
    return cal;
  }

  /**
   * Get current workout session data
   */
  getCurrentWorkoutSession(): WorkoutSession | null {
    return this.workoutSession;
  }
}

export const healthKitService = new HealthKitService();
