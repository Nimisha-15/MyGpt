import Spline from "@splinetool/react-spline";
import { forwardRef } from "react";

const SplineScene = forwardRef(({ scene, className }, ref) => {
  return <Spline ref={ref} scene={scene} className={className} />;
});

export default SplineScene;
