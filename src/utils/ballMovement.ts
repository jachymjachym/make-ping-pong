import { GAME_CONSTANTS } from "../constants";

export type BallState = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
};

export type GameBounds = {
  width: number;
  height: number;
};

export const resetBallPosition = (bounds: GameBounds): BallState => {
  const { BALL_SIZE, DEFAULT_X_SPEED, DEFAULT_Y_SPEED } = GAME_CONSTANTS;

  return {
    x: bounds.width / 2 - BALL_SIZE / 2,
    y: bounds.height / 2 - BALL_SIZE / 2,
    speedX: DEFAULT_X_SPEED,
    speedY: DEFAULT_Y_SPEED,
  };
};
