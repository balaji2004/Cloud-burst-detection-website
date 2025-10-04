'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { classNames } from '@/utils/classNames';

/**
 * StatsCard Component
 * 
 * Display a statistic with icon, title, value, and optional subtitle
 * 
 * @component
 * @example
 * <StatsCard
 *   icon={Activity}
 *   title="Active Nodes"
 *   value={8}
 *   subtitle="Out of 10 total"
 *   trend="up"
 *   trendValue="+2"
 *   color="green"
 * />
 */
const StatsCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendValue,
  color = 'blue',
  className = ''
}) => {
  // Color mapping for Tailwind classes
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const trendColorClasses = {
    up: 'text-green-600',
    down: 'text-red-600'
  };

  return (
    <div
      className={classNames(
        'bg-white rounded-lg shadow-md p-6',
        'hover:shadow-lg hover:scale-105 transition-all duration-300',
        'border border-gray-100',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          
          {/* Value */}
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {value}
          </p>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          
          {/* Trend Indicator */}
          {trend && trendValue && (
            <div className={classNames(
              'flex items-center gap-1 mt-2',
              trendColorClasses[trend]
            )}>
              {trend === 'up' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{trendValue}</span>
            </div>
          )}
        </div>
        
        {/* Icon */}
        {Icon && (
          <div className={classNames(
            'rounded-full p-3',
            colorClasses[color] || colorClasses.blue
          )}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

