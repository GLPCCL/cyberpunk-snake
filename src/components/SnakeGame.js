import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      newSnake.unshift(head);
      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [snake, direction, food, gameOver, generateFood, isPaused]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#000_1px),_linear-gradient(90deg,_transparent_1px,_#000_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`
      }}/>

      <div className="mb-4 text-4xl font-bold text-cyan-400 tracking-widest" 
           style={{ textShadow: '0 0 10px #0ff, 0 0 20px #0ff' }}>
        SCORE: {score}
      </div>
      
      <div className="relative bg-gray-900 border-2 rounded-lg shadow-2xl overflow-hidden" 
           style={{ 
             width: GRID_SIZE * CELL_SIZE, 
             height: GRID_SIZE * CELL_SIZE,
             borderColor: '#0ff',
             boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.2)'
           }}>
        <div className="absolute rounded-full animate-pulse"
             style={{
               width: CELL_SIZE - 2,
               height: CELL_SIZE - 2,
               left: food.x * CELL_SIZE,
               top: food.y * CELL_SIZE,
               backgroundColor: '#f0f',
               boxShadow: '0 0 10px #f0f, 0 0 20px #f0f'
             }} />

        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              backgroundColor: index === 0 ? '#0f0' : '#0f0',
              boxShadow: index === 0 
                ? '0 0 10px #0f0, 0 0 20px #0f0' 
                : '0 0 5px #0f0',
              borderRadius: index === 0 ? '4px' : '0'
            }}
          />
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-3xl text-red-500 font-bold animate-pulse"
             style={{ textShadow: '0 0 10px #f00, 0 0 20px #f00' }}>
          GAME OVER - SCORE FINAL: {score}
        </div>
      )}

      <div className="mt-4 space-x-4">
        <button
          onClick={restartGame}
          className="px-6 py-2 bg-cyan-900 text-cyan-400 rounded border border-cyan-400 hover:bg-cyan-800 focus:outline-none transition-all duration-300"
          style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
        >
          {gameOver ? 'NOUVELLE PARTIE' : 'RECOMMENCER'}
        </button>
        {!gameOver && (
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-6 py-2 bg-purple-900 text-purple-400 rounded border border-purple-400 hover:bg-purple-800 focus:outline-none transition-all duration-300"
            style={{ boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)' }}
          >
            {isPaused ? 'REPRENDRE' : 'PAUSE'}
          </button>
        )}
      </div>

      <div className="mt-6 text-cyan-400 text-center" 
           style={{ textShadow: '0 0 5px #0ff' }}>
        <p className="mb-2">CONTRÔLES:</p>
        <p>↑ ↓ ← → : DIRIGER LE SERPENT</p>
        <p>ESPACE : PAUSE</p>
      </div>
    </div>
  );
};

export default SnakeGame;