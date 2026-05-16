export interface Team {
  id: string;
  name: string;
  color: string;
  flag: string;
  stats: {
    batting: number;
    bowling: number;
  };
}

export const TEAMS: Team[] = [
  { id: 'ind', name: 'India', color: '#138808', flag: '🇮🇳', stats: { batting: 95, bowling: 90 } },
  { id: 'aus', name: 'Australia', color: '#FFCD00', flag: '🇦🇺', stats: { batting: 92, bowling: 94 } },
  { id: 'eng', name: 'England', color: '#CE1126', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stats: { batting: 90, bowling: 92 } },
  { id: 'pak', name: 'Pakistan', color: '#01411C', flag: '🇵🇰', stats: { batting: 88, bowling: 95 } },
  { id: 'sa', name: 'South Africa', color: '#007749', flag: '🇿🇦', stats: { batting: 89, bowling: 91 } },
  { id: 'nz', name: 'New Zealand', color: '#000000', flag: '🇳🇿', stats: { batting: 91, bowling: 89 } },
  { id: 'wi', name: 'West Indies', color: '#7B002C', flag: '🌴', stats: { batting: 87, bowling: 85 } },
  { id: 'sl', name: 'Sri Lanka', color: '#213063', flag: '🇱🇰', stats: { batting: 85, bowling: 86 } },
  { id: 'ban', name: 'Bangladesh', color: '#006A4E', flag: '🇧🇩', stats: { batting: 82, bowling: 84 } },
  { id: 'afg', name: 'Afghanistan', color: '#005EB8', flag: '🇦🇫', stats: { batting: 80, bowling: 92 } },
  { id: 'ire', name: 'Ireland', color: '#169B62', flag: '🇮🇪', stats: { batting: 78, bowling: 76 } },
  { id: 'zim', name: 'Zimbabwe', color: '#D40000', flag: '🇿🇼', stats: { batting: 75, bowling: 74 } },
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
