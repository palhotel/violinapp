import { Song, NoteData } from './types';

export const VIOLIN_STRINGS = ['G', 'D', 'A', 'E'];
export const STRING_COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#eab308']; // Green, Red, Blue, Yellow

// Generate a mock melody for "I See the Light" (Simplified snippet)
const generateMockNotes = (): NoteData[] => {
  const notes: NoteData[] = [];
  let currentTime = 1.0;
  
  // A simple sequence: "All those days watching from the windows"
  // Roughly: A, C#, E, A... 
  const melody = [
    { s: 2, f: 0, n: 'A4', d: 0.5 }, // A string open
    { s: 2, f: 2, n: 'C#5', d: 0.5 }, // A string 2nd finger
    { s: 3, f: 0, n: 'E5', d: 0.5 }, // E string open
    { s: 3, f: 3, n: 'A5', d: 1.0 }, // E string 3rd finger
    
    { s: 3, f: 1, n: 'F#5', d: 0.5 },
    { s: 3, f: 0, n: 'E5', d: 0.5 },
    { s: 2, f: 2, n: 'C#5', d: 0.5 },
    { s: 2, f: 1, n: 'B4', d: 1.0 },

    { s: 2, f: 0, n: 'A4', d: 0.5 },
    { s: 1, f: 3, n: 'G4', d: 0.5 }, // D string 3rd finger
    { s: 1, f: 1, n: 'E4', d: 0.5 },
    { s: 1, f: 0, n: 'D4', d: 1.0 },
  ];

  melody.forEach(m => {
    notes.push({
      time: currentTime,
      duration: m.d,
      stringIndex: m.s as 0|1|2|3,
      fingerPosition: m.f,
      noteName: m.n,
      frequency: 440 // Placeholder, handled by synth logic mostly
    });
    currentTime += m.d;
  });

  // Loop it a bit
  melody.forEach(m => {
    notes.push({
      time: currentTime,
      duration: m.d,
      stringIndex: m.s as 0|1|2|3,
      fingerPosition: m.f,
      noteName: m.n,
      frequency: 440
    });
    currentTime += m.d;
  });

  return notes;
};

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'I See the Light (魔发奇缘)',
    subtitle: '长发公主',
    composer: 'Alan Menken',
    coverUrl: 'https://picsum.photos/400/400?random=1',
    difficulty: 2,
    views: 95,
    likes: 1,
    tags: ['Disney', 'Love', 'Ballad'],
    notes: generateMockNotes()
  },
  {
    id: '2',
    title: 'Conquest of Paradise',
    composer: 'Vangelis',
    coverUrl: 'https://picsum.photos/400/400?random=2',
    difficulty: 4,
    views: 86,
    likes: 12,
    tags: ['Epic', 'Soundtrack'],
    notes: generateMockNotes()
  },
  {
    id: '3',
    title: 'Only Love',
    composer: 'Trademark',
    coverUrl: 'https://picsum.photos/400/400?random=3',
    difficulty: 1,
    views: 81,
    likes: 5,
    tags: ['Pop', 'Easy'],
    notes: generateMockNotes()
  },
  {
    id: '4',
    title: 'Canon in D',
    composer: 'Pachelbel',
    coverUrl: 'https://picsum.photos/400/400?random=4',
    difficulty: 3,
    views: 1205,
    likes: 340,
    tags: ['Classical', 'Baroque'],
    notes: generateMockNotes()
  }
];

export const CATEGORIES = [
  { id: 'hot', name: '网红热门', color: 'bg-rose-500' },
  { id: 'singer', name: '歌手', color: 'bg-purple-500' },
  { id: 'epic', name: '热血战歌', color: 'bg-orange-600' },
  { id: 'patriotic', name: '爱国红歌', color: 'bg-red-600' },
  { id: 'acg', name: '二次元', color: 'bg-pink-400' },
  { id: 'electronic', name: '电提琴', color: 'bg-blue-600' },
  { id: 'etude', name: '练习曲', color: 'bg-emerald-500' },
  { id: 'duet', name: '二重奏', color: 'bg-teal-600' },
];