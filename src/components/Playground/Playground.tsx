import type { FC } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Bat } from "../Bat/Bat";
import { Ball } from "../Ball/Ball";
import { Counter } from "../Counter/Counter";
import { LeaderBoard } from "../LeaderBoard/LeaderBoard";
import { useLeaderBoard } from "../../hooks/useLeaderBoard";
import { GAME_CONSTANTS } from "../../constants";
import {
  collidedWithLeftBat,
  collidedWithRightBat,
  collidedWithWall,
  isOutOfBoundaries,
} from "../../utils/collision";
import { resetBallPosition } from "../../utils/ballMovement";
import { resetBatsPosition } from "../../utils/batMovement";
import type { BallPosition } from "../../utils/collision";
import "./playground.css";

export const Playground: FC = () => {
  const [count, setCount] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const { addScore } = useLeaderBoard();

  // Setting the bats in the middle of the screen on Y axis
  const leftBatYPositionRef = useRef<number>(
    resetBatsPosition({ height: window.innerHeight }).y
  );
  const rightBatYPositionRef = useRef<number>(
    resetBatsPosition({ height: window.innerHeight }).y
  );

  // Setting the ball initialy in the middel of the screen on both axis
  const ballYPositionRef = useRef<number>(
    resetBallPosition({ height: window.innerHeight, width: window.innerWidth })
      .y
  );
  const ballXPositionRef = useRef<number>(
    resetBallPosition({ height: window.innerHeight, width: window.innerWidth })
      .x
  );

  const playgroundRef = useRef<HTMLDivElement>(null);

  const leftBatRef = useRef<HTMLDivElement>(null);
  const rightBatRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  // Speed of moving bats
  const speedRef = useRef<number>(0);

  // Horizonal speed of the ball
  const ballSpeedXRef = useRef<number>(GAME_CONSTANTS.DEFAULT_X_SPEED);
  // Vertical speed of the ball
  const ballSpeedYRef = useRef<number>(GAME_CONSTANTS.DEFAULT_Y_SPEED);

  // Animation frame ref for bats
  const animationFrameRef = useRef<number>(null);
  // Animation frame ref for ball
  const animationBallFrameRef = useRef<number>(null);

  const moveBall = useCallback(() => {
    ballYPositionRef.current += ballSpeedYRef.current;
    ballXPositionRef.current += ballSpeedXRef.current;

    const ballPosition: BallPosition = {
      x: ballXPositionRef.current,
      y: ballYPositionRef.current,
    };

    // Bounce off top and bottom walls
    if (collidedWithWall(ballPosition, window.innerHeight)) {
      ballSpeedYRef.current = -ballSpeedYRef.current;
    }

    // Detect a collision with the left bat
    if (collidedWithLeftBat(ballPosition, { y: leftBatYPositionRef.current })) {
      // Reverse ball X direction
      ballSpeedXRef.current = -ballSpeedXRef.current;
      setCount((count) => count + 1);

      // Increase speed every 10 points, max 40
      if ((count + 1) % 10 === 0 && count !== 0 && count < 40) {
        ballSpeedXRef.current += 2;
      }

      // Add random Y speed on bounce
      ballSpeedYRef.current += Math.random() < 0.5 ? -1 : 1;
    }

    // Detect a collision with the right bat
    if (
      collidedWithRightBat(
        ballPosition,
        { y: rightBatYPositionRef.current },
        window.innerWidth
      )
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

    // Check if ball went out of bounds
    if (isOutOfBoundaries(ballPosition, window.innerWidth)) {
      resetGame();
    }

    // Apply ball position
    if (ballRef.current) {
      ballRef.current.style.top = `${ballYPositionRef.current}px`;
      ballRef.current.style.left = `${ballXPositionRef.current}px`;
    }

    animationBallFrameRef.current = requestAnimationFrame(moveBall);
  }, [count]);

  const moveBats = useCallback(() => {
    // Update both bats with the same speed
    leftBatYPositionRef.current += speedRef.current;
    rightBatYPositionRef.current += speedRef.current;

    // Bat position boundaries
    leftBatYPositionRef.current = Math.max(
      0,
      Math.min(
        leftBatYPositionRef.current,
        window.innerHeight - GAME_CONSTANTS.BAT_HEIGHT
      )
    );
    rightBatYPositionRef.current = Math.max(
      0,
      Math.min(
        rightBatYPositionRef.current,
        window.innerHeight - GAME_CONSTANTS.BAT_HEIGHT
      )
    );

    // Apply positions to both bats
    if (leftBatRef.current) {
      leftBatRef.current.style.top = `${leftBatYPositionRef.current}px`;
    }
    if (rightBatRef.current) {
      rightBatRef.current.style.top = `${rightBatYPositionRef.current}px`;
    }

    animationFrameRef.current = requestAnimationFrame(moveBats);
  }, []);

  const resetGame = useCallback(() => {
    setIsGameOn(false);
    setCount(0);

    const { x, y, speedX, speedY } = resetBallPosition({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    ballXPositionRef.current = x;
    ballYPositionRef.current = y;
    ballSpeedXRef.current = speedX;
    ballSpeedYRef.current = speedY;

    const batsPosition = resetBatsPosition({ height: window.innerHeight });
    leftBatYPositionRef.current = batsPosition.y;
    rightBatYPositionRef.current = batsPosition.y;

    addScore(playerName || "Unknown Player", count);
  }, [addScore, playerName, count]);

  useEffect(() => {
    // Focus playground when game starts
    if (isGameOn) {
      playgroundRef.current?.focus();
    }
  }, [isGameOn]);

  const startTheGame = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsGameOn(true);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isGameOn) return;
      if (e.key === "ArrowUp") speedRef.current = -GAME_CONSTANTS.BAT_SPEED;
      if (e.key === "ArrowDown") speedRef.current = GAME_CONSTANTS.BAT_SPEED;
    },
    [isGameOn]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") speedRef.current = 0;
  }, []);

  useEffect(() => {
    // Set initial position of the ball
    if (ballRef.current) {
      ballRef.current.style.top = `${ballYPositionRef.current}px`;
      ballRef.current.style.left = `${ballXPositionRef.current}px`;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keypress", startTheGame);

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
  }, [count, isGameOn, startTheGame, handleKeyDown, handleKeyUp]);

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
        positionLeft={GAME_CONSTANTS.BAT_INDENT}
        width={GAME_CONSTANTS.BAT_WIDTH}
        height={GAME_CONSTANTS.BAT_HEIGHT}
      />
      <Bat
        ref={rightBatRef}
        positionRight={GAME_CONSTANTS.BAT_INDENT}
        width={GAME_CONSTANTS.BAT_WIDTH}
        height={GAME_CONSTANTS.BAT_HEIGHT}
      />

      <Ball ref={ballRef} size={GAME_CONSTANTS.BALL_SIZE} />
    </div>
  );
};
