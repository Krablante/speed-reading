export const DEFAULT_WPM = 350;
export const MIN_WPM = 100;
export const MAX_WPM = 1000;
export const WPM_STEP = 25;

export const ORP_SCALE = 0.35; // Optimal Recognition Point scale factor

export const PUNCTUATION_DELAYS: Record<string, number> = {
  '.': 2.2,
  '!': 2.2,
  '?': 2.2,
  ',': 1.5,
  ';': 1.5,
  ':': 1.5,
  '-': 1.2,
};

export const SAMPLE_TEXT = `Welcome to ZenReader. 
This is an RSVP (Rapid Serial Visual Presentation) reader designed to help you read faster. 
The red letter in the middle is your Optimal Recognition Point. 
Keep your eyes focused on it, and let the words flow. 
You can adjust the speed, pause anytime, or use our AI features to generate content. 
Enjoy your reading experience!`;
