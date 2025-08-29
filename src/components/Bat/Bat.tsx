import { forwardRef } from "react";
import "./bat.css";

export type BatProps =
  | { positionLeft: number; positionRight?: never }
  | { positionLeft?: never; positionRight: number };

export const Bat = forwardRef<HTMLDivElement, BatProps>(
  ({ positionLeft, positionRight }, ref) => {
    return (
      <div
        ref={ref}
        className="bat"
        style={{ left: positionLeft, right: positionRight }}
      />
    );
  }
);
