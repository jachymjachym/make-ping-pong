import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { Bat } from "../Bat/Bat";
import { Ball } from "../Ball/Ball";
import { Counter } from "../Counter/Counter";
import { LeaderBoard } from "../LeaderBoard/LeaderBoard";
import { useLeaderBoard } from "../../hooks/useLeaderBoard";
import "./playground.css";

export const Playground: FC = () => {
  const [count, setCount] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const { addScore } = useLeaderBoard();

  const BALL_SIZE = 20;
  const BAT_WIDTH = 20;
  const BAT_HEIGHT = 150;
  const BAT_INDENT = 6;

  const DEFAULT_X_SPEED = 3;
  const DEFAULT_Y_SPEED = 2;

  // Setting the bats in the middle of the screen on Y axis
  const leftBatYPositionRef = useRef<number>(
    window.innerHeight / 2 - BAT_HEIGHT / 2
  );
  const rightBatYPositionRef = useRef<number>(
    window.innerHeight / 2 - BAT_HEIGHT / 2
  );

  // Setting the ball initialy in the middel of the screen on both axis
  const ballYPositionRef = useRef<number>(
    window.innerHeight / 2 - BALL_SIZE / 2
  );
  const ballXPositionRef = useRef<number>(
    window.innerWidth / 2 - BALL_SIZE / 2
  );

  const playgroundRef = useRef<HTMLDivElement>(null);

  const leftBatRef = useRef<HTMLDivElement>(null);
  const rightBatRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  // Speed of moving bats
  const speedRef = useRef<number>(0);

  // Horizonal speed of the ball
  const ballSpeedXRef = useRef<number>(DEFAULT_X_SPEED);
  // Vertical speed of the ball
  const ballSpeedYRef = useRef<number>(DEFAULT_Y_SPEED);

  // Animation frame ref for bats
  const animationFrameRef = useRef<number>(null);
  // Animation frame ref for ball
  const animationBallFrameRef = useRef<number>(null);

  const moveBall = () => {
    ballYPositionRef.current += ballSpeedYRef.current;
    ballXPositionRef.current += ballSpeedXRef.current;

    // Bounce off top and bottom walls
    if (
      ballYPositionRef.current <= 0 ||
      ballYPositionRef.current >= window.innerHeight - BALL_SIZE
    ) {
      ballSpeedYRef.current = -ballSpeedYRef.current;
    }

    // Left paddle collision detection
    if (
      ballXPositionRef.current <= BAT_WIDTH + BAT_INDENT && // Ball reaches left paddle area
      ballYPositionRef.current >= leftBatYPositionRef.current && // Ball is within paddle height
      ballYPositionRef.current <= leftBatYPositionRef.current + BAT_HEIGHT // Ball is within paddle height
    ) {
      // Reverse ball X direction
      ballSpeedXRef.current = -ballSpeedXRef.current;
      setCount((count) => count + 1);

      if ((count + 1) % 10 === 0 && count !== 0 && count < 40) {
        ballSpeedXRef.current += 2;
      }

      // Add random Y speed on bounce
      ballSpeedYRef.current += Math.random() < 0.5 ? -1 : 1;
    }

    // Right paddle collision detection
    if (
      ballXPositionRef.current >=
        window.innerWidth - BAT_WIDTH - BAT_INDENT - BALL_SIZE && // Ball reaches right paddle area
      ballYPositionRef.current >= rightBatYPositionRef.current && // Ball is within paddle height
      ballYPositionRef.current <= rightBatYPositionRef.current + BAT_HEIGHT // Ball is within paddle height
    ) {
      // Reverse ball X direction
      ballSpeedXRef.current = -ballSpeedXRef.current;
      setCount((count) => count + 1);

      if ((count + 1) % 10 === 0 && count !== 0 && count < 40) {
        ballSpeedXRef.current -= 2;
      }

      // Add random Y speed on bounce
      ballSpeedYRef.current += Math.random() < 0.5 ? -1 : 1;
    }

    // Check if ball went out of bounds (missed paddles)
    if (
      ballXPositionRef.current < BAT_INDENT + BAT_WIDTH - 2 ||
      ballXPositionRef.current >
        window.innerWidth - BAT_INDENT - BAT_WIDTH - BALL_SIZE + 2
    ) {
      resetGame();
    }

    // Apply ball position
    if (ballRef.current) {
      ballRef.current.style.top = `${ballYPositionRef.current}px`;
      ballRef.current.style.left = `${ballXPositionRef.current}px`;
    }

    animationBallFrameRef.current = requestAnimationFrame(moveBall);
  };

  const moveBats = () => {
    // Update both bats with the same speed
    leftBatYPositionRef.current += speedRef.current;
    rightBatYPositionRef.current += speedRef.current;

    // Clamp both positions
    leftBatYPositionRef.current = Math.max(
      0,
      Math.min(leftBatYPositionRef.current, window.innerHeight - BAT_HEIGHT)
    );
    rightBatYPositionRef.current = Math.max(
      0,
      Math.min(rightBatYPositionRef.current, window.innerHeight - BAT_HEIGHT)
    );

    // Apply positions to both bats
    if (leftBatRef.current) {
      leftBatRef.current.style.top = `${leftBatYPositionRef.current}px`;
    }
    if (rightBatRef.current) {
      rightBatRef.current.style.top = `${rightBatYPositionRef.current}px`;
    }

    animationFrameRef.current = requestAnimationFrame(moveBats);
  };

  const resetGame = () => {
    setIsGameOn(false);
    setCount(0);

    ballXPositionRef.current = window.innerWidth / 2 - BALL_SIZE / 2;
    ballYPositionRef.current = window.innerHeight / 2 - BALL_SIZE / 2;

    ballSpeedXRef.current = DEFAULT_X_SPEED;
    ballSpeedYRef.current = DEFAULT_Y_SPEED;

    leftBatYPositionRef.current = window.innerHeight / 2 - BAT_HEIGHT / 2;
    rightBatYPositionRef.current = window.innerHeight / 2 - BAT_HEIGHT / 2;

    addScore(playerName || "Unknown Player", count);
  };

  useEffect(() => {
    // Focus playground when game starts
    if (isGameOn) {
      playgroundRef.current?.focus();
    }
  }, [isGameOn]);

  useEffect(() => {
    // Set initial position of the ball
    if (ballRef.current) {
      ballRef.current.style.top = `${ballYPositionRef.current}px`;
      ballRef.current.style.left = `${ballXPositionRef.current}px`;
    }

    const startTheGame = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsGameOn(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") speedRef.current = -7;
      if (e.key === "ArrowDown") speedRef.current = 7;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") speedRef.current = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keypress", startTheGame);

    // Start both animations
    animationFrameRef.current = requestAnimationFrame(moveBats);

    if (isGameOn) {
      animationBallFrameRef.current = requestAnimationFrame(moveBall);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keypress", startTheGame);

      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);

      if (animationBallFrameRef.current)
        cancelAnimationFrame(animationBallFrameRef.current);
    };
  }, [count, isGameOn]);

  console.log("Out effect");

  return (
    <div className="playground" ref={playgroundRef} tabIndex={0}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Counter count={count} />
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          className="player-name-input"
          aria-label="Player name input"
          onInput={(e) => setPlayerName(e.currentTarget.value)}
        />
      </div>

      {!isGameOn && <LeaderBoard />}

      {!isGameOn && (
        <h1
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Press Enter to Start
        </h1>
      )}

      <Bat
        ref={leftBatRef}
        positionLeft={BAT_INDENT}
        width={BAT_WIDTH}
        height={BAT_HEIGHT}
      />
      <Bat
        ref={rightBatRef}
        positionRight={BAT_INDENT}
        width={BAT_WIDTH}
        height={BAT_HEIGHT}
      />

      <Ball ref={ballRef} size={BALL_SIZE} />
    </div>
  );
};
