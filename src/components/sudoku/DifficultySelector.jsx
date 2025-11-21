import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const difficulties = [
  { level: 'easy', label: 'Easy', cellsToRemove: 30 },
  { level: 'medium', label: 'Medium', cellsToRemove: 45 },
  { level: 'hard', label: 'Hard', cellsToRemove: 55 }
];

export default function DifficultySelector({ selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {difficulties.map(({ level, label }) => (
        <Button
          key={level}
          onClick={() => onSelect(level)}
          variant={selected === level ? "default" : "outline"}
          className={cn(
            "transition-all duration-200",
            selected === level 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg scale-105" 
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}