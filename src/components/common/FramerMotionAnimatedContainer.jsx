import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FramerMotionAnimatedContainer = ({ children }) => {
  const divRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: divRef,
    offset: ["0 1", "1,3 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <motion.div
      ref={divRef}
      style={{
        opacity: scrollYProgress,
        scale: scaleProgress,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FramerMotionAnimatedContainer;
