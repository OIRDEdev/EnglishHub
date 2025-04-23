export const initializeAnimations = () => {
  // Sidebar toggle
  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
  };

  const toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
  };

  
  const initializeFilterAnimations = () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.add('filter-active');
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
