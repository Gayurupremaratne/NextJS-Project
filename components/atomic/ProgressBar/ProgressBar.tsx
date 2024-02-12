'use client';

import React from 'react';

export interface ProgressProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressProps) => {
  return (
    <div className="w-full h-1 bg-tints-battleship-grey-tint-5 rounded-md overflow-hidden">
      <div
        className="h-full bg-tints-forest-green-tint-1 transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
