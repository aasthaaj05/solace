const emotionKeywords = {
    happy: ["happy", "joyful", "excited", "smile", "grateful", "cheerful"],
    sad: ["sad", "down", "upset", "depressed", "cry", "lonely"],
    angry: ["angry", "mad", "furious", "annoyed", "irritated"],
    calm: ["calm", "relaxed", "peaceful", "chill", "serene"],
    normal: ["okay", "fine", "meh", "neutral", "normal"]
  };
  
  export default function detectEmotions(text) {
    const result = {
      happy: 0,
      sad: 0,
      angry: 0,
      calm: 0,
      normal: 0
    };
  
    const words = text.toLowerCase().split(/\W+/);
  
    words.forEach((word) => {
      for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        if (keywords.includes(word)) {
          result[emotion]++;
        }
      }
    });
  
    return result;
  }
  