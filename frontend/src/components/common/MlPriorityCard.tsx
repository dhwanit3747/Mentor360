import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { MlPriorityPrediction } from '../../services/api';

interface MlPriorityCardProps {
  prediction: MlPriorityPrediction | null;
  loading: boolean;
  schoolName?: string;
}

export const MlPriorityCard: React.FC<MlPriorityCardProps> = ({
  prediction,
  loading,
  schoolName
}) => {
  const urgencyStyle = prediction?.urgency_level === 'High Priority'
    ? 'bg-red-100 text-red-800'
    : prediction?.urgency_level === 'Medium Priority'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-emerald-100 text-emerald-800';

  return (
    <section className="card-base p-5 bg-gradient-to-br from-[#EBF5F2] to-white border border-[#AFDCD1] space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-sm text-[#176B5B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            ML visit priority
          </h2>
          {schoolName && <p className="text-xs text-[#5A6F68] mt-1">{schoolName}</p>}
        </div>
        {prediction && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${urgencyStyle}`}>
            {prediction.urgency_level}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-[#5A6F68] animate-pulse">Getting a prediction from the ML service…</p>
      ) : prediction ? (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#176B5B]">{prediction.priority_score}</span>
            <span className="text-xs text-[#5A6F68]">/ 100 predicted priority</span>
          </div>
          <p className="text-[11px] text-[#5A6F68]">
            Estimated urgency confidence: {Math.round((prediction.probabilities[prediction.urgency_level] || 0) * 100)}%
          </p>
          {prediction.primary_drivers.length > 0 && (
            <div className="pt-2 border-t border-[#AFDCD1]">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#176B5B] mb-1">Key factors</p>
              <ul className="space-y-1">
                {prediction.primary_drivers.slice(0, 3).map(driver => (
                  <li key={driver} className="text-[11px] leading-relaxed text-[#25332F]">- {driver}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-[10px] text-[#7B928A]">Model estimate to support mentor judgment—not a replacement for it.</p>
        </>
      ) : (
        <p className="text-xs text-[#5A6F68] flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
          ML prediction is unavailable. Check that the Python ML service is running.
        </p>
      )}
    </section>
  );
};
