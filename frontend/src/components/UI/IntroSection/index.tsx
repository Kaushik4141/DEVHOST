'use client';
import { useState } from 'react';
import Image from 'next/image';
/* Commented out unused imports
import { Edge, Edges, Title } from '../FinancialFreedom/styles';
*/
/* Commented out card imports
import interactive_card from '../../../../public/images/new.jpg';
import grow_card from '../../../../public/images/grow.jpg';
import ai_card from '../../../../public/images/aiass.jpg';
*/
import {
  Wrapper,
  Inner,
  Header,
  HeaderMainText,
  /* Commented out card components
  CardsContainer,
  LeftImage,
  MiddleImage,
  RightImage,
  */
} from './styles';
import { MaskText } from '@/components';
import { useIsMobile } from '../../../../libs/useIsMobile';
import {
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  edges,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
} from './constants';

const IntroSection = () => {
  const isMobile = useIsMobile();
  // Commented out unused state
  // const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <Wrapper>
      <Inner>
        <Header>
          <h3>Introducing</h3>
          <HeaderMainText>
            {isMobile ? (
              <>
                <MaskText phrases={mobileHeaderPhrase} tag="h1" />
                <MaskText phrases={mobileParagraphPhrase} tag="p" />
              </>
            ) : (
              <>
                <MaskText phrases={desktopHeaderPhrase} tag="h1" />
                <MaskText phrases={desktopParagraphPhrase} tag="p" />
              </>
            )}
          </HeaderMainText>
        </Header>
        {/* Cards section commented out
        <CardsContainer>
          <LeftImage
            className={isHovered ? 'active' : ''}
            src={interactive_card}
            alt="interactive learning"
            width={350}
            height={222}
            priority
          />
          <MiddleImage
            className={isHovered ? 'active' : ''}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            src={grow_card}
            alt="grow with us"
            width={350}
            height={222}
            priority
          />
          <RightImage
            className={isHovered ? 'active' : ''}
            src={ai_card}
            alt="ai assistance"
            width={350}
            height={222}
            priority
          />
        </CardsContainer>
        */}
        {/* Community section commented out
        <Edges>
          {edges.map((edge, i) => (
            <Edge key={i}>
              <Title>
                <Image src={edge.icon} alt="icon" />
                <MaskText phrases={new Array(edge.point)} tag="h3" />
              </Title>
              <MaskText phrases={new Array(edge.details)} tag="p" />
            </Edge>
          ))}
        </Edges>
        */}
      </Inner>
    </Wrapper>
  );
};

export default IntroSection;
