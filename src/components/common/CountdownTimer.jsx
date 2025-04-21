import { useState, useEffect } from 'react';

const CountdownTimer = ({ 
  endTime, 
  onComplete, 
  className = '',
  showLabels = true,
  compact = false
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endTime - now;
      
      if (difference <= 0) {
        setIsComplete(true);
        if (onComplete) onComplete();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };
    
    setTimeLeft(calculateTimeLeft());
    
    // Update timer every second
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  // Don't render if timer is complete
  if (isComplete) return null;

  // Compact version (just shows time, no labels)
  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="font-mono">
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Full version with time blocks
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <div className="bg-green-600 text-white font-bold px-2 py-1 rounded">
            {timeLeft.days}
          </div>
          {showLabels && <span className="text-xs mt-1">Days</span>}
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <div className="bg-green-600 text-white font-bold px-2 py-1 rounded">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        {showLabels && <span className="text-xs mt-1">Hours</span>}
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-green-600 text-white font-bold px-2 py-1 rounded">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        {showLabels && <span className="text-xs mt-1">Mins</span>}
      </div>
      
      <div className="flex flex-col items-center">
        <div className="bg-green-600 text-white font-bold px-2 py-1 rounded">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        {showLabels && <span className="text-xs mt-1">Secs</span>}
      </div>
    </div>
  );
};

export default CountdownTimer;
