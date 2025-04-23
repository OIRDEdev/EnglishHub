<template>
  <div class="page-container">
    <!-- Menu lateral -->
    <div class="sidebar">
      <ul>
        <li class="active">Stories</li>
        <li>Games</li>
        <li>Anki</li>
        <li>Pronunciacion</li>
      </ul>
    </div>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <!-- Cabeçalho -->
      <div class="header">
        <div class="user-profile">
          <div class="user-level">Nível {{ userLevel }}</div>
          <img :src="userProfilePic || '@/assets/default-avatar.png'" alt="Perfil" class="user-img">
          <div class="settings-icon" @click="toggleSettings">⚙️</div>
        </div>
      </div>

      <!-- Filtros de nível -->
      <div class="level-filters">
        <button 
          v-for="level in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" 
          :key="level"
          class="level-btn"
          :class="{ active: currentLevel === level }"
          @click="setLevel(level)"
        >
          {{ level }}
        </button>
      </div>

      <!-- Carrossel de Cards -->
      <div class="carousel-container">
        <button class="carousel-btn prev-btn" @click="moveCarousel(-1)">❮</button>
        <div class="carousel">
          <div class="carousel-inner" :style="carouselStyle">
            <div v-for="(story, index) in filteredStories" :key="index" class="card">
              <div class="card-content" @click="startReading(story)">
                <img :src="story.image || coverImage" :alt="story.title" class="card-img">
                <div class="card-title">{{ story.title }}</div>
                <div class="card-genre">{{ story.category }}</div>
                <div class="card-level">Nível {{ story.level }}</div>
                <div class="card-synopsis">{{ story.description }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-btn next-btn" @click="moveCarousel(1)">❯</button>
      </div>
    </div>

    <!-- Modal de configurações -->
    <div class="settings-modal" :style="{ display: showSettings ? 'block' : 'none' }">
      <h3>Configurações</h3>
      <div class="settings-option">
        <span>Modo escuro</span>
        <input type="checkbox" id="darkMode">
      </div>
      <div class="settings-option">
        <span>Notificações</span>
        <input type="checkbox" id="notifications" checked>
      </div>
      <div class="settings-option">
        <span>Som</span>
        <input type="checkbox" id="sound" checked>
      </div>
    </div>

    <div class="modal-backdrop" @click="toggleSettings" :style="{ display: showSettings ? 'block' : 'none' }"></div>
  </div>
</template>

<script>
import { gethistoriaData } from '@/servicesJS/HistoriaHandle';
import { userstatedata } from '@/servicesJS/user.js';


export default {
  data() {
    return {
      coverImage: "https://m.media-amazon.com/images/I/81Cg3q0W0ZL._UF894,1000_QL80_.jpg",
      userLevel: 5,
      username: '',
      userProfilePic: '',
      useremail: '',
      currentLevel: 2,
      currentPosition: 0,
      showSettings: false,
      stories: []
    };
  },
  mounted: async function() {
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
    moveCarousel(direction) {
      const totalStories = this.filteredStories.length;
      const carousel = document.querySelector('.carousel-inner');
      this.currentPosition += direction;
      
      if (this.currentPosition < 0) this.currentPosition = 0;
      if (this.currentPosition > totalStories - 1) this.currentPosition = totalStories - 1;

      carousel.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    startReading(story) {
      const formatedTitle = story.title.toLowerCase().replace(/ /g, '-');
      this.$router.push(`/historia/${story.level}/${formatedTitle}/${story.id}`);
    }
  },
  computed: {
    filteredStories() {
      return this.stories.filter(story => {
        return story.level === this.currentLevel;
      });
    },
    carouselStyle() {
      const cardWidth = 320; // same as the width of the card in CSS
      return `transform: translateX(-${this.currentPosition * cardWidth}px)`;
    }
  },
  created() {
    const userState = userstatedata()
    this.username = userState.username
    this.userProfilePic = userState.avatar
    this.useremail = userState.email
  }
};
</script>

<style src="./css/style.css"></style>
