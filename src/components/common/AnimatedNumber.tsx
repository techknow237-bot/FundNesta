import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  showCurrency?: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = '',
  showCurrency = true,
}) => {
  const { formatMoney, language, currency } = useApp();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 650; // ms
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Fast-out slow-in cubic ease
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * ease;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  if (showCurrency) {
    return <span className={`font-mono tracking-tight font-bold ${className}`}>{formatMoney(displayValue)}</span>;
  }

  return (
    <span className={`font-mono tracking-tight font-bold ${className}`}>
      {Math.round(displayValue).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
    </span>
  );
};
