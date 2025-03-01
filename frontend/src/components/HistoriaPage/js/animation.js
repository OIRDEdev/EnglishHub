export const initializeReadingAnimations = () => {
  const toggleFontSize = (size) => {
    const content = document.querySelector('.reading-content');
    content.style.fontSize = size + 'px';
  };

  const toggleTheme = (theme) => {
    const container = document.querySelector('.reading-container');
    container.className = 'reading-container ' + theme;
  };

  return {
    toggleFontSize,
    toggleTheme
  };
};
