<template>
  <div class="story-player-container" :class="{ 'dark-theme': isDarkTheme, 'ui-hidden': uiHidden }">
    <!-- Loading screen -->
    <div class="loading-screen" v-if="isLoading">
      <div class="loading-spinner"></div>
      <p>Loading your story...</p>
    </div>
    
    <!-- Main Content Column -->
    <div class="main-content-column" v-if="!isLoading">
      <h1 class="story-title">{{ storyTitle }}</h1>
      
      <div class="story-content" :class="fontSize">
        <p>
          <span 
            v-for="(sentence, index) in visibleSentences" 
            :key="index" 
            class="sentence"
            @mouseover="handleSentenceHover(sentence, index, $event)"
            @mouseleave="hideTranslation(0)"
          >
            <span 
              v-for="(word, wordIdx) in splitSentence(sentence.original)" 
              :key="`${index}-${wordIdx}`" 
              class="word"
              @click="handleWordClick(word, index, wordIdx, $event)"
            >
              {{ word }}
            </span>
            <span class="sentence-end"> </span>
          </span>
        </p>
      </div>
      
      <!-- Word translation tooltip -->
      <div 
        class="word-translation" 
        v-if="hoveredSentence" 
        :style="tooltipStyle"
        @mouseenter="isTooltipHovered = true"
        @mouseleave="hideTranslation(1)"
      >
        <div class="tooltip-content">
          <div class="tooltip-word">{{ hoveredSentence.original }}</div>
          <div class="tooltip-translation">{{ hoveredSentence.translation }}</div>
          <div v-if="clickedWord" class="word-specific-translation">
            <div class="clicked-word">{{ clickedWord.text }}</div>
            <div class="word-translation-text">
              <span v-if="clickedWord.translation">{{ clickedWord.translation }}</span>
              <span v-else class="loading-indicator">Loading...</span>
            </div>
          </div>
          <button class="add-to-anki-btn" @click="addWordToAnki(hoveredSentence.original)">+ Add to Anki</button>
        </div>
      </div>
      
      <!-- Audio Player -->
      <div class="audio-player" :class="{ 'visible': isPlaying }">
        <button class="player-button" :class="isAudioPlaying ? 'pause' : 'play'" @click="toggleAudio"></button>
        <div class="progress-container" @click="seek">
          <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}</div>
      </div>
    </div>
    
    <!-- Settings Sidebar -->
    <div class="settings-sidebar" :class="{ 'collapsed': sidebarCollapsed }" v-if="!isLoading">
      <button class="toggle-sidebar-btn" @click="toggleSidebar">
        {{ sidebarCollapsed ? '+' : '—' }}
      </button>
      
      <div class="sidebar-content" v-if="!sidebarCollapsed">
        <div class="settings-section">
          <h3>Settings</h3>
          
          <div class="setting-item">
            <label>Font Size</label>
            <input type="range" min="1" max="3" step="1" v-model="fontSizeLevel" @change="updateFontSize" />
            <div class="size-indicators">
              <span>A</span>
              <span>A</span>
              <span>A</span>
            </div>
          </div>
          
          <div class="setting-item">
            <label>Theme</label>
            <button @click="toggleTheme" class="theme-btn">
              {{ isDarkTheme ? '☀️ Light' : '🌙 Dark' }}
            </button>
          </div>
          
          <div class="setting-item">
            <label>Language</label>
            <select v-model="selectedLanguage">
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
        
        <button class="exit-button" @click="exitReading">Exit Reading</button>
      </div>
    </div>
    
    <!-- Hidden audio element -->
    <audio ref="audioElement" @timeupdate="updateProgress" @loadedmetadata="audioLoaded" @ended="audioEnded"></audio>
    
    <!-- Initial splash screen -->
    <div class="splash-screen" v-if="!isLoading && !isPlaying">
      <h1>{{ storyTitle }}</h1>
      <button class="start-button" @click="startStory">Start Reading</button>
    </div>
  </div>
</template>

<script>
import { getHistoria } from '@/servicesJS/HistoriaHandle.js';
import { initializeReadingAnimations } from '@/components/HistoriaPage/js/animation.js';
import { addsentencesFrontfunction } from '@/servicesJS/AnkiHandle';
import gettranslation from '@/servicesJS/translation';

export default {
  name: 'historiaPage',
  data() {
    return {
      storyId: '',
      storyTitle: '',
      sentences: [],
      audioSrc: '',
      isLoading: true,
      isPlaying: false,
      isAudioPlaying: false,
      progressPercent: 0,
      visibleSentences: [],
      fontSizeLevel: 2,
      fontSize: 'medium',
      isDarkTheme: true,
      animations: null,
      uiHidden: false,
      uiTimer: null,
      sidebarCollapsed: false,
      showTranslations: false,
      selectedLanguage: 'en',
      currentTime: 0,
      totalDuration: 0,
      currentWordIndex: { sentence: 0, word: 0 },
      hoveredSentence: null,
      tooltipStyle: {},
      isTooltipHovered: false,
      isLoadingTranslation: false,
      currentSentenceIndex: null,
      currentWordPosition: null,
      clickedWord: null
    };
  },
  async created() {
    const { id } = this.$route.params;
    this.storyId = id;
    await this.fetchStory();
  },
  mounted() {
    this.animations = initializeReadingAnimations();
    
    // Auto-hide UI after inactivity
    document.addEventListener('mousemove', this.resetUiTimer);
    document.addEventListener('mousedown', this.resetUiTimer);
    document.addEventListener('keypress', this.resetUiTimer);
    document.addEventListener('touchstart', this.resetUiTimer);
    
    this.resetUiTimer();
  },
  beforeUnmount() {
    // Remove event listeners
    document.removeEventListener('mousemove', this.resetUiTimer);
    document.removeEventListener('mousedown', this.resetUiTimer);
    document.removeEventListener('keypress', this.resetUiTimer);
    document.removeEventListener('touchstart', this.resetUiTimer);
    
    if (this.uiTimer) {
      clearTimeout(this.uiTimer);
    }
  },
  methods: {
    async fetchStory() {
      try {
        this.isLoading = true;
        const response = await getHistoria(this.storyId);
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
        
        // Simulate loading time for visual effect (remove in production)
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
      } catch (error) {
        console.error('Error fetching story:', error);
        this.isLoading = false;
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
    
    splitSentence(sentence) {
      return sentence.split(/\s+/);
    },
    
    isCurrentWord(sentenceIndex, wordIndex) {
      return this.currentWordIndex.sentence === sentenceIndex && 
             this.currentWordIndex.word === wordIndex;
    },
    
    async handleSentenceHover(sentence, index, event) {
      this.hoveredSentence = sentence;
      this.currentSentenceIndex = index;
      
      // Position the tooltip above the sentence
      const rect = event.target.getBoundingClientRect();
      const tooltipHeight = 120; // Approximate height of tooltip
      
      this.tooltipStyle = {
        top: (rect.top - tooltipHeight) + 'px',
        left: rect.left + (rect.width / 2) + 'px'
      };
    },
    
    async handleWordClick(word, sentenceIndex, wordIndex, event) {
      // Skip very short words
      if (word.length < 3) return;
      
      // Clean the word of punctuation
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"()]/g, '');
      
      // Set the clicked word data
      this.clickedWord = {
        text: word,
        translation: null
      };
      
      // Get translation for the clicked word
      try {
        const translation = await gettranslation(cleanWord);
        if (this.clickedWord && this.clickedWord.text === word) {
          this.clickedWord.translation = translation;
        }
      } catch (error) {
        console.error('Error fetching translation:', error);
        this.clickedWord.translation = 'Error loading translation';
      }
      
      // Prevent event from bubbling to sentence
      event.stopPropagation();
    },
    
    hideTranslation(num) {
        if(num === 1){
          this.isTooltipHovered = false
        }
        setTimeout(() => {
          if (!this.isTooltipHovered) {
            this.hoveredSentence = null;
            this.clickedWord = null;
            this.currentSentenceIndex = null;
          }
        }, 100);
    },
    
    addWordToAnki(text) {
      const translation = this.hoveredSentence.translation;
      const sentence = `${text} - ${translation}`;
      
      addsentencesFrontfunction(sentence, this.storyId);
      
      if (this.animations) {
        this.animations.animateAnkiAddition();
      }
      
      // Hide the tooltip
      this.hoveredSentence = null;
      this.clickedWord = null;
    },
    
    updateCurrentWord(progress) {
      // Calculate which word to highlight based on audio progress
      // This is a simplified version - in a real implementation, 
      // you might use timestamps for each word
      
      if (this.visibleSentences.length === 0) return;
      
      const allWords = this.visibleSentences.map(
        sentence => this.splitSentence(sentence.original)
      );
      
      const totalWords = allWords.reduce((total, words) => total + words.length, 0);
      const wordIndex = Math.floor(progress * totalWords);
      
      let wordCounter = 0;
      for (let sentenceIdx = 0; sentenceIdx < allWords.length; sentenceIdx++) {
        const sentenceWordCount = allWords[sentenceIdx].length;
        
        if (wordCounter + sentenceWordCount > wordIndex) {
          const wordInSentence = wordIndex - wordCounter;
          this.currentWordIndex = {
            sentence: sentenceIdx,
            word: wordInSentence
          };
          return;
        }
        
        wordCounter += sentenceWordCount;
      }
    },
    
    startStory() {
      this.isPlaying = true;
      this.isAudioPlaying = true;
      
      // Start animations through the animations module
      if (this.animations) {
        const { updateTextReveal } = this.animations.startStoryAnimations(
          this.sentences, 
          (sentences) => { 
            this.visibleSentences = sentences;
          }
        );
        this.updateTextReveal = updateTextReveal;
      }
      
      this.$refs.audioElement.play();
      this.resetUiTimer();
    },
    
    toggleAudio() {
      if (this.isAudioPlaying) {
        this.$refs.audioElement.pause();
        this.isAudioPlaying = false;
      } else {
        this.$refs.audioElement.play();
        this.isAudioPlaying = true;
      }
      this.resetUiTimer();
    },
    
    audioLoaded() {
      const audio = this.$refs.audioElement;
      this.totalDuration = audio.duration || 0;
    },
    
    updateProgress() {
      const audio = this.$refs.audioElement;
      if (audio.duration) {
        this.progressPercent = (audio.currentTime / audio.duration) * 100;
        this.currentTime = audio.currentTime;
        
        // Update text reveal animation
        if (this.updateTextReveal) {
          this.updateTextReveal(audio.currentTime / audio.duration);
        }
        
        // Update current word highlighting
        this.updateCurrentWord(audio.currentTime / audio.duration);
      }
    },
    
    seek(event) {
      const progressContainer = event.currentTarget;
      const rect = progressContainer.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percent = clickX / rect.width;
      
      const audio = this.$refs.audioElement;
      audio.currentTime = percent * audio.duration;
      this.resetUiTimer();
    },
    
    audioEnded() {
      this.isAudioPlaying = false;
      this.visibleSentences = this.sentences;
    },
    
    updateFontSize() {
      const sizeMap = {
        1: 'small',
        2: 'medium',
        3: 'large'
      };
      this.fontSize = sizeMap[this.fontSizeLevel];
      
      if (this.animations) {
        const sizes = { small: 16, medium: 18, large: 22 };
        this.animations.toggleFontSize(sizes[this.fontSize]);
      }
      this.resetUiTimer();
    },
    
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      if (this.animations) {
        this.animations.toggleTheme(this.isDarkTheme);
      }
      this.resetUiTimer();
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      if (this.animations) {
        this.animations.toggleSidebar(this.sidebarCollapsed);
      }
      this.resetUiTimer();
    },
    
    resetUiTimer() {
      this.uiHidden = false;
      if (this.uiTimer) {
        clearTimeout(this.uiTimer);
      }
      
      this.uiTimer = setTimeout(() => {
        if (this.isPlaying && this.isAudioPlaying) {
          this.uiHidden = true;
        }
      }, 3000);
    },
    
    formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    },
    
    sendSentence(index) {
      const englishText = this.visibleSentences[index].original;
      const translationText = this.visibleSentences[index].translation;
      const sentence = `${englishText} - ${translationText}`;
      
      addsentencesFrontfunction(sentence, this.storyId);
      
      if (this.animations) {
        this.animations.animateAnkiAddition();
      }
      this.resetUiTimer();
    },
    
    exitReading() {
      this.$refs.audioElement.pause();
      this.$router.push('/');
    }
  }
}
</script>

<style src="./css/style.css"></style>
<style src="./css/resposive.css"></style>