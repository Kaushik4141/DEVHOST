'use client';
import {
  Wrapper,
  Inner,
  Header,
  Offers,
} from './styles';
import MaskText from '@/components/Common/MaskText';
import { useIsMobile } from '../../../../libs/useIsMobile';
import {
  desktopHeaderPhrases,
  desktopParagraphPhrase,
  mobileParagraphPhrase,
  offers,
} from './constants';
import OfferCard from './OfferCard';

const OffersSection = () => {
  const isMobile = useIsMobile();
  
  if (!offers || offers.length === 0) {
    return null;
  }
  
  return (
    <Wrapper>
      <Inner>
        <Header>
          <MaskText phrases={desktopHeaderPhrases} tag="h1" />

          {isMobile ? (
            <MaskText phrases={mobileParagraphPhrase} tag="p" />
          ) : (
            <MaskText phrases={desktopParagraphPhrase} tag="p" />
          )}
        </Header>
        <Offers>
          {offers?.slice(0, 2).map((offer, i) => (
            <OfferCard
              key={i}
              illustration={offer.illustration}
              title={offer.title}
              details={offer.details}
            />
          ))}
        </Offers>
        <Offers>
          {offers?.slice(2, 4).map((offer, i) => (
            <OfferCard
              key={i}
              illustration={offer.illustration}
              title={offer.title}
              details={offer.details}
            />
          ))}
        </Offers>
      </Inner>
    </Wrapper>
  );
};

export default OffersSection;