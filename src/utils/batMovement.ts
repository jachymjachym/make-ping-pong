import { GAME_CONSTANTS } from "../constants";

export type BatState = {
  y: number;
};

export type GameBounds = {
  height: number;
};

export const resetBatsPosition = (bounds: GameBounds): BatState => {
  const { BAT_HEIGHT } = GAME_CONSTANTS;

  return {
    y: bounds.height / 2 - BAT_HEIGHT / 2,
  };
};
