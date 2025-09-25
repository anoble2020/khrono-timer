import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer, Zap } from 'lucide-react';

export type TimerMode = 'intervals' | 'emom';

const modes = [
  {
    id: 'intervals' as TimerMode,
    name: 'Intervals',
    description: 'Intervals of work and rest',
    icon: Timer,
    color: 'bg-primary'
  },
  {
    id: 'emom' as TimerMode,
    name: 'EMOM',
    description: 'Every minute on the minute',
    icon: Zap,
    color: 'bg-secondary'
  }
];

const ModeSelection = () => {
  const navigate = useNavigate();

  // Theme toggle removed - defaulting to dark mode

  const handleModeSelect = (mode: TimerMode) => {
    navigate(`/workout/${mode}`);
  };

  return (
    <div 
      className="min-h-screen h-screen overflow-hidden gradient-background transition-colors duration-300"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* Safe area padding for iPhone notch */}
      <div className="pt-safe-top">

      <main className="container mx-auto px-4 py-6 h-full overflow-hidden">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg">
              Select a workout mode to get started
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 justify-center items-center animate-fade-in md:px-6">
            {modes.map((mode) => {
              const cardBg = mode.id === 'intervals' ? 'bg-card-intervals' : 'bg-card-emom';
              
              return (
                <div
                  key={mode.id}
                  className={`flex flex-col justify-center items-center p-0 relative w-full h-56 ${cardBg} rounded-[20px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-md effect-shine`}
                  onClick={() => handleModeSelect(mode.id)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Main Content */}
                  <div className="flex flex-col items-center justify-center text-center px-8 mb-8">
                    <h2 className="text-2xl font-bold text-black mb-4 tracking-normal">
                      {mode.name.toUpperCase()}
                    </h2>
                    <p className="text-sm text-black/80 leading-relaxed max-w-[280px]">
                      {mode.id === 'intervals' 
                        ? 'Intervals of work and rest, such as Tabata or timed workouts'
                        : 'Every minute on the minute, with a set amount of work performed at the top of every minute'
                      }
                    </p>
                  </div>
                  
                  {/* Start Button */}
                  <div className="px-6 py-2 border-2 border-black bg-transparent text-black font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-colors duration-200">
                    START
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      </div>
    </div>
  );
};

export default ModeSelection;
