import type { FC } from "react";
import { useEffect, useRef } from "react";
import { Bat } from "../Bat/Bat";
import { Ball } from "../Ball/Ball";
import "./playground.css";

export const Playground: FC = () => {
  const leftBatYPositionRef = useRef<number>(window.innerHeight / 2 - 75);
  const rightBatYPositionRef = useRef<number>(window.innerHeight / 2 - 75);

  const ballYPositionRef = useRef<number>(window.innerHeight / 2 - 75);
  const ballXPositionRef = useRef<number>(window.innerWidth / 2 - 75);

  const leftBatRef = useRef<HTMLDivElement>(null);
  const rightBatRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const speedRef = useRef<number>(0);
  const ballSpeedXRef = useRef<number>(3); // Ball horizontal speed
  const ballSpeedYRef = useRef<number>(2); // Ball vertical speed
  const animationFrameRef = useRef<number>(null);
  const animationBallFrameRef = useRef<number>(null);

  const moveBall = () => {
    ballYPositionRef.current += ballSpeedYRef.current;
    ballXPositionRef.current += ballSpeedXRef.current;

    // Bounce off top and bottom walls
    if (
      ballYPositionRef.current <= 0 ||
      ballYPositionRef.current >= window.innerHeight - 20
    ) {
      ballSpeedYRef.current = -ballSpeedYRef.current;
    }

    // Bounce off left and right walls (temporary - later replace with bat collision)
    if (
      ballXPositionRef.current <= 0 ||
      ballXPositionRef.current >= window.innerWidth - 20
    ) {
      ballSpeedXRef.current = -ballSpeedXRef.current;
    }

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
      Math.min(leftBatYPositionRef.current, window.innerHeight - 150)
    );
    rightBatYPositionRef.current = Math.max(
      0,
      Math.min(rightBatYPositionRef.current, window.innerHeight - 150)
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") speedRef.current = -5;
      if (e.key === "ArrowDown") speedRef.current = 5;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") speedRef.current = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Start both animations
    animationFrameRef.current = requestAnimationFrame(moveBats);
    animationBallFrameRef.current = requestAnimationFrame(moveBall);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);

      if (animationBallFrameRef.current)
        cancelAnimationFrame(animationBallFrameRef.current);
    };
  }, []);

  console.log("Playground rendered");

  return (
    <div className="playground">
      <Bat ref={leftBatRef} positionLeft={6} />
      <Bat ref={rightBatRef} positionRight={6} />
      <Ball ref={ballRef} />
    </div>
  );
};
