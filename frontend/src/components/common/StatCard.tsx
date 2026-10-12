import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  badge?: {
    text: string;
    variant: 'positive' | 'warning' | 'neutral' | 'urgent';
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-teal-50 text-teal-700',
  badge,
  onClick,
  className = ''
}) => {
  const badgeClasses = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    urgent: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div
      onClick={onClick}
      className={`card-base p-5 ${onClick ? 'card-interactive cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-charcoal-800 tracking-tight">{value}</span>
            {badge && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeClasses[badge.variant]}`}>
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-charcoal-500 mt-1.5 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
