import { StaticImageData } from 'next/image';
import robert_fox from '../../../../public/images/robert_fox.png';
import cameron_williamson from '../../../../public/images/cameron_williamson.png';
import esther_howard from '../../../../public/images/esther_howard.png';

export type Props = {
  testimony: string;
  person: string;
  avatar: StaticImageData;
};

export const testimonials = [
  {
    testimony:
      "As a computer science student, LearnFlow is my secret weapon. It breaks down complex topics into manageable cards and quizzes that actually make sense. I'm learning faster and with more confidence.",
    person: 'Robert Fox',
    avatar: robert_fox,
  },
  {
    testimony:
      "I struggled with the official React docs for weeks. With LearnFlow, the concepts finally clicked in a single afternoon. The AI mentor is a game-changer for debugging.",
    person: 'Esther Howard',
    avatar: esther_howard,
  },
  {
    testimony:
      "The best way to learn a new stack for work, period. I got up to speed with Docker and Kubernetes in a fraction of the time it would normally take. Highly recommended.",
    person: 'Cameron Williamson',
    avatar: cameron_williamson,
  },
];

export const desktopHeaderPhrase = ['Join our community of', 'learners'];