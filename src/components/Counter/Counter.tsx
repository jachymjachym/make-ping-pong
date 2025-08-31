import type { FC } from "react";
import "./counter.css";

export type CounterProps = {
  count: number;
};

export const Counter: FC<CounterProps> = ({ count }) => {
  return (
    <div
      className="counter"
      role="status"
      aria-label={`Current Score: ${count} ${count === 1 ? "point" : "points"}`}
    >
      {count}
    </div>
  );
};
