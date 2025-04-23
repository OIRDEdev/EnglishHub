<template>
  <div class="anki-container">
    <!-- Header -->
    <header class="anki-header">
      <div class="site-name">EnglishHub</div>
      <nav class="nav-menu">
        <div class="nav-item" :class="{ active: currentView === 'decks' }" @click="setView('decks')">Decks</div>
        <div class="nav-item" :class="{ active: currentView === 'train' }" @click="setView('train')">Train</div>
        <div class="nav-item" @click="showConfigModal = true">Configure</div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="anki-content">
      <!-- Decks View -->
      <div v-if="currentView === 'decks'" class="decks-view">
        <h2 class="section-title">My Decks</h2>
        
        <div class="create-section">
          <button class="transparent-btn" @click="showCreateCardModal = true">
            + Novo Card (Manual)
          </button>
        </div>
        
        <div class="decks-carousel">
          <button class="carousel-nav-btn prev-btn" @click="moveDeckCarousel(-1)" v-if="decks.length > 3">❮</button>
          <div class="deck-cards-container">
            <div class="deck-cards" :style="deckCarouselStyle">
              <div 
                v-for="(deck, index) in decks" 
                :key="index" 
                class="deck-card"
                @click="selectDeck(deck)"
              >
                <h3>{{ deck.name }}</h3>
                <div class="deck-stats">
                  <span>{{ deck.totalCards }} cards</span>
                </div>
              </div>
            </div>
          </div>
          <button class="carousel-nav-btn next-btn" @click="moveDeckCarousel(1)" v-if="decks.length > 3">❯</button>
        </div>
      </div>

      <!-- Train View -->
      <div v-if="currentView === 'train'" class="train-view">
        <h2 class="section-title" v-if="currentDeck">Deck: {{ currentDeck.name }}</h2>
        
        <div class="card-container">
          <div class="anki-card" :class="{ flipped: isCardFlipped }">
            <div class="card-front">
              <p>{{ currentCard ? currentCard.front : 'No cards available' }}</p>
            </div>
            <div class="card-back">
              <p>{{ currentCard ? currentCard.back : '' }}</p>
            </div>
          </div>
          
          <div class="card-actions">
            <button 
              v-if="!isCardFlipped" 
              class="transparent-btn show-btn" 
              @click="flipCard"
            >
              Show Card
            </button>
            
            <div v-else class="difficulty-buttons">
              <button class="transparent-btn difficulty-btn easy" @click="rateCard('easy')">Easy</button>
              <button class="transparent-btn difficulty-btn medium" @click="rateCard('medium')">Médio</button>
              <button class="transparent-btn difficulty-btn hard" @click="rateCard('hard')">Difícil</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Card Modal -->
    <div class="modal" v-if="showCreateCardModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create New Card</h3>
          <span class="close-btn" @click="showCreateCardModal = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Front (Question):</label>
            <textarea v-model="newCard.front" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Back (Answer):</label>
            <textarea v-model="newCard.back" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Select Deck:</label>
            <select v-model="newCard.deckId">
              <option v-for="deck in decks" :key="deck.id" :value="deck.id">{{ deck.name }}</option>
            </select>
          </div>
          <button class="transparent-btn submit-btn" @click="createCard">Save Card</button>
        </div>
      </div>
    </div>

    <!-- Config Modal -->
    <div class="modal" v-if="showConfigModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Configuration</h3>
          <span class="close-btn" @click="showConfigModal = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="config-option">
            <label>Card Size:</label>
            <div class="option-controls">
              <button @click="config.cardSize = 'small'" :class="{ active: config.cardSize === 'small' }">Small</button>
              <button @click="config.cardSize = 'medium'" :class="{ active: config.cardSize === 'medium' }">Medium</button>
              <button @click="config.cardSize = 'large'" :class="{ active: config.cardSize === 'large' }">Large</button>
            </div>
          </div>
          <div class="config-option">
            <label>Font Size:</label>
            <div class="option-controls">
              <button @click="config.fontSize = 'small'" :class="{ active: config.fontSize === 'small' }">Small</button>
              <button @click="config.fontSize = 'medium'" :class="{ active: config.fontSize === 'medium' }">Medium</button>
              <button @click="config.fontSize = 'large'" :class="{ active: config.fontSize === 'large' }">Large</button>
            </div>
          </div>
          <div class="config-option">
            <label>Dark Mode:</label>
            <div class="toggle-switch">
              <input type="checkbox" id="darkMode" v-model="config.darkMode">
              <label for="darkMode"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Backdrop -->
    <div class="modal-backdrop" v-if="showCreateCardModal || showConfigModal" @click="closeAllModals"></div>
  </div>
</template>

<script>
import { Getsentences, updateReviewCards, addsentencesFrontfunction } from '@/servicesJS/AnkiHandle';

export default {
  data() {
    return {
      currentView: 'decks',
      decks: [],
      currentDeck: null,
      currentCard: null,
      isCardFlipped: false,
      currentDeckPosition: 0,
      cards: [],
      currentCardIndex: 0,
      showCreateCardModal: false,
      showConfigModal: false,
      newCard: {
        front: '',
        back: '',
        deckId: null
      },
      config: {
        cardSize: 'medium',
        fontSize: 'medium',
        darkMode: false
      }
    };
  },
  computed: {
    deckCarouselStyle() {
      const cardWidth = 280; // Width of each deck card + margin
      return `transform: translateX(-${this.currentDeckPosition * cardWidth}px)`;
    }
  },
  async mounted() {
    await this.fetchCards();
  },
  methods: {
    async fetchCards(deckId) {
      let card_old = '';
      try {
        const sentences = await Getsentences(deckId);
        this.cards = sentences.map(sentence => {
          const { front, back } = this.parseExpression(sentence.expression);


          
          const card_name = sentence.title;
          if(card_name !== card_old){
            const card = {
              id: sentence.book_id,
              name: sentence.title,
              totalCards: sentence.cards_count_in_book
            };
            this.decks.push(card);
            card_old = sentence.title;
          }
          return {
              id: sentence.id_card,
              front,
              back,
              difficulty: sentence.learning_rating || 'medium',
  
            };
        });
        

        if (this.cards.length > 0) {
          this.currentCardIndex = 0;
          this.currentCard = this.cards[0];
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    },
    parseExpression(expression){
          const [front, ...rest] = expression.split(' - ');
          const back = rest.join(' - ');
          return {
            front: front.trim(),
            back: back.trim(),
          };
    },
    setView(view) {
      this.currentView = view;
      if (view === 'train' && !this.currentDeck) {
        if (this.decks.length > 0) {
          this.selectDeck(this.decks[0]);
        }
      }
    },
    selectDeck(deck) {
      this.currentDeck = deck;
      this.setView('train');
    },
    moveDeckCarousel(direction) {
      const maxPosition = Math.max(0, this.decks.length - 3);
      this.currentDeckPosition = Math.min(
        Math.max(0, this.currentDeckPosition + direction),
        maxPosition
      );
    },
    flipCard() {
      this.isCardFlipped = true;
    },
    async rateCard(difficulty) {
      if (!this.currentCard) return;
      
      try {
        
        await updateReviewCards(this.currentCard.front, difficulty === 'easy');
        
       
        this.isCardFlipped = false;
        this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
        this.currentCard = this.cards[this.currentCardIndex];
      } catch (error) {
        console.error('Error rating card:', error);
      }
    },
    async createCard() {
      if (!this.newCard.front || !this.newCard.back || !this.newCard.deckId) {
        alert('Please fill in all fields');
        return;
      }
      
      try {
        await addsentencesFrontfunction(this.newCard.front, this.newCard.deckId);
        this.showCreateCardModal = false;
        this.newCard = { front: '', back: '', deckId: null };
        // Refresh the cards if we're viewing the same deck
        if (this.currentDeck && this.currentDeck.id === this.newCard.deckId) {
          await this.fetchCards(this.currentDeck.id);
        }
      } catch (error) {
        console.error('Error creating card:', error);
      }
    },
    closeAllModals() {
      this.showCreateCardModal = false;
      this.showConfigModal = false;
    },

  }
};
</script>

<style src="./css/style.css" scoped></style>
