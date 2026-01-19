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
        content: `Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.`,
        reflectionPrompt: 'What things in your life do you try to control that might actually be outside your control?'
      },
      {
        id: '1-2',
        title: 'The Nature of Control',
        content: `The things in our control are by nature free, unrestrained, unhindered; but those not in our control are weak, slavish, restrained, belonging to others. Remember, then, that if you suppose that things which are slavish by nature are also free, and that what belongs to others is your own, then you will be hindered. You will lament, you will be disturbed, and you will find fault both with gods and men.`,
        reflectionPrompt: 'How has attempting to control the uncontrollable created suffering in your life?'
      },
      {
        id: '1-3',
        title: 'Freedom Through Acceptance',
        content: `But if you suppose that only to be your own which is your own, and what belongs to others such as it really is, then no one will ever compel you or restrain you. Further, you will find fault with no one or accuse no one. You will do nothing against your will. No one will hurt you, you will have no enemies, and you will not be harmed.`,
        reflectionPrompt: 'What would your life look like if you fully accepted what is outside your control?'
      }
    ],
    challenges: [
      {
        id: '1-c1',
        title: 'Dichotomy of Control Exercise',
        description: 'Make a list of 5 things in your life that are in your control and 5 things that are not in your control...',
        xpAward: 30,
        type: 'list'
      },
      {
        id: '1-c2',
        title: 'Daily Reflection Practice',
        description: 'For one day, whenever you feel frustrated or anxious, exercise for 15 minutes',
        xpAward: 40,
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
        content: `Aiming therefore at such great things, remember that you must not allow yourself to be carried, even with a slight tendency, towards the attainment of lesser things. Instead, you must entirely quit some things and for the present postpone the rest.`,
        reflectionPrompt: 'What lesser desires might be distracting you from what truly matters?'
      },
      {
        id: '2-2',
        title: 'Freedom from Disappointment',
        content: `But if you would both have these great things, along with power and riches, then you will not gain even the latter, because you aim at the former too: but you will absolutely fail of the former, by which alone happiness and freedom are achieved.`,
        reflectionPrompt: 'How has pursuing external success affected your inner tranquility?'
      },
      {
        id: '2-3',
        title: 'Practice of Aversion',
        content: `Work, therefore, to be able to say to every harsh appearance, "You are but an appearance, and not absolutely the thing you appear to be." And then examine it by those rules which you have, and first, and chiefly, by this: whether it concerns the things which are in our own control, or those which are not; and, if it concerns anything not in our control, be prepared to say that it is nothing to you.`,
        reflectionPrompt: 'What are your thoughts on the practice of aversion as described?'
      }
    ],
    challenges: [
      {
        id: '2-c1',
        title: 'Mapping Desires & Aversions',
        description: 'Take a moment to reflect on your typical day or week. List two things you strongly desire to happen or to obtain, and two things you actively try to avoid. For each item, briefly note whether it is truly within your full control or largely external.',
        xpAward: 35,
        type: 'journal'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Understanding Attachments',
    description: 'How to relate wisely to things we love',
    icon: 'heart',
    color: '#FF6B6B',
    background: 'backgrounds/chapter3.jpg',
    next: '4',
    sections: [
      {
        id: '3-1',
        title: 'The Nature of Attachments',
        content: `With regard to whatever objects give you delight, are useful, or are deeply loved, remember to tell yourself of what general nature they are, beginning from the most insignificant things. If, for example, you are fond of a specific ceramic cup, remind yourself that it is only ceramic cups in general of which you are fond. Then, if it breaks, you will not be disturbed.`,
        reflectionPrompt: 'What possessions or relationships are you most attached to, and how might this attachment create vulnerability?'
      },
      {
        id: '3-2',
        title: 'Preparation for Loss',
        content: `When you kiss your child, your brother, or your friend, never allow your fancy to range at will, nor your joy to go as far as it may wish; but curb it, stop it, just like those who stand behind generals when they ride in triumph, and keep reminding them that they are mortal. Similarly, remind yourself that the object of your love is mortal; that what you love is not your own; it is granted to you for the present, not irrevocably nor forever, but like a fig or a bunch of grapes at the appointed season of the year.`,
        reflectionPrompt: 'How might considering the temporary nature of all relationships change how you interact with loved ones?'
      },
      {
        id: '3-3',
        title: 'Freedom Through Detachment',
        content: `And in summer-time, if you reach out your hand for figs, and if someone says, "It is yet early, not yet the season for figs", do not say, "What a wretched place is this, where there are no early figs!" Instead say, "It is yet early in the season for figs." So likewise, if you desire at an unseasonable time to embrace your child or your brother, remind yourself that it is a fig you are asking for in winter.`,
        reflectionPrompt: 'In what areas of life might you benefit from accepting natural timing rather than demanding what you want immediately?'
      }
    ],
    challenges: [
      {
        id: '3-c1',
        title: 'Attachment Inventory',
        description: 'Make a list of five things or people you feel most attached to. For each one, write down what it would mean to love them while accepting their temporary nature. How would your behavior or attitude change?',
        xpAward: 40,
        type: 'list'
      },
      {
        id: '3-c2',
        title: 'Impermanence Meditation',
        description: 'For three days, begin each morning by spending 5 minutes contemplating the impermanent nature of something you value. Notice how this reflection affects your appreciation of it throughout the day.',
        xpAward: 50,
        type: 'practice'
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Dealing with Difficulties',
    description: 'Approaching challenges with the right mindset',
    icon: 'mountain',
    color: '#9013FE',
    background: 'backgrounds/chapter4.jpg',
    next: '5',
    sections: [
      {
        id: '4-1',
        title: 'Preparation for Challenges',
        content: `When you are going about any action, remind yourself what nature the action is. If you are going to bathe, picture to yourself the things which usually happen in the bath: some people splash the water, some push, some use abusive language, and others steal. Thus you will more safely go about this action if you say to yourself, "I will now go bathe, and keep my own mind in a state conformable to nature." And in the same manner with regard to every other action.`,
        reflectionPrompt: 'How might mentally rehearsing potential challenges before they happen change your reactions when they do occur?'
      },
      {
        id: '4-2',
        title: 'Accepting What Happens',
        content: `For thus, if any hindrance arises in bathing you will have it ready to say, "It was not only to bathe that I desired, but to keep my mind in a state conformable to nature; and I will not keep it if I am bothered at things that happen."`,
        reflectionPrompt: 'What recent situation frustrated you because you were focused solely on your goal rather than maintaining your equanimity?'
      }
    ],
    challenges: [
      {
        id: '4-c1',
        title: 'Premeditation of Adversity',
        description: 'Before an upcoming potentially stressful event (meeting, travel, social gathering), take 10 minutes to imagine what could go wrong and how you would maintain your composure. Focus especially on keeping your inner peace rather than on the outcome.',
        xpAward: 45,
        type: 'practice'
      },
      {
        id: '4-c2',
        title: 'Dual Purpose Journal',
        description: 'For one week, whenever you plan an activity, write down both your practical goal AND your philosophical goal (maintaining equanimity, practicing patience, etc.). After the activity, reflect on which goal you accomplished.',
        xpAward: 55,
        type: 'journal'
      }
    ]
  },
  '5': {
    id: '5',
    title: 'Disturbances of the Mind',
    description: 'Understanding the true source of distress',
    icon: 'brain',
    color: '#F5A623',
    background: 'backgrounds/chapter5.jpg',
    next: '6',
    sections: [
      {
        id: '5-1',
        title: 'The Source of Disturbance',
        content: `Men are disturbed not by things, but by the views which they take of things. Thus death is nothing terrible, else it would have appeared so to Socrates. But the terror consists in our notion of death, that it is terrible. When, therefore, we are hindered or disturbed, or grieved, let us never blame others, but ourselves—that is, our own views.`,
        reflectionPrompt: 'Think of a recent situation that upset you. How might your interpretation of events, rather than the events themselves, have caused your distress?'
      },
      {
        id: '5-2',
        title: 'Taking Responsibility',
        content: `It is the action of an uninstructed person to reproach others for his own misfortunes; of one entering upon instruction, to reproach himself; and of one perfectly instructed, to reproach neither others nor himself.`,
        reflectionPrompt: 'Where are you on this spectrum of development—blaming others, blaming yourself, or accepting circumstances without blame?'
      }
    ],
    challenges: [
      {
        id: '5-c1',
        title: 'Cognitive Distancing Exercise',
        description: 'For three days, whenever you feel upset by something, pause and say to yourself, "I am not disturbed by [event], but by my opinion about [event]." Then try to identify the specific judgment or interpretation causing your distress.',
        xpAward: 50,
        type: 'practice'
      },
      {
        id: '5-c2',
        title: 'Alternative Perspectives Challenge',
        description: 'Choose a situation that has been bothering you. Write down your current interpretation, then force yourself to write at least three alternative ways of viewing the same situation that would lead to less distress.',
        xpAward: 45,
        type: 'journal'
      }
    ]
  }
};

export const getChapterById = (id) => chapters[id];

// Optional: Add a function to get all chapters
export const getAllChapters = () => Object.values(chapters);

// Optional: Add a function to get the first chapter ID
export const getFirstChapterId = () => Object.keys(chapters)[0];

// Optional: Add a function to get the next chapter ID
export const getNextChapterId = (currentChapterId) => {
  const chapterKeys = Object.keys(chapters);
  const currentIndex = chapterKeys.indexOf(currentChapterId);
  if (currentIndex === -1 || currentIndex === chapterKeys.length - 1) {
    return null; // No next chapter
  }
  return chapterKeys[currentIndex + 1];
};