import { ButtonHTMLAttributes, useRef, useState } from "react";
import { motion } from "framer-motion";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number;
};

/** Pill button that subtly leans toward the cursor. Resets with a spring on leave. */
export function MagneticButton({
  children,
  className,
  strength = 14,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      animate={{ x: offset.x, y: offset.y }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
          setOffset({ x, y });
        }
        onMouseMove?.(e);
      }}
      onMouseLeave={(e) => {
        setOffset({ x: 0, y: 0 });
        onMouseLeave?.(e);
      }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
