'use client';
import { Body, LineMask } from './styles';
import { useInView, motion } from 'framer-motion';
import { useRef } from 'react';

type MaskTextProps = {
  phrases: string[];
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  duration?: number;
  delayStep?: number;
};

const MaskText = ({
  phrases,
  tag = 'p',
  className,
  duration = 1,
  delayStep = 0.1,
}: MaskTextProps) => {
  const animate = {
    initial: { y: '100%' },
    open: (i: number) => ({
      y: '0%',
      transition: { duration, delay: delayStep * i, ease: [0.33, 1, 0.68, 1] },
    }),
  };

  const body = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(body, { once: true, margin: '-10%', amount: 0.4 });

  const MotionTag = motion[tag as keyof typeof motion] as any;

  return (
    <Body ref={body}>
      {phrases.map((phrase, index) => (
        <LineMask key={index}>
          <MotionTag
            className={className}
            variants={animate}
            initial="initial"
            animate={isInView ? 'open' : ''}
            custom={index}
          >
            {phrase}
          </MotionTag>
        </LineMask>
      ))}
    </Body>
  );
};

export default MaskText;
