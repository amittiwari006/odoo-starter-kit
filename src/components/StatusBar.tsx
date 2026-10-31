'use client';

import React from 'react';
import { Check, ChevronRight, AlertCircle } from 'lucide-react';

interface Stage {
  key: string;
  label: string;
}

interface StatusBarProps {
  stages: Stage[];
  currentStage: string;
  onStageChange?: (newStage: string) => void;
  canChange?: boolean;
}

export default function StatusBar({
  stages,
  currentStage,
  onStageChange,
  canChange = true
}: StatusBarProps) {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="flex items-center flex-wrap gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs">
      {stages.map((stage, idx) => {
        const isCurrent = stage.key === currentStage;
        const isPast = currentIndex !== -1 && idx < currentIndex;
        const isFuture = currentIndex !== -1 && idx > currentIndex;

        return (
          <React.Fragment key={stage.key}>
            <button
              disabled={!canChange || isCurrent}
              onClick={() => onStageChange && onStageChange(stage.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                isCurrent
                  ? 'bg-[#714B67] text-white shadow-sm font-semibold'
                  : isPast
                  ? 'bg-purple-50 text-[#714B67] hover:bg-purple-100 font-medium'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isPast && <Check size={12} className="text-[#714B67]" />}
              <span>{stage.label}</span>
            </button>
            {idx < stages.length - 1 && (
              <ChevronRight size={13} className="text-gray-300 mx-0.5" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
