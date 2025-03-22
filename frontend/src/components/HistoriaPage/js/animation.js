/**
 * Initialize reading animations for the story player
 * Handles title animations, text reveal, and theme/font adjustments
 */
export const initializeReadingAnimations = () => {
  // Font size adjustment
  const toggleFontSize = (size) => {
    const content = document.querySelector('#transcript');
    if (content) {
      content.style.fontSize = size + 'px';
    }
  };

  // Theme toggle functionality
  const toggleTheme = (isDark) => {
    const container = document.querySelector('.story-player-container');
    if (container) {
      if (isDark) {
        container.classList.add('dark-theme');
        container.classList.remove('light-theme');
      } else {
        container.classList.add('light-theme');
        container.classList.remove('dark-theme');
      }
    }
  };

  // Animate title entrance
  const animateTitle = () => {
    const title = document.querySelector('#title');
    if (title) {
      title.style.animation = 'moveTitle 2s ease-out';
    }
  };

  // Animate play button fade-in
  const animatePlayButton = () => {
    const playButton = document.querySelector('#playButton');
    if (playButton) {
      // Start with opacity 0
      playButton.style.opacity = '0';
      
      // Delay to ensure title animation has started
      setTimeout(() => {
        playButton.style.transition = 'opacity 1s ease-in-out';
        playButton.style.opacity = '1';
      }, 1000);
    }
  };

  // Animate header movement (from center to top)
  const animateHeader = (isPlaying) => {
    const header = document.querySelector('#header');
    if (header) {
      if (isPlaying) {
        header.classList.add('animateUp');
      } else {
        header.classList.remove('animateUp');
      }
    }
  };
/*
  // Reveal story container with fade-in
  const revealStoryContainer = (isPlaying) => {
    const storyContainer = document.querySelector('#storyContainer');
    if (storyContainer) {
      if (isPlaying) {
        storyContainer.style.display = 'block';
        // Force reflow to trigger transition
        void storyContainer.offsetWidth;
        storyContainer.style.opacity = '1';
      } else {
        storyContainer.style.opacity = '0';
        setTimeout(() => {
          storyContainer.style.display = 'none';
        }, 1000);
      }
    }
  };
*/
  // Reveal audio container with fade-in
  const revealAudioContainer = (isPlaying) => {
    const audioContainer = document.querySelector('#audioContainer');
    if (audioContainer) {
      if (isPlaying) {
        audioContainer.style.display = 'block';
        // Force reflow to trigger transition
        void audioContainer.offsetWidth;
        audioContainer.style.opacity = '1';
      } else {
        audioContainer.style.opacity = '0';
        setTimeout(() => {
          audioContainer.style.display = 'none';
        }, 1000);
      }
    }
  };

  // Character-by-character text reveal animation
  const animateTextReveal = (sentences, progress, updateCallback) => {
    if (!sentences || sentences.length === 0) return;
    
    // Calculate total characters in all sentences
    const totalChars = sentences.reduce((total, sentence) => {
      // Check if the property is 'original' or 'orginal' (handle typo in data)
      const originalText = sentence.original || sentence.orginal || '';
      return total + originalText.length;
    }, 0);
    
    // Calculate how many characters to show based on progress
    const charsToShow = Math.floor(progress * totalChars);
    
    // Create a copy of sentences to modify
    const visibleSentences = [];
    let charsShown = 0;
    
    // Go through each sentence and reveal characters
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      // Check if the property is 'original' or 'orginal' (handle typo in data)
      const originalText = sentence.original || sentence.orginal || '';
      const translationText = sentence.translation || '';
      const sentenceLength = originalText.length;
      
      if (charsShown + sentenceLength <= charsToShow) {
        // Show the entire sentence
        visibleSentences.push({
          original: originalText,
          translation: translationText
        });
        charsShown += sentenceLength;
      } else if (charsShown < charsToShow) {
        // Show partial sentence
        const charsToReveal = charsToShow - charsShown;
        visibleSentences.push({
          original: originalText.substring(0, charsToReveal),
          translation: translationText
        });
        charsShown = charsToShow;
      } else {
        // Don't show this sentence yet
        break;
      }
    }
    
    // Call the callback with updated visible sentences
    if (updateCallback && typeof updateCallback === 'function') {
      updateCallback(visibleSentences);
    }
  };

  // Initialize animations when page loads
  const initializePageAnimations = () => {
    animateTitle();
    animatePlayButton();
  };

  // Start story animations when play is clicked
  const startStoryAnimations = (sentences, updateCallback) => {
    animateHeader(true);
   /* revealStoryContainer(true);*/
    revealAudioContainer(true);
    
    return {
      updateTextReveal: (progress) => {
        animateTextReveal(sentences, progress, updateCallback);
      }
    };
  };

  // Initialize on load
  initializePageAnimations();

  // Return public methods
  return {
    toggleFontSize,
    toggleTheme,
    startStoryAnimations,
    animateHeader,
    /*revealStoryContainer,*/
    revealAudioContainer
  };
};
