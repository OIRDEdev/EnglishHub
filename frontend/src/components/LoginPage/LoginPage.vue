<template>
  <main class="main-content">
    <div class="login-container">
      <div class="login-card">
        <div class="login-left">
          <div class="login-form">
            <h2>Welcome Back</h2>
            <p class="subtitle">Please login to your account</p>
            
            <form @submit.prevent="loginUser">
              <div class="form-group">
                <input type="text" v-model="username" id="username" required>
                <label for="username">Username</label>
              </div>

              <div class="form-group">
                <input type="password" v-model="password" id="password" required>
                <label for="password">Password</label>
              </div>

              <div class="form-actions">
                <button type="submit" class="login-btn">Login</button>
                <a href="/auth/forgotPassword" class="forgot-password">Forgot password?</a>
              </div>

              <div class="signup-prompt">
                <p>Don't have an account?</p>
                <router-link to="/auth/signUp" class="signup-btn">Sign Up</router-link>
              </div>
            </form>

            <div class="alternative-login">
              <GoogleButton />
            </div>

          </div>
        </div>

        <div class="login-right">
          <div class="welcome-content">
            <h1>ENGLISH HUB</h1>
            <p>Expand your vocabulary in a fun way! Dive into engaging narratives that make learning English intuitive and memorable.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import loginUser from '@/servicesJS/LoginJS.js';
import GoogleButton from '../GoogleTemplateB/GoogleButton.vue'; 

export default {
  name: "LoginPage",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  components: {
    GoogleButton
  },
  methods: {
    async loginUser() {
      try {
        const response = await loginUser(this.username, this.password);
        if(response.status === 200) {
          this.$router.push(`/main/${this.username}`);
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  }
}
</script>

<style src="./css/style.css" scoped></style>
<style src="./css/responsive.css" scoped></style>
