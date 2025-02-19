<template>
  <div class="container">
    <header class="header">
      <h1>Graded Readers</h1>
      <div class="user-info">
        <div class="stats">
          <span class="word-count">533</span>
          <span class="word-label">Palavras Únicas</span>
        </div>
        <div class="user-profile">
          <span class="progress-info">2/30</span>
          <div class="profile-section">
            <div class="avatar">
              <!-- Default avatar if no image -->
              <img src="@/assets/default-avatar.png" alt="Profile" />
            </div>
            <span class="username">Edrio</span>
            <button class="dropdown-toggle" @click="toggleDropdown">
              <i class="fas fa-chevron-down" :class="{ 'active': isDropdownOpen }"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div class="dropdown-items">
                <!-- Add your menu items here -->
                <a href="#" class="dropdown-item">
                  <i class="fas fa-user"></i>
                  Perfil
                </a>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-cog"></i>
                  Configurações
                </a>
                <a href="#" class="dropdown-item logout">
                  <i class="fas fa-sign-out-alt"></i>
                  Sair
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="library">
      <h2>Biblioteca</h2>
      <div class="levels">
        <button 
        v-for="level in 6" 
        :key="level"
        :class="{ active: currentLevel === level, disabled: level === 6 }"
        @click="setLevel(level)"
      >
        Nível {{ level }}
      </button>
      </div>

      <div class="books-carousel">
        <div v-for="book in filteredBooks" :key="book.id" class="book-card">
          <div class="book-cover"></div>
          <div class="book-details">
            <h3>{{ book.title }}</h3>
            <div class="book-level-badge">Nível {{ book.level }}</div>
            <p>{{ book.description }}</p>
            <button class="book-button" @click="startReading(book)">{{ book.buttonText }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gethistoriaData }  from '@/servicesJS/HistoriaHandle';

export default {
  data() {
    return {
      currentLevel: 1,
      isDropdownOpen: false,
      books: [
       // { id: 1, title: "The Boy Who Could Not Tell The Truth", description: "Once upon a time, a boy lived in a beautiful blue house...", level: 1, buttonText: "Continuar" },
        //{ id: 2, title: "The Happy Place", description: "Once upon a time, there were two friends...", level: 1, buttonText: "Iniciar Leitura" },
       // { id: 3, title: "The Midwife", description: "Many years ago, in a country very far away...", level: 2, buttonText: "Ler Novamente" }
      ]
    };
  },
  methods: {
    async fetchBooks() {
      try {
        this.books = await gethistoriaData(); 
        console.log(this.books);
      } catch (error) {
        console.error("Erro ao buscar dados da história:", error);
      }
    },

    setLevel(level) {
      if (level !== 6) {
        this.currentLevel = level;
      }
    },
    startReading(book) {
      const formatedTitle = book.title.toLowerCase().replace(/ /g, '-');
      this.$router.push(`/historia/${book.level}/${formatedTitle}/${book.id}`);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => book.level === this.currentLevel);
    }
  },
  mounted: async function() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.profile-section')) {
        this.isDropdownOpen = false;
      }
    });

    await this.fetchBooks();
  }
};
</script>

<style src="./css/style.css"></style>
