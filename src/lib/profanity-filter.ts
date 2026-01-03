const profanityList = [
  'ass', 'asshole', 'bastard', 'bitch', 'bollocks', 'bullshit',
  'crap', 'cunt', 'damn', 'dick', 'dickhead', 'dumbass',
  'fag', 'faggot', 'fuck', 'fucker', 'fucking', 'goddamn',
  'hell', 'jackass', 'jerk', 'motherfucker', 'nigger', 'nigga',
  'piss', 'prick', 'shit', 'shitty', 'slut', 'son of a bitch',
  'whore', 'wanker', 'twat', 'retard', 'retarded', 'spic',
  'chink', 'kike', 'dyke', 'tranny', 'homo', 'cracker',
  'wetback', 'beaner', 'gook', 'honky', 'coon', 'paki'
];

const createPattern = (word: string): RegExp => {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const leetSpeak = escaped
    .replace(/a/gi, '[a@4]')
    .replace(/e/gi, '[e3]')
    .replace(/i/gi, '[i1!]')
    .replace(/o/gi, '[o0]')
    .replace(/s/gi, '[s$5]')
    .replace(/t/gi, '[t7]')
    .replace(/l/gi, '[l1]');
  return new RegExp(`\\b${leetSpeak}\\b`, 'gi');
};

const patterns = profanityList.map(createPattern);

export function containsProfanity(text: string): boolean {
  const normalizedText = text.toLowerCase();
  return patterns.some(pattern => pattern.test(normalizedText));
}

export function filterTexts(texts: string[]): { isClean: boolean; hasProfanity: boolean } {
  const hasProfanity = texts.some(text => containsProfanity(text));
  return { isClean: !hasProfanity, hasProfanity };
}
