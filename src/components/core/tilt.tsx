import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, MotionValue } from "framer-motion";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Max tilt rotation in degrees. */
  rotationFactor?: number;
  /** Inverts tilt direction (card tilts away from the cursor instead of toward it). */
  isReverse?: boolean;
  /** Alias for isReverse, matching the original reference API's spelling. */
  isRevese?: boolean;
  /** Spring config for the smoothing. */
  springConfig?: { stiffness?: number; damping?: number; mass?: number };
  /** Perspective (px) applied to the wrapper. */
  perspective?: number;
  /** Slight scale-up applied on hover. */
  scaleOnHover?: number;
}

export function Tilt({
  children,
  className,
  style,
  rotationFactor = 8,
  isReverse = false,
  isRevese,
  springConfig = { stiffness: 300, damping: 30, mass: 0.5 },
  perspective = 800,
  scaleOnHover = 1,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reversed = isRevese ?? isReverse;

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX: MotionValue<number> = useSpring(0, springConfig);
  const rotateY: MotionValue<number> = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);

    const dir = reversed ? -1 : 1;
    const nextRotateY = (px - 0.5) * 2 * rotationFactor * dir;
    const nextRotateX = -(py - 0.5) * 2 * rotationFactor * dir;

    rotateX.set(nextRotateX);
    rotateY.set(nextRotateY);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
