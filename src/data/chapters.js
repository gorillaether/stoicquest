/**
 * src/data/chapters.js - Data structure for the Enchiridion content and challenges.
 *
 * This file contains the text of Epictetus' Enchiridion divided into chapters and
 * sections, along with associated challenges and metadata for each chapter.
 */
const chapters = {
  '1': {
    id: '1',
    title: 'What Is In Our Power',
    description: 'Understanding what we can and cannot control',
    icon: 'power',
    color: '#4A90E2',
    background: 'backgrounds/chapter1.jpg',
    next: '2',
    sections: [
      {
        id: '1-1',
        title: 'Introduction to Control',
        content: `Some things are in our control and others not...`,
        reflectionPrompt: 'What things in your life do you try to control that might actually be outside your control?'
      },
      {
        id: '1-2',
        title: 'The Nature of Control',
        content: `The things in our control are by nature free...`,
        reflectionPrompt: 'How has attempting to control the uncontrollable created suffering in your life?'
      },
      {
        id: '1-3',
        title: 'Freedom Through Acceptance',
        content: `But if you suppose that only to be your own which is your own...`,
        reflectionPrompt: 'What would your life look like if you fully accepted what is outside your control?'
      }
    ],
    challenges: [
      {
        id: '1-c1',
        title: 'Dichotomy of Control Exercise',
        description: 'Make a list of 10 things in your life...',
        xpReward: 30,
        type: 'list'
      },
      {
        id: '1-c2',
        title: 'Daily Reflection Practice',
        description: 'For one day, whenever you feel frustrated or anxious...',
        xpReward: 40,
        type: 'journal'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Desire and Aversion',
    description: 'Managing what we want and what we avoid',
    icon: 'compass',
    color: '#50E3C2',
    background: 'backgrounds/chapter2.jpg',
    next: '3',
    sections: [
      {
        id: '2-1',
        title: 'The Goal of Desires',
        content: `Aiming therefore at such great things...`,
        reflectionPrompt: 'What lesser desires might be distracting you from what truly matters?'
      },
      {
        id: '2-2',
        title: 'Freedom from Disappointment',
        content: `But if you would both have these great things...`,
        reflectionPrompt: 'How has pursuing external success affected your inner tranquility?'
      },
      {
        id: '2-3',
        title: 'Practice of Aversion',
        content: `Work, therefore, to be able to say to every harsh appearance...`,
        reflectionPrompt: '