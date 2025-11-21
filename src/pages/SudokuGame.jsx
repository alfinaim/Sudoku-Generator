import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SudokuGrid from '../components/sudoku/SudokuGrid';
import DifficultySelector from '../components/sudoku/DifficultySelector';
import Controls from '../components/sudoku/Controls';
import { Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Sudoku Generator and Solver Logic
const isValid = (grid, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
};

const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid)) {
              return true;
            }
            
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateCompleteSudoku = () => {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (they don't affect each other)
  for (let box = 0; box < 9; box += 3) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        grid[box + i][box + j] = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
      }
    }
  }
  
  // Solve the rest
  solveSudoku(grid);
  return grid;
};

const generatePuzzle = (difficulty) => {
  const cellsToRemove = {
    easy: 30,
    medium: 45,
    hard: 55
  }[difficulty];
  
  const solution = generateCompleteSudoku();
  const puzzle = solution.map(row => [...row]);
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return { puzzle, solution };
};

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState('medium');
  const [grid, setGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [originalGrid, setOriginalGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(null);
  const [highlightErrors, setHighlightErrors] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setHighlightErrors(false);
    setShowVictory(false);
    
    setTimeout(() => {
      const { puzzle, solution: newSolution } = generatePuzzle(difficulty);
      setGrid(puzzle.map(row => [...row]));
      setOriginalGrid(puzzle.map(row => [...row]));
      setSolution(newSolution);
      setIsGenerating(false);
      toast.success('New puzzle generated!');
    }, 300);
  };

  const handleSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      setGrid(solution.map(row => [...row]));
      setHighlightErrors(false);
      setIsSolving(false);
      toast.info('Solution revealed!');
    }, 500);
  };

  const handleCheck = () => {
    let correctCells = 0;
    let totalFilled = 0;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          totalFilled++;
          if (grid[row][col] === solution[row][col]) {
            correctCells++;
          }
        }
      }
    }
    
    setHighlightErrors(true);
    
    if (correctCells === 81) {
      setShowVictory(true);
      toast.success('🎉 Congratulations! You solved it!');
    } else {
      toast.info(`${correctCells} out of ${totalFilled} filled cells are correct`);
    }
  };

  const handleReset = () => {
    setGrid(originalGrid.map(row => [...row]));
    setHighlightErrors(false);
    setShowVictory(false);
    toast.info('Puzzle reset to original state');
  };

  const handleClear = () => {
    const clearedGrid = originalGrid.map((row, r) => 
      row.map((cell, c) => originalGrid[r][c] !== 0 ? cell : 0)
    );
    setGrid(clearedGrid);
    setHighlightErrors(false);
    setShowVictory(false);
    toast.info('All your entries cleared');
  };

  const handleCellChange = (row, col, value) => {
    if (originalGrid[row][col] !== 0) return;
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
    
    if (highlightErrors) {
      setHighlightErrors(false);
      setTimeout(() => setHighlightErrors(true), 50);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-3 tracking-tight">
            Sudoku
          </h1>
          <p className="text-slate-600 text-lg">
            Challenge your mind with elegant logic puzzles
          </p>
        </motion.div>

        {/* Difficulty Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <DifficultySelector 
            selected={difficulty} 
            onSelect={setDifficulty} 
          />
        </motion.div>

        {/* Sudoku Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <SudokuGrid
            grid={grid}
            originalGrid={originalGrid}
            solution={solution}
            onCellChange={handleCellChange}
            highlightErrors={highlightErrors}
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Controls
            onGenerate={handleGenerate}
            onSolve={handleSolve}
            onCheck={handleCheck}
            onReset={handleReset}
            onClear={handleClear}
            isGenerating={isGenerating}
            isSolving={isSolving}
          />
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-3">How to Play</h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Fill each cell with numbers 1-9</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Each row must contain all digits 1-9 without repetition</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Each column must contain all digits 1-9 without repetition</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Each 3×3 box must contain all digits 1-9 without repetition</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Use arrow keys to navigate and number keys to fill cells</span>
            </li>
          </ul>
        </motion.div>

        {/* Victory Modal */}
        <AnimatePresence>
          {showVictory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowVictory(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Congratulations!
                </h2>
                <p className="text-slate-600 text-lg mb-6">
                  You've successfully solved the puzzle!
                </p>
                <button
                  onClick={() => {
                    setShowVictory(false);
                    handleGenerate();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                  Play Again
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}