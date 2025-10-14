'use client';
import Image from 'next/image';
import { OfferCard as StyledOfferCard, ImageCtn, TextCtn } from './styles';
import MaskText from '@/components/Common/MaskText';

interface OfferCardProps {
  illustration: string;
  title: string;
  details: string;
}

const OfferCard = ({ illustration, title, details }: OfferCardProps) => {
  return (
    <StyledOfferCard>
      <ImageCtn>
        <Image 
          src={illustration} 
          alt={title}
          width={800}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </ImageCtn>
      <TextCtn>
        <MaskText phrases={[title]} tag="h2" />
        <p>{details}</p>
      </TextCtn>
    </StyledOfferCard>
  );
};

export default OfferCard;