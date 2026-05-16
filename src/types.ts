export interface Player {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  matches: number;
  avg?: number;
  sr?: number;
  wickets?: number;
  economy?: number;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  flag: string;
  stats: {
    batting: number;
    bowling: number;
  };
  players: Player[];
}

export const TEAMS: Team[] = [
  { 
    id: 'ind', name: 'India', color: '#138808', flag: '🇮🇳', 
    stats: { batting: 95, bowling: 90 },
    players: [
      { name: "Virat K.", role: "Batsman", matches: 292, avg: 58.7, sr: 93.6 },
      { name: "Rohit S.", role: "Batsman", matches: 262, avg: 49.1, sr: 91.9 },
      { name: "Jasprit B.", role: "Bowler", matches: 89, wickets: 157, economy: 4.6 },
      { name: "Hardik P.", role: "All-Rounder", matches: 86, avg: 34.0, wickets: 84 },
      { name: "KL Rahul", role: "Wicket-Keeper", matches: 75, avg: 50.4, sr: 87.3 },
      { name: "Ravindra J.", role: "All-Rounder", matches: 197, avg: 32.4, wickets: 220 },
      { name: "Suryakumar Y.", role: "Batsman", matches: 37, avg: 25.8, sr: 105.3 },
      { name: "Rishabh P.", role: "Wicket-Keeper", matches: 31, avg: 35.1, sr: 106.7 },
      { name: "Mohammed S.", role: "Bowler", matches: 101, wickets: 194, economy: 5.6 },
      { name: "Kuldeep Y.", role: "Bowler", matches: 103, wickets: 168, economy: 5.1 },
      { name: "Arshdeep S.", role: "Bowler", matches: 52, wickets: 79, economy: 8.2 }
    ]
  },
  { 
    id: 'aus', name: 'Australia', color: '#FFCD00', flag: '🇦🇺', 
    stats: { batting: 92, bowling: 94 },
    players: [
      { name: "David W.", role: "Batsman", matches: 161, avg: 44.8, sr: 97.3 },
      { name: "Travis H.", role: "Batsman", matches: 69, avg: 44.1, sr: 102.3 },
      { name: "Mitchell M.", role: "All-Rounder", matches: 89, avg: 34.5, wickets: 56 },
      { name: "Glenn M.", role: "All-Rounder", matches: 138, avg: 35.4, sr: 126.9 },
      { name: "Steve S.", role: "Batsman", matches: 155, avg: 43.5, sr: 87.4 },
      { name: "Josh I.", role: "Wicket-Keeper", matches: 30, avg: 28.4, sr: 95.1 },
      { name: "Pat C.", role: "Bowler", matches: 82, wickets: 141, economy: 5.3 },
      { name: "Mitchell S.", role: "Bowler", matches: 121, wickets: 236, economy: 5.1 },
      { name: "Josh H.", role: "Bowler", matches: 85, wickets: 132, economy: 4.9 },
      { name: "Adam Z.", role: "Bowler", matches: 99, wickets: 169, economy: 5.4 },
      { name: "Cameron G.", role: "All-Rounder", matches: 28, avg: 33.2, wickets: 16 }
    ]
  },
  { id: 'eng', name: 'England', color: '#CE1126', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stats: { batting: 90, bowling: 92 }, players: [] },
  { id: 'pak', name: 'Pakistan', color: '#01411C', flag: '🇵🇰', stats: { batting: 88, bowling: 95 }, players: [] },
  { id: 'sa', name: 'South Africa', color: '#007749', flag: '🇿🇦', stats: { batting: 89, bowling: 91 }, players: [] },
  { id: 'nz', name: 'New Zealand', color: '#000000', flag: '🇳🇿', stats: { batting: 91, bowling: 89 }, players: [] },
  { id: 'wi', name: 'West Indies', color: '#7B002C', flag: '🌴', stats: { batting: 87, bowling: 85 }, players: [] },
  { id: 'sl', name: 'Sri Lanka', color: '#213063', flag: '🇱🇰', stats: { batting: 85, bowling: 86 }, players: [] },
  { id: 'ban', name: 'Bangladesh', color: '#006A4E', flag: '🇧🇩', stats: { batting: 82, bowling: 84 }, players: [] },
  { id: 'afg', name: 'Afghanistan', color: '#005EB8', flag: '🇦🇫', stats: { batting: 80, bowling: 92 }, players: [] },
  { id: 'ire', name: 'Ireland', color: '#169B62', flag: '🇮🇪', stats: { batting: 78, bowling: 76 }, players: [] },
  { id: 'zim', name: 'Zimbabwe', color: '#D40000', flag: '🇿🇼', stats: { batting: 75, bowling: 74 }, players: [] },
];

export const COMMENTARY: Record<string, string[]> = {
  en: [
    "What a magnificent shot!",
    "Straight into the hands of the fielder.",
    "The bowler is putting on a masterclass today.",
    "That's a clean hit for six!",
    "Edged and taken! He's gone.",
    "Brilliant piece of bowling.",
  ],
  hi: [
    "क्या शानदार शॉट है!",
    "सीधा फील्डर के हाथों में।",
    "आज गेंदबाज अपना जलवा दिखा रहे हैं।",
    "गजब का छक्का!",
    "आउट! गेंदबाज ने चकित कर दिया।",
    "बेहतरीन गेंदबाजी का नमूना।"
  ],
  bn: [
    "অসাধারণ একটি শট!",
    "সরাসরি ফিল্ডারের হাতে।",
    "আজ বোলার তার জাদু দেখাচ্ছেন।",
    "দুর্দান্ত ছক্কা!",
    "আউট! অসাধারণ বোলিং।",
    "দুর্দান্ত বোলিং পারফরম্যান্স।"
  ]
};

export const PLAYERS = [
  "Virat K.", "Rohit S.", "Jasprit B.", "Hardik P.", "KL Rahul", 
  "Ravindra J.", "Suryakumar Y.", "Rishabh P.", "Mohammed S.", "Kuldeep Y.", "Arshdeep S."
];

export type GameState = 'INTRO' | 'MENU' | 'TEAM_SELECT' | 'TOSS' | 'LINEUP' | 'MATCH' | 'RESULTS' | 'PRACTICE';

export interface MatchState {
  myTeam: Team;
  opponent: Team;
  score: number;
  wickets: number;
  ballsRemaining: number;
  target: number;
  isBatting: boolean;
  tossWinner?: string;
  history: string[];
}
