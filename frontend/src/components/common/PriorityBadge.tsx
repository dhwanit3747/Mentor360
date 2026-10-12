import React from 'react';
import { calculatePriorityScore, formatPriorityScoreDisplay } from '../../utils/priorityScoring';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface PriorityBadgeProps {
  score: number;
  urgency?: number;
  needSeverity?: number;
  followUpImportance?: number;
  overdueLevel?: number;
  overrideScore?: number | null;
  overrideReason?: string | null;
  showExplanation?: boolean;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  score,
  urgency = 1,
  needSeverity = 1,
  followUpImportance = 1,
  overdueLevel = 0,
  overrideScore,
  overrideReason,
  showExplanation = false,
  className = ''
}) => {
  const breakdown = calculatePriorityScore(urgency, needSeverity, followUpImportance, overdueLevel);
  const activeScore = overrideScore ?? score;

  let badgeClasses = 'bg-teal-50 text-teal-800 border-teal-200';
  let dotColor = 'bg-teal-500';
  let label = 'Normal Priority';
  let icon = <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />;

  if (activeScore >= 14) {
    badgeClasses = 'bg-amber-50 text-amber-900 border-amber-300';
    dotColor = 'bg-amber-500';
    label = 'High Priority';
    icon = <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
  } else if (activeScore >= 8) {
    badgeClasses = 'bg-emerald-50 text-emerald-900 border-emerald-200';
    dotColor = 'bg-emerald-500';
    label = 'Medium Priority';
    icon = <Clock className="w-3.5 h-3.5 text-emerald-600" />;
  }

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClasses}`}>
        {icon}
        <span>Score {formatPriorityScoreDisplay(score, overrideScore)}</span>
        <span className="text-[10px] opacity-75 uppercase tracking-wider font-bold">({label})</span>
      </div>

      {showExplanation && (
        <div className="text-[11px] text-charcoal-600 mt-1 bg-white/80 p-2 rounded border border-charcoal-100 space-y-0.5">
          <p className="font-semibold text-charcoal-800">{breakdown.primaryReason}</p>
          <p className="text-charcoal-500 text-[10px]">
            Formula: P = 4U({urgency}) + 3N({needSeverity}) + 2F({followUpImportance}) + D({overdueLevel})
          </p>
          {overrideScore !== null && overrideScore !== undefined && (
            <p className="text-amber-700 font-medium text-[10px]">
              Mentor Override: {overrideScore}/20 {overrideReason ? `— "${overrideReason}"` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
