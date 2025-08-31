import type { FC } from "react";
import "./ball.css";

export const Ball: FC<
  { size: number } & React.RefAttributes<HTMLDivElement>
> = (props) => {
  return (
    <div
      ref={props.ref}
      className="ball"
      style={{
        width: `${props.size}px`,
        height: `${props.size}px`,
      }}
    ></div>
  );
};
