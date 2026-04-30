import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';

function AnimatedSection({ as = 'section', children, className = '', ...props }, ref) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.section;

  return (
    <MotionTag
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export default forwardRef(AnimatedSection);
