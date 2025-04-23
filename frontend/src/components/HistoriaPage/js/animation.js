/**
 * Initialize reading animations for the story player
 * Handles text reveal, UI hiding/showing, transitions, and lazy loading
 */
export const initializeReadingAnimations = () => {
  // Preload critical assets
  const preloadAssets = () => {
    // Preload images or audio for faster loading
    const assets = [
      // Add any critical assets here
    ];
    
    assets.forEach(asset => {
      if (asset.endsWith('.jpg') || asset.endsWith('.png') || asset.endsWith('.webp')) {
        const img = new Image();
        img.src = asset;
      }
    });
  };
  
  // Font size adjustment
  const toggleFontSize = (size) => {
    document.documentElement.style.setProperty('--content-font-size', size + 'px');
  };

  // Theme toggle functionality
  const toggleTheme = (isDark) => {
    // Apply theme classes immediately for smoother transition
    const container = document.querySelector('.story-player-container');
    if (!container) return;
    
    if (isDark) {
      container.classList.add('dark-theme');
      container.classList.remove('light-theme');
    } else {
      container.classList.add('light-theme');
      container.classList.remove('dark-theme');
    }
    
    // Cache the theme preference
    localStorage.setItem('reader-theme', isDark ? 'dark' : 'light');
  };
  
  // Toggle sidebar
  const toggleSidebar = (isCollapsed) => {
    const sidebar = document.querySelector('.settings-sidebar');
    if (!sidebar) return;
    
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
    
    // Add animation effect
    sidebar.style.transition = 'width 0.3s ease, transform 0.3s ease';
  };
  
  // Toggle translations section
  const toggleTranslationsSection = (isShown) => {
    const container = document.querySelector('.translations-content');
    if (!container) return;
    
    if (isShown) {
      container.style.maxHeight = container.scrollHeight + 'px';
      container.style.opacity = '1';
    } else {
      container.style.maxHeight = '0';
      container.style.opacity = '0';
    }
    
    // Smooth transition
    container.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
  };
  
  // Initial splash screen animations
  const animateSplashScreen = () => {
    const splash = document.querySelector('.splash-screen');
    if (!splash) return;
    
    // Fade in effect
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.opacity = '1';
    }, 100);
  };
  
  // Animate the UI hide/show based on user activity
  const setupUIHiding = (callback) => {
    let timer;
    
    const resetTimer = () => {
      clearTimeout(timer);
      callback(false); // Show UI
      
      timer = setTimeout(() => {
        callback(true); // Hide UI
      }, 3000);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('mousedown', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('touchstart', resetTimer);
    
    // Initial setup
    resetTimer();
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('mousedown', resetTimer);
      document.removeEventListener('keypress', resetTimer);
      document.removeEventListener('touchstart', resetTimer);
      clearTimeout(timer);
    };
  };
  
  // Character-by-character text reveal animation
  const animateTextReveal = (sentences, progress, updateCallback) => {
    if (!sentences || sentences.length === 0) return;
    
    // Calculate total characters in all sentences
    const totalChars = sentences.reduce((total, sentence) => {
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
  
  // Lazy load translations
  const setupLazyLoadTranslations = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const translationItem = entry.target;
          
          // Simulate translation loading with a slight delay for UX
          translationItem.style.opacity = '0.5';
          setTimeout(() => {
            translationItem.style.opacity = '1';
            // Once loaded, stop observing
            observer.unobserve(translationItem);
          }, 200);
        }
      });
    }, options);
    
    // Observe all translation items
    document.querySelectorAll('.translation-item').forEach(item => {
      observer.observe(item);
    });
    
    return observer;
  };
  
  // Animate "Add to Anki" button click
  const animateAnkiAddition = () => {
    // Create a floating notification
    const notification = document.createElement('div');
    notification.className = 'anki-notification';
    notification.textContent = 'Added to Anki!';
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.right = '20px';
    notification.style.background = '#2ecc71';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add to the document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  };
  
  // Initialize page on load
  const initializePageAnimations = () => {
    // Preload assets for faster experience
    preloadAssets();
    
    // Setup initial animations
    animateSplashScreen();
    
    // Apply saved theme preference
    const savedTheme = localStorage.getItem('reader-theme') || 'dark';
    toggleTheme(savedTheme === 'dark');
    
    // Apply saved font size
    const savedFontSize = localStorage.getItem('reader-font-size') || '18';
    toggleFontSize(parseInt(savedFontSize));
  };

  // Start story animations
  const startStoryAnimations = (sentences, updateCallback) => {
    // Start the lazy loading of translations
    const translationObserver = setupLazyLoadTranslations();
    
    return {
      updateTextReveal: (progress) => {
        animateTextReveal(sentences, progress, updateCallback);
      },
      translationObserver // Return the observer so it can be cleaned up if needed
    };
  };

  // Call initialization
  initializePageAnimations();

  // Return public methods
  return {
    toggleFontSize,
    toggleTheme,
    toggleSidebar,
    toggleTranslationsSection,
    setupUIHiding,
    startStoryAnimations,
    animateAnkiAddition
  };
};
