import type { FC } from "react";
import "./bat.css";

export type BatProps = {
  width: number;
  height: number;
} & (
  | { positionLeft: number; positionRight?: never }
  | { positionLeft?: never; positionRight: number }
);

export const Bat: FC<BatProps & React.RefAttributes<HTMLDivElement>> = ({
  positionLeft,
  positionRight,
  width,
  height,
  ref,
}) => {
  return (
    <div
      ref={ref}
      className="bat"
      style={{
        left: positionLeft,
        right: positionRight,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};
