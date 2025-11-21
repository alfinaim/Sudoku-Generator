import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function SudokuGrid({ grid, originalGrid, solution, onCellChange, highlightErrors }) {
  const handleCellClick = (row, col) => {
    if (originalGrid[row][col] !== 0) return; // Can't edit original cells
    
    const input = document.getElementById(`cell-${row}-${col}`);
    if (input) input.focus();
  };

  const handleKeyDown = (e, row, col) => {
    if (originalGrid[row][col] !== 0) return;

    const key = e.key;
    
    if (key >= '1' && key <= '9') {
      onCellChange(row, col, parseInt(key));
      e.preventDefault();
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      onCellChange(row, col, 0);
      e.preventDefault();
    }

    // Arrow key navigation
    let newRow = row;
    let newCol = col;
    
    if (key === 'ArrowUp' && row > 0) newRow--;
    else if (key === 'ArrowDown' && row < 8) newRow++;
    else if (key === 'ArrowLeft' && col > 0) newCol--;
    else if (key === 'ArrowRight' && col < 8) newCol++;
    
    if (newRow !== row || newCol !== col) {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${newRow}-${newCol}`);
      if (nextInput) nextInput.focus();
    }
  };

  const hasConflict = (row, col) => {
    if (!highlightErrors || grid[row][col] === 0) return false;
    
    const value = grid[row][col];
    
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === value) return true;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === value) return true;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === value) return true;
      }
    }
    
    return false;
  };

  return (
    <div className="inline-block bg-slate-900 p-3 rounded-2xl shadow-2xl">
      <div className="grid grid-cols-9 gap-0 bg-slate-800 p-1 rounded-xl">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isOriginal = originalGrid[rowIndex][colIndex] !== 0;
            const isConflict = hasConflict(rowIndex, colIndex);
            const isCorrect = solution && cell !== 0 && cell === solution[rowIndex][colIndex];
            const isWrong = solution && cell !== 0 && cell !== solution[rowIndex][colIndex];
            
            // Determine border classes for 3x3 boxes
            const borderClasses = cn(
              colIndex % 3 === 2 && colIndex !== 8 && 'border-r-2 border-slate-600',
              rowIndex % 3 === 2 && rowIndex !== 8 && 'border-b-2 border-slate-600'
            );

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (rowIndex * 9 + colIndex) * 0.003 }}
                className={cn(
                  "relative",
                  borderClasses
                )}
              >
                <input
                  id={`cell-${rowIndex}-${colIndex}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={cell === 0 ? '' : cell}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  onChange={() => {}} // Handled by keydown
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                    "text-center text-lg sm:text-xl md:text-2xl font-semibold",
                    "border border-slate-700 bg-white",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:z-10",
                    "transition-all duration-200",
                    isOriginal && "bg-slate-100 text-slate-900 font-bold cursor-default",
                    !isOriginal && "text-indigo-600 hover:bg-slate-50 cursor-pointer",
                    isConflict && "bg-red-50 text-red-600 ring-2 ring-red-400",
                    isCorrect && highlightErrors && "bg-emerald-50 text-emerald-600",
                    isWrong && highlightErrors && "bg-red-50 text-red-600"
                  )}
                  readOnly={isOriginal}
                />
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}