export const initializeAnimations = () => {
  // Sidebar toggle
  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
  };

  // Filter animations
  const initializeFilterAnimations = () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.add('filter-active');
        // Remove active class from other buttons
        filterButtons.forEach(otherButton => {
          if (otherButton !== button) {
            otherButton.classList.remove('filter-active');
          }
        });
      });
    });
  };

  return {
    toggleSidebar,
    toggleMobileMenu,
    initializeFilterAnimations
  };
};
