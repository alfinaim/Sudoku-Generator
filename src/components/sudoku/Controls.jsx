import React from 'react';
import { Button } from '../ui/button';
import { Sparkles, Lightbulb, CheckCircle, RotateCcw, Eraser } from 'lucide-react';

export default function Controls({ 
  onGenerate, 
  onSolve, 
  onCheck, 
  onReset, 
  onClear,
  isGenerating,
  isSolving 
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating...' : 'New Puzzle'}
      </Button>
      
      <Button
        onClick={onSolve}
        disabled={isSolving}
        variant="outline"
        className="bg-white border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
      >
        <Lightbulb className="w-4 h-4 mr-2" />
        {isSolving ? 'Solving...' : 'Show Solution'}
      </Button>
      
      <Button
        onClick={onCheck}
        variant="outline"
        className="bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Check Progress
      </Button>
      
      <Button
        onClick={onReset}
        variant="outline"
        className="bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      
      <Button
        onClick={onClear}
        variant="outline"
        className="bg-white border-slate-200 hover:bg-red-50 hover:border-red-300"
      >
        <Eraser className="w-4 h-4 mr-2" />
        Clear All
      </Button>
    </div>
  );
}