<template>
  <div class="inicial-container">
    <!-- Header Section -->
    <header>
      <h1 class="logo">EnglishHub</h1>
      <div class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav :class="{ active: isMenuOpen }">
        <ul>
          <li><a href="#about">About Us</a></li>
          <li><a href="#resources">Learning Resources</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </nav>
      <button class="login-btn" @click="goToLogin">Login</button>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="carousel">
          <div 
            class="carousel-item" 
            v-for="(item, index) in carouselItems" 
            :key="index" 
            :class="{ active: currentSlide === index }"
            :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getBackgroundImage(item)})` }"
          >
            <div class="carousel-text">
              <h1>{{ item.title }}</h1>
              <p>{{ item.description }}</p>
            </div>
          </div>
          <div class="carousel-dots">
            <span 
              v-for="(item, index) in carouselItems" 
              :key="index"
              class="dot"
              :class="{ active: currentSlide === index }"
              @click="setSlide(index)"
            ></span>
          </div>
        </div>
        <button class="get-started-btn" @click="goToSignup">Get Started</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'InicialPage',
  data() {
    return {
      isMenuOpen: false,
      currentSlide: 0,
      carouselItems: [
        {
          title: "Learn English Through Reading",
          description: "Improve your language skills naturally with our interactive reading platform",
          desktopImage: "/carouselothers.jpg",
          mobileImage: "/carouselSmartfhone.jpg"
        },
        {
          title: "Instant Translations",
          description: "Understand any text with our hover-to-translate feature",
          desktopImage: "/carouselothers1.jpg",
          mobileImage: "/carouselSmartfhone1.jpg"
        },
        {
          title: "Extensive Library",
          description: "Access a vast collection of English content across various difficulty levels",
          desktopImage: "/carouselothers2.jpg",
          mobileImage: "/carouselSmartfhone2.jpg"
        }
      ],
    }
  },
  mounted() {
    this.startCarousel();
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    startCarousel() {
      setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
      }, 5000); // Changed to 2 seconds
    },
    setSlide(index) {
      this.currentSlide = index;
    },
    getBackgroundImage(item) {
      return window.innerWidth <= 768 ? item.mobileImage : item.desktopImage;
    },
    showDescription(index) {
      this.books[index].isHovered = true;
    },
    hideDescription(index) {
      this.books[index].isHovered = false;
    },
    goToLogin() {
      this.$router.push('/auth/login');
    },
    goToSignup() {
      this.$router.push('/auth/signUp');
    }
  }
}
</script>

<style src="./css/style.css"></style>
<style src="./css/responsive.css"></style>
