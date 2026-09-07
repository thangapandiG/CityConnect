/**
 * Utility service wrapper around Browser SpeechSynthesis API for Audio-Ready accessibility feature.
 */

export function speakText(text: string, language: string = 'English'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser environment.');
      resolve();
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown/symbols from text for natural speech
    const cleanText = text
      .replace(/\[.*?\]/g, '')
      .replace(/•/g, '')
      .replace(/\d+\./g, '')
      .replace(/[\*\_\#]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set locale code if available
    const langMap: Record<string, string> = {
      English: 'en-US',
      Tamil: 'ta-IN',
      Hindi: 'hi-IN',
      Telugu: 'te-IN',
      Malayalam: 'ml-IN',
    };

    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.9; // Slightly slower pace for clarity

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
