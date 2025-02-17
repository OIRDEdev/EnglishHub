<template>
    <div class="book-container">
    <header class="book-header">
      <h1 class="book-title">{{ book.title }}</h1>
    </header>
    <main class="book-content">
      <p v-for="(paragraph, index) in book.Text" :key="index">{{ paragraph }}</p>
    </main>
    <button class="next-page" @click="nextPage">&#8594;</button>
  </div>
</template>

<script>
  export default{
    name: "HistoriaPage",
  }
</script>

<style src="./css/style.css"></style>