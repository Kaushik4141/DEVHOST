
import ic_banknotes from '../../../../public/svgs/ic_banknotes.svg';
import ic_circle_stack from '../../../../public/svgs/ic_circle_stack.svg';
import ic_arrows_left_right from '../../../../public/svgs/ic_arrows_right_left.svg';
import ic_tech from '../../../../public/svgs/ic_tech.svg';
import ic_card from '../../../../public/svgs/ic_card.svg';
import ic_bot from '../../../../public/svgs/ic_bot.svg';

// For desktop
export const desktopHeaderPhrase = ['Your Learning Flow,', 'Your Way'];
export const desktopParagraphPhrase = [
  'We believe that mastering development should be intuitive and personalized. That\'s why we offer you the freedom to learn on your terms.',
];
export const desktopBriefNotePhrase = [
  'Interactive lessons,',
  'AI Guidance, and',
  'real-world projects, all in',
  'one place.',
];

// For mobile
export const mobileHeaderPhrase = ['Your Learning', 'Flow, Your Way'];
export const mobileParagraphPhrase = [
  'We believe that mastering development should be',
  "intuitive and personalized. That's why we offer",
  ' you the freedom you deserve.',
];

export const mobileBriefNotePhrase = [
  'Smart',
  ' investments,',
  'secure',
  ' payments,',
  'and expert',
  'guidance, all',
  'in one place.',
];

export const edges = [
  {
    point: 'Select your technology',
    details:
      'Start by choosing a framework, library, or a full career path. Our AI curates a personalized curriculum based on your goals and existing knowledge.',
    icon: ic_tech,
  },
  {
    point: 'Engage with interactive cards',
    details:
      'Dive into the bite-sized lessons that combine clear summaries with hands-on code examples. Test your knowledge with mini-quizzes after each concept.',
    icon: ic_card,
  },
  {
    point: 'Never get stuck again',
    details:
      'Receive personalized help and guidance from an AI assistant whenever you get stuck.',
    icon: ic_bot,
  },
];
