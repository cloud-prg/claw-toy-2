import { useEffect, useRef, useState } from 'react';
import './App.css';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 60;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
const LANE_COUNT = 4;
const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;
const GAME_TIME = 60;

interface Car {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  id: number;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  
  const carRef = useRef<Car>({ x: GAME_WIDTH / 2 - CAR_WIDTH / 2, y: GAME_HEIGHT - CAR_HEIGHT - 20 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const lastObstacleTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      // 更新车子位置
      const speed = 5;
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        carRef.current.x -= speed;
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        carRef.current.x += speed;
      }

      // 限制车子在画布内
      carRef.current.x = Math.max(0, Math.min(GAME_WIDTH - CAR_WIDTH, carRef.current.x));

      // 生成障碍物
      if (timestamp - lastObstacleTimeRef.current > 1500) {
        const lane = Math.floor(Math.random() * LANE_COUNT);
        obstaclesRef.current.push({
          x: lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2,
          y: -OBSTACLE_HEIGHT,
          id: obstacleIdRef.current++,
        });
        lastObstacleTimeRef.current = timestamp;
      }

      // 更新障碍物位置
      const obstacleSpeed = 3 + (GAME_TIME - timeLeft) * 0.05;
      obstaclesRef.current = obstaclesRef.current
        .map((obs) => ({ ...obs, y: obs.y + obstacleSpeed }))
        .filter((obs) => obs.y < GAME_HEIGHT);

      // 碰撞检测
      const car = carRef.current;
      for (const obs of obstaclesRef.current) {
        if (
          car.x < obs.x + OBSTACLE_WIDTH &&
          car.x + CAR_WIDTH > obs.x &&
          car.y < obs.y + OBSTACLE_HEIGHT &&
          car.y + CAR_HEIGHT > obs.y
        ) {
          setGameOver(true);
          return;
        }
      }

      // 更新分数
      setScore((prev) => prev + 1);

      // 绘制
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // 绘制车道线
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      for (let i = 1; i < LANE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * LANE_WIDTH, 0);
        ctx.lineTo(i * LANE_WIDTH, GAME_HEIGHT);
        ctx.stroke();
      }

      // 绘制车子
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(car.x, car.y, CAR_WIDTH, CAR_HEIGHT);
      // 车子细节
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(car.x + 5, car.y + 10, CAR_WIDTH - 10, 15);
      ctx.fillRect(car.x + 5, car.y + 35, CAR_WIDTH - 10, 15);

      // 绘制障碍物
      ctx.fillStyle = '#F44336';
      for (const obs of obstaclesRef.current) {
        ctx.fillRect(obs.x, obs.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
        // 障碍物细节
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(obs.x + 5, obs.y + 5, OBSTACLE_WIDTH - 10, OBSTACLE_HEIGHT - 10);
        ctx.fillStyle = '#F44336';
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(GAME_TIME);
    carRef.current = { x: GAME_WIDTH / 2 - CAR_WIDTH / 2, y: GAME_HEIGHT - CAR_HEIGHT - 20 };
    obstaclesRef.current = [];
    obstacleIdRef.current = 0;
    lastObstacleTimeRef.current = 0;
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(GAME_TIME);
    obstaclesRef.current = [];
  };

  return (
    <div className="game-container">
      <h1>🏎️ 赛车游戏</h1>
      <div className="game-info">
        <span>时间: {timeLeft}s</span>
        <span>分数: {score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="game-canvas"
      />
      {!gameStarted && !gameOver && (
        <div className="game-overlay">
          <button onClick={startGame}>开始游戏</button>
          <p>使用 ← → 或 A D 键控制车子移动</p>
          <p>躲避红色障碍物，坚持 {GAME_TIME} 秒！</p>
        </div>
      )}
      {gameOver && (
        <div className="game-overlay">
          <h2>{timeLeft === 0 ? '🎉 恭喜通关！' : '💥 游戏结束！'}</h2>
          <p>最终分数: {score}</p>
          <button onClick={resetGame}>重新开始</button>
        </div>
      )}
    </div>
  );
}

export default App;