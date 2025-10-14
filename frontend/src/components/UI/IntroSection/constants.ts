import ic_document_duplicate from '../../../../public/svgs/ic_document_duplicate.svg';
import ic_identification from '../../../../public/svgs/ic_identification.svg';
import ic_lock_closed from '../../../../public/svgs/ic_lock_closed.svg';

// For desktop
export const desktopHeaderPhrase = ['Introducing LearnFlow', 'Interactive Learning'];
export const desktopParagraphPhrase = [
  'Experience a new way of learning with our cutting-edge platform.',
  'Master coding through interactive lessons, AI assistance,',
  'and personalized learning paths.',
];

// For mobile
export const mobileHeaderPhrase = ['Introducing', 'LearnFlow'];
export const mobileParagraphPhrase = [
  'Experience a new way of learning',
  'with our cutting-edge platform.',
  'Master coding through interactive',
  'lessons and AI assistance.',
];

export const edges = [
  {
    point: 'Interactive Learning',
    details:
      'Learn coding hands-on with our integrated code sandboxes and interactive exercises. Practice in real-time and get immediate feedback on your progress.',
    icon: ic_document_duplicate,
  },
  {
    point: 'Personalized Path',
    details:
      'Our AI analyzes your learning style and goals to create a custom curriculum. Advance at your own pace through carefully curated content tailored just for you.',
    icon: ic_identification,
  },
  {
    point: 'AI-Powered Support',
    details:
      'Get instant help from our AI tutor whenever you need it. From code debugging to concept explanations, expert assistance is available 24/7.',
    icon: ic_lock_closed,
  },
];
