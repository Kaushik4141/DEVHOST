type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ['Frequently asked', 'questions'];
export const mobileHeaderPhrase = ['Frequently', 'asked', 'questions'];
export const animate = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  open: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

export const faqData: FAQItem[] = [
  {
    question: 'What exactly is LearnFlow?',
    answer:
      'LearnFlow is an AI-powered learning platform that transforms dense, static developer documentation into interactive, easy-to-understand lessons. Instead of just reading, you learn through hands-on code sandboxes, summaries, and quizzes, all guided by our AI to help you master new technologies faster..',
  },
  {
    question: 'How does LearnFlow personalize my learning???',
    answer:
      'Our AI assesses your progress and goals to create a custom learning path just for you. It simplifies explanations and suggests content based on your needs. .',
  },
  {
    question: 'Can LearnFlow help me with coding errors??',
    answer:
      'Yes, our AI Debug Assistant provides instant suggestions and explanations for coding mistakes in the built-in sandbox. Its like having a personal tutor for your code..',
  },
  {
    question: 'What kind of content does LearnFlow offer?',
    answer:
      'We offer interactive learning cards with summaries, code, and quizzes, covering various frameworks and libraries. Plus, guided mini-projects to apply your knowledge directly..'
  },
];
