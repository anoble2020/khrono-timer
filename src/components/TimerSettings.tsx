import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus } from 'lucide-react';
import { TimerConfig, TimerMode } from '@/pages/Index';

interface TimerSettingsProps {
  config: TimerConfig;
  onConfigChange: (config: TimerConfig) => void;
  mode: TimerMode;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  config,
  onConfigChange,
  mode
}) => {
  const updateConfig = (key: keyof TimerConfig, value: number) => {
    onConfigChange({
      ...config,
      [key]: Math.max(1, value)
    });
  };

  const adjustValue = (key: keyof TimerConfig, delta: number) => {
    const current = config[key];
    const newValue = current + delta;
    updateConfig(key, newValue);
  };

  const SettingControl = ({ 
    label, 
    value, 
    configKey, 
    min = 1, 
    max = 999,
    step = 1,
    unit = "s"
  }: { 
    label: string;
    value: number;
    configKey: keyof TimerConfig;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustValue(configKey, -step)}
          disabled={value <= min}
          className="ripple h-8 w-8 rounded-full"
        >
          <Minus className="w-3 h-3" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            type="number"
            value={value}
            onChange={(e) => updateConfig(configKey, parseInt(e.target.value) || min)}
            min={min}
            max={max}
            className="text-center font-mono"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {unit}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustValue(configKey, step)}
          disabled={value >= max}
          className="ripple h-8 w-8 rounded-full"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="elevation-2 border-0 p-6 space-y-6 animate-slide-up">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Timer Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your {mode.toUpperCase()} workout intervals
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <SettingControl
          label="Work Time"
          value={config.workTime}
          configKey="workTime"
          min={5}
          max={300}
          step={5}
        />

        <SettingControl
          label="Rest Time"
          value={config.restTime}
          configKey="restTime"
          min={5}
          max={300}
          step={5}
        />

        <SettingControl
          label="Rounds"
          value={config.rounds}
          configKey="rounds"
          min={1}
          max={50}
          unit="rounds"
        />

        {mode !== 'intervals' && (
          <>
            <SettingControl
              label="Sets"
              value={config.sets}
              configKey="sets"
              min={1}
              max={10}
              unit="sets"
            />

            {config.sets > 1 && (
              <SettingControl
                label="Set Rest"
                value={config.setRest}
                configKey="setRest"
                min={30}
                max={600}
                step={15}
              />
            )}
          </>
        )}
      </div>

      <Separator />

      {/* Workout Summary */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-foreground">Workout Summary</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total Time:</span>
            <span className="font-mono">
              {Math.ceil(((config.workTime + config.restTime) * config.rounds * config.sets + 
                (config.sets > 1 ? (config.sets - 1) * config.setRest : 0)) / 60)}m
            </span>
          </div>
          <div className="flex justify-between">
            <span>Work Time:</span>
            <span className="font-mono">
              {Math.ceil((config.workTime * config.rounds * config.sets) / 60)}m
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Rounds:</span>
            <span className="font-mono">{config.rounds * config.sets}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};