'use client';
import Image from 'next/image';
import { styled } from 'styled-components';

export const Wrapper = styled.section`
  padding-top: 7.5rem;

  @media (max-width: 768px) {
    padding-top: 6rem;
  }
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 1440px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 56rem;
  margin: 0 auto 7.38rem;

  h3 {
    color: var(--emerald);
    font-size: 1.125rem;
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 4.75rem;
    font-weight: 400;
  }

  p {
    max-width: 41.75rem;
    color: var(--link-color);
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.75rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.25rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }
`;

export const HeaderMainText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 7.77rem;
  width: 100%;
  min-height: 40rem;
  gap: 2rem;
`;

export const CardWrapper = styled.div`
  position: relative;
  width: 21.875rem;
  height: 13.875rem;
`;

export const CardComment = styled.div`
  position: absolute;
  left: 50%;
  bottom: -2rem;
  transform: translateX(-50%);
  background-color: var(--emerald);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  text-align: center;
  width: max-content;
  z-index: 4;

  &.active {
    opacity: 1;
  }
`;

export const LeftImage = styled(Image)`
  width: 21.875rem;
  height: 13.875rem;
  transform: rotate(0deg);
  transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);

  &.active {
    transform: translateX(-150px);
  }
`;

export const MiddleImage = styled(Image)`
  width: 21.875rem;
  height: 13.875rem;
  cursor: pointer;
  transform: rotate(0deg);
  transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);

  &.active {
    transform: scale(1.05);
  }
`;

export const RightImage = styled(Image)`
  width: 21.875rem;
  height: 13.875rem;
  transform: rotate(0deg);
  transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);

  &.active {
    transform: translateX(150px);
  }
`;
