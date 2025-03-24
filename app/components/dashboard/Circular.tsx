'use client'
import React, { useState } from "react";

interface CircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value =61 ,
  size = 180,
  strokeWidth = 15,
  className = "",
}) => {
  const [progress, setProgress] = useState<number>(0);

  const radius: number = (size - strokeWidth) / 2;
  const circumference: number = radius * 2 * Math.PI;
  const strokeDashoffset: number = circumference - (progress / 100) * circumference;

  // Helper function to determine colors based on progress
  const getProgressColors = (progress: number): { color: string; textColor: string } => {
    if (progress > 60) {
      return { 
        color: '#10B981', // Green
        textColor: 'text-emerald-500'
      };
    } else if (progress >= 50) {
      return { 
        color: '#F59E0B', // Yellow
        textColor: 'text-yellow-500'
      };
    } else {
      return { 
        color: '#EF4444', // Red
        textColor: 'text-red-500'
      };
    }
  };

  const { color, textColor } = getProgressColors(progress);

  React.useEffect(() => {
    const validValue = Math.min(100, Math.max(0, value));
    const timer = setTimeout(() => {
      setProgress(validValue);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        aria-label={`Progress indicator showing ${progress}%`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <circle
          className="text-gray-200"
          stroke="currentColor"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1500 ease-out"
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${textColor} transition-colors duration-300`}>
          {Math.round(progress)}%
        </span>
        <span className="text-sm text-gray-600">Business score</span>
      </div>
    </div>
  );
}

export default CircularProgress;
