import React, { useState, useEffect, useCallback } from 'react';

// Définition des constantes du jeu
const GRID_SIZE = 20;  // Taille de la grille de jeu
const CELL_SIZE = 20;  // Taille de chaque cellule en pixels
const INITIAL_SPEED = 150;  // Vitesse initiale du serpent (en ms)
const INITIAL_SNAKE = [  // Position initiale du serpent
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const SnakeGame = () => {
  // États du jeu
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Génération aléatoire de la nourriture
  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  // Gestion des contrôles clavier
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

  // Boucle principale du jeu
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      // Déplacement de la tête selon la direction
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

      // Vérification des collisions avec les murs
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Vérification des collisions avec le serpent
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      // Gestion de la nourriture
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

  // Fonction de redémarrage du jeu
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
      {/* Grille d'arrière-plan cyberpunk */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(0deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}/>

      {/* Affichage du score */}
      <div className="mb-4 text-4xl font-bold text-cyan-400 tracking-widest" 
           style={{ textShadow: '0 0 10px #0ff, 0 0 20px #0ff' }}>
        SCORE: {score}
      </div>
      
      {/* Zone de jeu */}
      <div className="relative bg-gray-900 border-2 rounded-lg shadow-2xl overflow-hidden" 
           style={{ 
             width: GRID_SIZE * CELL_SIZE, 
             height: GRID_SIZE * CELL_SIZE,
             borderColor: '#0ff',
             boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.2)'
           }}>
        {/* Nourriture */}
        <div className="absolute rounded-full animate-pulse"
             style={{
               width: CELL_SIZE - 2,
               height: CELL_SIZE - 2,
               left: food.x * CELL_SIZE,
               top: food.y * CELL_SIZE,
               backgroundColor: '#f0f',
               boxShadow: '0 0 10px #f0f, 0 0 20px #f0f'
             }} />

        {/* Corps du serpent */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              backgroundColor: '#0f0',
              boxShadow: index === 0 ? '0 0 10px #0f0, 0 0 20px #0f0' : '0 0 5px #0f0',
              borderRadius: index === 0 ? '4px' : '0'
            }}
          />
        ))}
      </div>

      {/* Message de fin de partie */}
      {gameOver && (
        <div className="mt-4 text-3xl text-red-500 font-bold animate-pulse"
             style={{ textShadow: '0 0 10px #f00, 0 0 20px #f00' }}>
          GAME OVER - SCORE FINAL: {score}
        </div>
      )}

      {/* Boutons de contrôle */}
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

      {/* Instructions */}
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