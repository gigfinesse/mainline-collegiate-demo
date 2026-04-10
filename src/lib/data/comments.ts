import type { Comment } from '@/lib/types';

const ago = (daysAgo: number, hours = 0) => {
  const d = new Date('2026-04-10T12:00:00');
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

export const comments: Comment[] = [
  // ── evt-3: Neon Nights ──
  {
    id: 'cmt-1',
    eventId: 'evt-3',
    userId: 'user-jake',
    text: 'this is gonna be INSANE',
    reactions: [
      { emoji: '🔥', userId: 'user-marcus' },
      { emoji: '🔥', userId: 'user-noah' },
      { emoji: '🔥', userId: 'user-ethan' },
    ],
    createdAt: ago(2, 5),
  },
  {
    id: 'cmt-2',
    eventId: 'evt-3',
    userId: 'user-sarah',
    text: 'wear white!! the glow paint is going to hit different',
    reactions: [
      { emoji: '✨', userId: 'user-emma' },
      { emoji: '💜', userId: 'user-marcus' },
    ],
    createdAt: ago(2, 3),
  },
  {
    id: 'cmt-3',
    eventId: 'evt-3',
    userId: 'user-noah',
    text: 'who\'s pulling up early to help set up?',
    reactions: [{ emoji: '🙋', userId: 'user-jake' }],
    createdAt: ago(1, 8),
  },
  {
    id: 'cmt-4',
    eventId: 'evt-3',
    userId: 'user-emma',
    text: 'TD is coming through DEEP for this one',
    reactions: [
      { emoji: '🔥', userId: 'user-sarah' },
      { emoji: '💅', userId: 'user-olivia' },
    ],
    createdAt: ago(1, 4),
  },
  {
    id: 'cmt-5',
    eventId: 'evt-3',
    userId: 'user-ben',
    text: 'last KSP darty was legendary. this one\'s gonna top it',
    reactions: [{ emoji: '🔥', userId: 'user-marcus' }],
    createdAt: ago(1, 2),
  },

  // ── evt-4: Spring Formal ──
  {
    id: 'cmt-6',
    eventId: 'evt-4',
    userId: 'user-olivia',
    text: 'already got my dress!! who needs a date tho 😭',
    reactions: [
      { emoji: '😂', userId: 'user-sophia' },
      { emoji: '😂', userId: 'user-mia' },
      { emoji: '🥰', userId: 'user-sarah' },
    ],
    createdAt: ago(3, 6),
  },
  {
    id: 'cmt-7',
    eventId: 'evt-4',
    userId: 'user-marcus',
    text: 'KSP boys are showing up suited and booted',
    reactions: [{ emoji: '🔥', userId: 'user-jake' }],
    createdAt: ago(2, 4),
  },
  {
    id: 'cmt-8',
    eventId: 'evt-4',
    userId: 'user-sophia',
    text: 'the venue is SO gorgeous, you guys are going to love it',
    reactions: [
      { emoji: '😍', userId: 'user-charlotte' },
      { emoji: '✨', userId: 'user-amelia' },
    ],
    createdAt: ago(1, 7),
  },
  {
    id: 'cmt-9',
    eventId: 'evt-4',
    userId: 'user-priya',
    text: 'can\'t wait! TD always goes off for formal',
    reactions: [{ emoji: '💜', userId: 'user-sarah' }],
    createdAt: ago(1, 2),
  },

  // ── evt-5: Rush Week Kickoff ──
  {
    id: 'cmt-10',
    eventId: 'evt-5',
    userId: 'user-tyler',
    text: 'is this actually open to anyone? I\'m interested',
    reactions: [{ emoji: '👍', userId: 'user-marcus' }],
    createdAt: ago(1, 5),
  },
  {
    id: 'cmt-11',
    eventId: 'evt-5',
    userId: 'user-marcus',
    text: 'yeah bro come through! everyone\'s welcome',
    reactions: [
      { emoji: '🙏', userId: 'user-tyler' },
      { emoji: '💪', userId: 'user-liam' },
    ],
    createdAt: ago(1, 4),
  },
  {
    id: 'cmt-12',
    eventId: 'evt-5',
    userId: 'user-liam',
    text: 'free food alone is worth it. trust me on the wings.',
    reactions: [{ emoji: '🔥', userId: 'user-noah' }],
    createdAt: ago(0, 8),
  },

  // ── evt-6: Underground Sessions ──
  {
    id: 'cmt-13',
    eventId: 'evt-6',
    userId: 'user-priya',
    text: 'the last one was unreal. Isabella\'s DJ sets hit different at 1am',
    reactions: [
      { emoji: '🎵', userId: 'user-isabella' },
      { emoji: '🔥', userId: 'user-james' },
    ],
    createdAt: ago(1, 6),
  },
  {
    id: 'cmt-14',
    eventId: 'evt-6',
    userId: 'user-chloe',
    text: 'bringing my film camera for this one',
    reactions: [{ emoji: '📸', userId: 'user-priya' }],
    createdAt: ago(0, 10),
  },

  // ── evt-7: Game Day Tailgate ──
  {
    id: 'cmt-15',
    eventId: 'evt-7',
    userId: 'user-ava',
    text: 'RALLY RALLY RALLY! we\'re setting up at 8am',
    reactions: [
      { emoji: '🏈', userId: 'user-marcus' },
      { emoji: '🏈', userId: 'user-ethan' },
      { emoji: '🔥', userId: 'user-noah' },
    ],
    createdAt: ago(2, 3),
  },
  {
    id: 'cmt-16',
    eventId: 'evt-7',
    userId: 'user-marcus',
    text: 'bringing the speaker and cornhole boards',
    reactions: [{ emoji: '🙌', userId: 'user-ava' }],
    createdAt: ago(1, 5),
  },
  {
    id: 'cmt-17',
    eventId: 'evt-7',
    userId: 'user-tyler',
    text: 'first tailgate of the semester!! let\'s goooo',
    reactions: [{ emoji: '🔥', userId: 'user-lucas' }],
    createdAt: ago(0, 6),
  },

  // ── evt-9: Philanthropy Gala ──
  {
    id: 'cmt-18',
    eventId: 'evt-9',
    userId: 'user-sarah',
    text: 'so proud of this event. we raised $12k last year, let\'s beat it!',
    reactions: [
      { emoji: '💜', userId: 'user-emma' },
      { emoji: '🙏', userId: 'user-olivia' },
      { emoji: '❤️', userId: 'user-priya' },
    ],
    createdAt: ago(1, 3),
  },
  {
    id: 'cmt-19',
    eventId: 'evt-9',
    userId: 'user-marcus',
    text: 'KSP is donating a whole table. count us in',
    reactions: [{ emoji: '🙌', userId: 'user-sarah' }],
    createdAt: ago(0, 8),
  },

  // ── evt-13: KSP x TD Mixer ──
  {
    id: 'cmt-20',
    eventId: 'evt-13',
    userId: 'user-emma',
    text: 'KSP x TD is literally the collab of the century',
    reactions: [
      { emoji: '🔥', userId: 'user-marcus' },
      { emoji: '🔥', userId: 'user-sarah' },
      { emoji: '💜', userId: 'user-olivia' },
    ],
    createdAt: ago(1, 4),
  },
  {
    id: 'cmt-21',
    eventId: 'evt-13',
    userId: 'user-jake',
    text: 'the crossover episode we needed',
    reactions: [
      { emoji: '😂', userId: 'user-noah' },
      { emoji: '💀', userId: 'user-liam' },
    ],
    createdAt: ago(0, 9),
  },
  {
    id: 'cmt-22',
    eventId: 'evt-13',
    userId: 'user-sophia',
    text: 'need a plus one desperately 😭',
    reactions: [{ emoji: '😂', userId: 'user-mia' }],
    createdAt: ago(0, 5),
  },

  // ── evt-15: Open Mic Night ──
  {
    id: 'cmt-23',
    eventId: 'evt-15',
    userId: 'user-isabella',
    text: 'sign-up sheet is live! DM me to get a slot',
    reactions: [{ emoji: '🎤', userId: 'user-priya' }],
    createdAt: ago(0, 7),
  },
  {
    id: 'cmt-24',
    eventId: 'evt-15',
    userId: 'user-james',
    text: 'doing a spoken word piece. kinda nervous ngl',
    reactions: [
      { emoji: '💪', userId: 'user-isabella' },
      { emoji: '❤️', userId: 'user-chloe' },
    ],
    createdAt: ago(0, 4),
  },

  // ── evt-1: Welcome Back Rager (past) ──
  {
    id: 'cmt-25',
    eventId: 'evt-1',
    userId: 'user-jake',
    text: 'that was easily top 3 parties I\'ve been to at MSU',
    reactions: [
      { emoji: '🔥', userId: 'user-marcus' },
      { emoji: '💯', userId: 'user-noah' },
    ],
    createdAt: ago(13, 2),
  },
  {
    id: 'cmt-26',
    eventId: 'evt-1',
    userId: 'user-sarah',
    text: 'the DJ was actually insane. who was that??',
    reactions: [{ emoji: '🎵', userId: 'user-emma' }],
    createdAt: ago(13, 1),
  },

  // ── evt-10: Darty Szn ──
  {
    id: 'cmt-27',
    eventId: 'evt-10',
    userId: 'user-jake',
    text: 'darty szn is officially upon us',
    reactions: [
      { emoji: '☀️', userId: 'user-marcus' },
      { emoji: '🔥', userId: 'user-liam' },
    ],
    createdAt: ago(0, 3),
  },

  // ── evt-11: Gallery Night ──
  {
    id: 'cmt-28',
    eventId: 'evt-11',
    userId: 'user-priya',
    text: 'submitting three pieces. one of them is a collage I\'ve been working on all semester',
    reactions: [
      { emoji: '🎨', userId: 'user-isabella' },
      { emoji: '✨', userId: 'user-sarah' },
    ],
    createdAt: ago(1, 2),
  },

  // ── evt-12: Championship Watch Party ──
  {
    id: 'cmt-29',
    eventId: 'evt-12',
    userId: 'user-noah',
    text: 'MSU ALL THE WAY!! we\'re winning this one',
    reactions: [
      { emoji: '🏈', userId: 'user-ava' },
      { emoji: '🔥', userId: 'user-marcus' },
      { emoji: '💪', userId: 'user-lucas' },
    ],
    createdAt: ago(0, 2),
  },

  // ── evt-14: Pregame at PL ──
  {
    id: 'cmt-30',
    eventId: 'evt-14',
    userId: 'user-logan',
    text: 'keeping it tight. you know how we do.',
    reactions: [{ emoji: '🤝', userId: 'user-aiden' }],
    createdAt: ago(1, 1),
  },
];
