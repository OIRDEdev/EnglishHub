<template>
  <div class="page-container">
    <!-- Hamburger Menu for Mobile -->
    <button class="hamburger-menu" @click="toggleMobileMenu">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="profile-section">
        <div class="profile-pic">
          <img :src="userProfilePic || '@/assets/default-avatar.png'" alt="Profile" />
        </div>
        <span class="username" v-if="!isSidebarCollapsed">{{ username }}</span>
      </div>

      <button class="toggle-sidebar" @click="toggleSidebar">
        <i class="fas fa-chevron-left"></i>
      </button>

      <nav class="sidebar-menu">
        <a href="#" class="menu-item">
          <i class="fas fa-trophy"></i>
          <span class="menu-text">Conquistas</span>
        </a>
        <a href="#" class="menu-item">
          <i class="fas fa-users"></i>
          <span class="menu-text">Amigos</span>
        </a>
        <a href="#" class="menu-item">
          <i class="fas fa-layer-group"></i>
          <span class="menu-text">Grupos</span>
        </a>
        <a href="#" class="menu-item">
          <i class="fas fa-moon"></i>
          <span class="menu-text">Modo Noturno</span>
        </a>
        <a href="#" class="menu-item">
          <i class="fas fa-cog"></i>
          <span class="menu-text">Configurações</span>
        </a>
        <a href="#" class="menu-item logout">
          <i class="fas fa-sign-out-alt"></i>
          <span class="menu-text">Sair</span>
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content" :class="{ expanded: isSidebarCollapsed }">
      <!-- Filter Section -->
      <div class="filter-container">
        <div class="level-filters">
          <button 
            v-for="level in levels" 
            :key="level"
            class="filter-button"
            :class="{ active: currentLevel === level }"
            @click="setLevel(level)"
          >
            Nível {{ level }}
          </button>
        </div>

        <div class="category-filters">
          <button 
            v-for="category in categories" 
            :key="category"
            class="filter-button"
            :class="{ active: currentCategory === category }"
            @click="setCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Stories Grid -->
      <div class="stories-grid">
        <div v-for="story in filteredStories" :key="story.id" class="story-card">
          <div class="story-image">
            <img :src="coverImage" :alt="story.title" />
          </div>
          <div class="story-content">
            <h3>{{ story.title }}</h3>
            <span class="level-badge">Nível {{ story.level }}</span>
            <p>{{ story.description }}</p>
            <button class="book-button" @click="startReading(story)">
              {{ story.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeAnimations } from './js/animation.js';
import { gethistoriaData }  from '@/servicesJS/HistoriaHandle';

export default {
  data() {
    return {
      coverImage: "https://m.media-amazon.com/images/I/81Cg3q0W0ZL._UF894,1000_QL80_.jpg",
      isSidebarCollapsed: false,
      username: 'User Name',
      userProfilePic: null,
      currentLevel: 1,
      currentCategory: 'Todos',
      levels: [1, 2, 3, 50, 53],
      categories: ['Todos', 'Ação', 'Aventura', 'Mistério'],
      stories: []
    };
  },
  mounted: async function() {
    const { toggleSidebar, toggleMobileMenu, initializeFilterAnimations } = initializeAnimations();
    this.toggleSidebar = toggleSidebar;
    this.toggleMobileMenu = toggleMobileMenu;
    initializeFilterAnimations();
    await this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        this.stories = await gethistoriaData(); 
        console.log(this.stories);
      } catch (error) {
        console.error("Erro ao buscar dados da história:", error);
      }
    },
    setLevel(level) {
      this.currentLevel = level;
    },
    setCategory(category) {
      this.currentCategory = category;
    },
    startReading(story) {
      const formatedTitle = story.title.toLowerCase().replace(/ /g, '-');
      this.$router.push(`/historia/${story.level}/${formatedTitle}/${story.id}`);
    },
  },
  computed: {
    filteredStories() {
      return this.stories.filter(story => {
        const levelMatch = this.currentLevel === 'Todos' || story.level === this.currentLevel;
        const categoryMatch = this.currentCategory === 'Todos' || story.category === this.currentCategory;
        return levelMatch && categoryMatch;
      });
    }
  }
};
</script>

<style src="./css/style.css" scoped></style>
<style src="./css/resposive.css" scoped></style>
