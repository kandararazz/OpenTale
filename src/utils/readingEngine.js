/**
 * OpenTale Reading & Bionic Text Utilities
 */

// Bionic Reading Converter: Highlights first letters of words for faster eye fixation
export function toBionicHTML(text) {
  if (!text) return '';
  
  const words = text.split(' ');
  return words.map(word => {
    // Separate punctuation
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanWord) return word;

    const prefixLen = Math.max(1, Math.ceil(cleanWord.length * 0.45));
    const boldPart = cleanWord.substring(0, prefixLen);
    const restPart = cleanWord.substring(prefixLen);

    // Reconstruct with original punctuation
    const leadingPunct = word.substring(0, word.indexOf(cleanWord));
    const trailingPunct = word.substring(word.indexOf(cleanWord) + cleanWord.length);

    return `${leadingPunct}<b class="font-extrabold text-peach-700 dark:text-peach-400">${boldPart}</b>${restPart}${trailingPunct}`;
  }).join(' ');
}

// Advanced Etymology & Character Recap Lookup Database
export const EXTENDED_DICTIONARY = {
  lantern: {
    word: 'Lantern',
    phonetic: '[lan-tern]',
    etymology: 'From Old French "lanterne" (12th c.) & Latin "laterna", meaning a portable lamp with transparent walls.',
    historicalContext: 'In medieval Europe, lanterns were crafted by tinsmiths using horn or glass to shield candle flames from night winds.',
    characterRecap: 'Barnaby\'s grandfather crafted the brass lantern using Starling Hollow oak resin.',
    definition: 'A portable protective light source.'
  },
  constellation: {
    word: 'Constellation',
    phonetic: '[con-stel-la-tion]',
    etymology: 'From Latin "constellatio", literally "a set of stars together".',
    historicalContext: 'Ancient astronomers used constellations as seasonal maps for agricultural planting and ocean navigation.',
    characterRecap: 'Oliver\'s favorite constellation is Ursa Major, which guides Starhopper-9 home.',
    definition: 'A group of stars forming a recognizable pattern.'
  },
  clockwork: {
    word: 'Clockwork',
    phonetic: '[clock-work]',
    etymology: 'Middle English combination of "clock" (from Latin clocca, bell) + "work".',
    historicalContext: 'Popularized during the Renaissance by Italian master craftsmen like Leonardo da Vinci for intricate automatons.',
    characterRecap: 'Tick the kitten contains 144 miniature brass gears engineered by Grandfather Thorne.',
    definition: 'A mechanical spring and gear driven movement.'
  },
  sizzle: {
    word: 'Sizzle',
    phonetic: '[siz-zle]',
    etymology: 'Imitative onomatopoeia mimicking the sound of cooking fat or batter hitting a hot griddle.',
    historicalContext: 'Cast iron skillet cooking gained popularity in ancient Rome for baking barley cakes.',
    characterRecap: 'Puff\'s dragon breath creates the perfect 350°F griddle sizzle for flapjacks.',
    definition: 'A soft hissing sound when cooking food.'
  }
};

export function getWordLookup(word) {
  if (!word) return null;
  const cleanKey = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
  return EXTENDED_DICTIONARY[cleanKey] || {
    word: word,
    phonetic: `[${word.toLowerCase()}]`,
    etymology: 'Derived from classical root origins, handed down through storytelling traditions.',
    historicalContext: 'Used across classical literature to evoke vivid imagery and emotional clarity.',
    characterRecap: `Featured prominently in your current chapter of OpenTale.`,
    definition: 'An expressive word enhancing story narrative.'
  };
}
