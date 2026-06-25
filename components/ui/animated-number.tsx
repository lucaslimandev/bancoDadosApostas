"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

export function AnimatedNumber({
  value,
  decimals = 1,
  prefix = "",
  suffix = "",
  format,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => (format ? format(v) : `${prefix}${v.toFixed(decimals)}${suffix}`));
  const previous = useRef(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: "easeOut",
    });
    previous.current = value;
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}
