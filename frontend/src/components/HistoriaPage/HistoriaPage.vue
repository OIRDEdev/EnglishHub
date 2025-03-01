<template>
  <div class="reading-container">
    <!-- Reading Header -->
    <div class="reading-header">
      <div class="title-section">
        <h2>EnglishHub by Edrio Borges</h2>
        <h1>
          <span class="level-badge">NÍVEL {{ level }}</span>
          {{ title }}
        </h1>
      </div>
      
      <div class="controls">
        <div class="font-controls">
          <button @click="adjustFontSize('small')" :class="{ active: fontSize === 'small' }">A</button>
          <button @click="adjustFontSize('medium')" :class="{ active: fontSize === 'medium' }">A</button>
          <button @click="adjustFontSize('large')" :class="{ active: fontSize === 'large' }">A</button>
        </div>
        <button class="exit-button" @click="exitReading">SAIR DO MODO LEITURA</button>
      </div>
    </div>

    <!-- Reading Content -->
    <div class="reading-content" :class="fontSize" v-html="content"></div>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
      <span class="progress-text">{{ progress }}%</span>
    </div>
  </div>
</template>

<script>
import { getHistoria } from '@/servicesJS/HistoriaHandle.js';
import { initializeReadingAnimations } from './js/animation.js';

export default {
  name: 'HistoriaPage',
  data() {
    return {
      title: '',
      level: 1,
      content: '',
      fontSize: 'medium',
      progress: 0
    };
  },
  async created() {
    const { level, title, id } = this.$route.params;
    this.level = level;
    this.title = title.replace('-', " ");
    await this.fetchContent(id);
  },
  methods: {
    async fetchContent(id) {
      try {
        const response = await getHistoria(id);
        console.log(response)
        this.content = response;
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    },
    adjustFontSize(size) {
      this.fontSize = size;
      const sizes = { small: 16, medium: 18, large: 20 };
      const { toggleFontSize } = initializeReadingAnimations();
      toggleFontSize(sizes[size]);
    },
    exitReading() {
      this.$router.push('/');
    }
  }
};
</script>

<style src="./css/style.css"></style>
<style src="./css/resposive.css"></style>