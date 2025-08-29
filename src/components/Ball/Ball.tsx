import { forwardRef } from "react";
import "./ball.css";

export const Ball = forwardRef<HTMLDivElement>((_props, ref) => {
  return <div ref={ref} className="ball"></div>;
});
