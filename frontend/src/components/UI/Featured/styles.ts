'use client';
import { motion } from 'framer-motion';
import { styled } from 'styled-components';

export const Wrapper = styled.section`
  width: 100%;
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6.25rem auto 0;
  max-width: 1440px;
  width: 90%;

  h2 {
    color: var(--link-color);
    font-size: 1.25rem;
    font-weight: 500;
    text-transform: uppercase;
    margin-top: 6.5rem;
  }

  @media (max-width: 768px) {
    margin-top: 5rem;

    h2 {
      font-size: 1rem;
      margin-top: 3.75rem;
    }
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 35rem; /* exact height */
  max-width: 85rem;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;

  @media (max-width: 768px) {
    height: 23.75rem; /* mobile height */
    border-radius: 0.5rem;
  }
`;

export const Div = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%; /* fill parent */
  overflow: hidden;

  img {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
    position: absolute !important; /* required for next/image fill */
  }
`;

export const ParallaxImages = styled.div`
  position: relative;
  max-width: 53.7rem;
  margin: 3rem auto 0;
  width: 100%;
`;
