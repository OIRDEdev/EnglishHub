<template>
  <div class="story-player-container" :class="{ 'dark-theme': isDarkTheme }">
    <!-- Header with title and controls -->
    <div id="header" :class="{ 'animateUp': isPlaying }">
      <h1 id="title">{{ storyTitle }}</h1>
      <button id="playButton" v-if="!isPlaying" @click="startStory">Play</button>
      
      <div class="controls" v-if="isPlaying">
        <div class="theme-toggle">
          <button @click="toggleTheme" class="theme-btn">
            {{ isDarkTheme ? '☀️' : '🌙' }}
          </button>
        </div>
        <div class="font-controls">
          <button @click="adjustFontSize('small')" :class="{ active: fontSize === 'small' }">A</button>
          <button @click="adjustFontSize('medium')" :class="{ active: fontSize === 'medium' }">A</button>
          <button @click="adjustFontSize('large')" :class="{ active: fontSize === 'large' }">A</button>
        </div>
        <button class="exit-button" @click="exitReading">Exit</button>
      </div>
    </div>
    
    <!-- Story Container -->
    <div id="storyContainer" :class="[fontSize, { 'visible': isPlaying }]">
      <div id="transcript">
        <p>
          <span v-for="(sentence, index) in visibleSentences" :key="index" class="sentence_">
            <span class="text_in_english">{{ sentence.original }}</span>
            <span class="translate_span">{{ sentence.translation }}</span>
          </span>
        </p>
      </div>
    </div>
    
    <!-- Audio Container -->
    <div id="audioContainer" :class="{ 'visible': isPlaying }">
      <div class="player">
        <button id="togglePlay" :class="isAudioPlaying ? 'pause' : 'play'" @click="toggleAudio"></button>
        <div id="progressContainer" @click="seek">
          <div id="progress" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>
    
    <!-- Hidden audio element -->
    <audio ref="audioElement" @timeupdate="updateProgress" @ended="audioEnded"></audio>
  </div>
</template>

<script>
import { getHistoria } from '@/servicesJS/HistoriaHandle.js';
import { initializeReadingAnimations } from '@/components/HistoriaPage/js/animation.js';

export default {
  name: 'historiaPage',
  data() {
    return {
      storyId: '',
      storyTitle: '',
      sentences: [],
      audioSrc: '',
      isPlaying: false,
      isAudioPlaying: false,
      progressPercent: 0,
      visibleSentences: [],
      fontSize: 'medium',
      isDarkTheme: true,
      animations: null,
      lastScrollPosition: 0,
      lastVisibleCount: 0
    };
  },
  async created() {
    const { id } = this.$route.params;
    this.storyId = id;
    await this.fetchStory();
  },
  mounted() {
    // Initialize animations
    this.animations = initializeReadingAnimations();
  },
  methods: {
    async fetchStory() {
      try {
        const response = await getHistoria(this.storyId);
        console.log(response);
        this.storyTitle = response.historia.title;
        this.sentences = response.historia.sentences;
        
        
        if (response.audio) {
          const audioBlob = this.base64ToBlob(
            response.audio.data, response.audio.contentType
          );
          this.audioSrc = URL.createObjectURL(audioBlob);
          this.$refs.audioElement.src = this.audioSrc;
          this.$refs.audioElement.load();
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    },

    
    base64ToBlob(data, contentType) {
      if (Array.isArray(data) || (typeof data === 'string' && data.includes(','))) {
    
        const byteArray = Array.isArray(data) ? data : data.split(',').map(Number);
        
        return new Blob([new Uint8Array(byteArray)], { type: contentType });
      }

      const byteCharacters = atob(data);
      const byteArrays = [];

      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      return new Blob(byteArrays, { type: contentType });
    },
    autoScroll() {
      // Wait for DOM to update
      this.$nextTick(() => {
        const storyContainer = document.querySelector('#storyContainer');
        if (!storyContainer) {
          console.log('Story container not found');
          return;
        }
        
        // Get all sentence elements
        const sentences = document.querySelectorAll('.sentence_');
        if (sentences.length === 0) {
          console.log('No sentences found');
          return;
        }
        
        // Get the last sentence element
        const lastSentence = sentences[sentences.length - 1];
        if (!lastSentence) {
          console.log('Last sentence not found');
          return;
        }
        
        console.log('Checking if scroll needed');
        
        // Calculate if we need to scroll
        const containerRect = storyContainer.getBoundingClientRect();
        const sentenceRect = lastSentence.getBoundingClientRect();
        
        console.log('Container bottom:', containerRect.bottom);
        console.log('Last sentence bottom:', sentenceRect.bottom);
        
        // If the last sentence is below the visible area of the container
        if (sentenceRect.bottom > containerRect.bottom) {
          console.log('Scrolling needed');
          
          // Calculate how much to scroll
          const scrollAmount = sentenceRect.bottom - containerRect.bottom + 20; // Add some padding
          
          console.log('Scroll amount:', scrollAmount);
          
          // Smooth scroll
          storyContainer.scrollTop += scrollAmount;
        }
      });
    },
    
    startStory() {
      this.isPlaying = true;
      this.isAudioPlaying = true;
      
      // Start animations
      if (this.animations) {
        const { updateTextReveal } = this.animations.startStoryAnimations(
          this.sentences, 
          (sentences) => { 
            this.visibleSentences = sentences;
            this.autoScroll(); // Call autoScroll when sentences update
          }
        );
        this.updateTextReveal = updateTextReveal;
      }
      
      this.$refs.audioElement.play();
    },
    
    toggleAudio() {
      if (this.isAudioPlaying) {
        this.$refs.audioElement.pause();
        this.isAudioPlaying = false;
      } else {
        this.$refs.audioElement.play();
        this.isAudioPlaying = true;
      }
    },
    
    updateProgress() {
      const audio = this.$refs.audioElement;
      if (audio.duration) {
        this.progressPercent = (audio.currentTime / audio.duration) * 100;
        
        // Use animation module to update text reveal
        if (this.updateTextReveal) {
          this.updateTextReveal(audio.currentTime / audio.duration);
          // No need to call autoScroll here as it will be called by the callback
        }
      }
    },  
    
    seek(event) {
      const progressContainer = event.currentTarget;
      const rect = progressContainer.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percent = clickX / rect.width;
      
      const audio = this.$refs.audioElement;
      audio.currentTime = percent * audio.duration;
    },
    
    audioEnded() {
      this.isAudioPlaying = false;
      this.visibleSentences = this.sentences; // Show all sentences
      this.$nextTick(() => this.autoScroll());
    },
    
    adjustFontSize(size) {
      this.fontSize = size;
      const sizes = { small: 16, medium: 18, large: 20 };
      if (this.animations) {
        this.animations.toggleFontSize(sizes[size]);
      }
    },
    
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      if (this.animations) {
        this.animations.toggleTheme(this.isDarkTheme);
      }
    },
    
    exitReading() {
      this.$refs.audioElement.pause();
      this.$router.push('/');
    }
  }
};
</script>

<style src="./css/style.css"></style>
<style src="./css/resposive.css"></style>