<template>
    <div class="verification-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Verificando seu email...</p>
      </div>
      
      <div v-else-if="verified" class="success">
        <h1>Email Verificado!</h1>
        <p>Seu email foi verificado com sucesso.</p>
        <p>Você será redirecionado para a página principal em {{ countdown }} segundos...</p>
        <button @click="goToMain" class="btn-primary">Ir para a página principal</button>
      </div>
      
      <div v-else-if="error" class="error">
        <h1>Erro na Verificação</h1>
        <p>{{ errorMessage }}</p>
        <div v-if="showResend">
          <p>Deseja receber um novo link de verificação?</p>
          <div class="email-input">
            <input type="email" v-model="email" placeholder="Confirme seu email" />
            <button @click="resendVerification" :disabled="resending" class="btn-secondary">
              {{ resending ? 'Enviando...' : 'Reenviar' }}
            </button>
          </div>
          <p v-if="resendSuccess" class="success-message">
            Link de verificação enviado! Verifique seu email.
          </p>
        </div>
        <button @click="goToLogin" class="btn-primary">Voltar para o login</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'VerifyEmail',
    data() {
      return {
        loading: true,
        verified: false,
        error: false,
        errorMessage: '',
        countdown: 5,
        showResend: false,
        email: '',
        resending: false,
        resendSuccess: false
      };
    },
    created() {
      // Get token from URL
      const token = this.$route.query.token;
      
      if (!token) {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Token de verificação não encontrado.';
        this.showResend = true;
        return;
      }
      
      this.verifyEmail(token);
    },
    methods: {
      async verifyEmail(token) {
        try {
          await axios.get(`/api/auth/verify?token=${token}`);
          this.loading = false;
          this.verified = true;
          this.startCountdown();
        } catch (error) {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.response?.data?.message || 'Erro ao verificar email.';
          this.showResend = true;
        }
      },
      startCountdown() {
        const interval = setInterval(() => {
          this.countdown--;
          
          if (this.countdown <= 0) {
            clearInterval(interval);
            this.goToMain();
          }
        }, 1000);
      },
      goToMain() {
        this.$router.push('/');
      },
      goToLogin() {
        this.$router.push('/login');
      },
      async resendVerification() {
        if (!this.email) {
          alert('Por favor, informe seu email.');
          return;
        }
        
        this.resending = true;
        
        try {
          await axios.post('/api/auth/resend-verification', { email: this.email });
          this.resendSuccess = true;
          this.resending = false;
        } catch (error) {
          alert(error.response?.data?.message || 'Erro ao reenviar verificação.');
          this.resending = false;
        }
      }
    }
  }
  </script>
  
  <style scoped src="./css/style.css"></style>