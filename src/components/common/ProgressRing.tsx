import React from 'react';
import { motion } from 'motion/react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string; // Tailwind color hex or class
  showPercentage?: boolean;
  isBudget?: boolean; // If true, turns amber >80% and red at >100%
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 72,
  strokeWidth = 6,
  color = '#10B981',
  showPercentage = true,
  isBudget = false,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  let strokeColor = color;
  if (isBudget) {
    if (percentage >= 100) {
      strokeColor = '#EF4444'; // Coral / Red
    } else if (percentage >= 80) {
      strokeColor = '#F59E0B'; // Amber
    } else {
      strokeColor = '#10B981'; // Emerald
    }
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Value */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children || (
          showPercentage && (
            <span className="text-xs font-semibold tracking-tight text-white/90">
              {Math.round(percentage)}%
            </span>
          )
        )}
      </div>
    </div>
  );
};
