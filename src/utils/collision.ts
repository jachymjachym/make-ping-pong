import { GAME_CONSTANTS } from "../constants";

export type BallPosition = {
  x: number;
  y: number;
};

export type BatPosition = {
  y: number;
};

export const collidedWithLeftBat = (
  ballPosition: BallPosition,
  leftBatPosition: BatPosition
): boolean => {
  const ballReachesLeftPaddleArea =
    ballPosition.x <= GAME_CONSTANTS.BAT_WIDTH + GAME_CONSTANTS.BAT_INDENT;

  const ballWithinPaddleHeight =
    ballPosition.y >= leftBatPosition.y &&
    ballPosition.y <= leftBatPosition.y + GAME_CONSTANTS.BAT_HEIGHT;

  return ballReachesLeftPaddleArea && ballWithinPaddleHeight;
};

export const collidedWithRightBat = (
  ballPosition: BallPosition,
  rightBatPosition: BatPosition,
  screenWidth: number
): boolean => {
  const ballReachesRightPaddleArea =
    ballPosition.x >=
    screenWidth -
      GAME_CONSTANTS.BAT_WIDTH -
      GAME_CONSTANTS.BAT_INDENT -
      GAME_CONSTANTS.BALL_SIZE;

  const ballWithinPaddleHeight =
    ballPosition.y >= rightBatPosition.y &&
    ballPosition.y <= rightBatPosition.y + GAME_CONSTANTS.BAT_HEIGHT;

  return ballReachesRightPaddleArea && ballWithinPaddleHeight;
};

export const collidedWithWall = (
  ballPosition: BallPosition,
  screenHeight: number
): boolean => {
  return (
    ballPosition.y <= 0 ||
    ballPosition.y >= screenHeight - GAME_CONSTANTS.BALL_SIZE
  );
};

export const isOutOfBoundaries = (
  ballPosition: BallPosition,
  screenWidth: number
): boolean => {
  const leftBound = GAME_CONSTANTS.BAT_INDENT + GAME_CONSTANTS.BAT_WIDTH - 2;
  const rightBound =
    screenWidth -
    GAME_CONSTANTS.BAT_INDENT -
    GAME_CONSTANTS.BAT_WIDTH -
    GAME_CONSTANTS.BALL_SIZE +
    2;

  return ballPosition.x < leftBound || ballPosition.x > rightBound;
};
