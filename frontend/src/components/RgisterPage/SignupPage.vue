<template>
    <div class="signup-container">
      <div class="signup-wrapper">
        <div class="signup-card">
          <!-- Signup Form -->
          <transition name="fade" mode="out-in">
            <div v-if="!isSignupComplete" class="signup-form">
              <h2>Create Your Account</h2>
              <form @submit.prevent="handleSignup" autocomplete="off">
                <!-- Email Input -->
                <div class="form-group">
                  <input type="email" id="email" v-model="email" required>
                  <label for="email">Email</label>
                </div>
  
                <!-- Username Input -->
                <div class="form-group">
                  <input type="text" id="username" v-model="username"  required>
                  <label for="username">Username</label>
                </div>
  
                <!-- Password Input -->
                <div class="form-group">
                  <input type="password" id="password" v-model="password" required>
                  <label for="password">Password</label>
                </div>
  
                <!-- Terms Checkbox -->
                <div class="terms-group">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    v-model="termsAccepted" 
                    required
                  >
                  <label for="terms">
                    I accept the Terms and Conditions
                  </label>
                </div>
  
                <!-- Signup Button -->
                <button 
                  type="submit" 
                  :disabled="!termsAccepted"
                  class="signup-button"
                >
                  Sign Up
                </button>
              </form>
  
              <!-- Alternative Signup Options -->
              <div class="alternative-signup">
                <div class="divider">
                  <hr>
                  <span>or Sign up with</span>
                  <hr>
                </div>
                <button 
                  @click="signupWithGoogle"
                  class="google-signup"
                >
                  <svg viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.42 6.63v5.52h7.11c4.16-3.83 6.57-9.47 6.57-16.16z"/>
                    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                    <path fill="#FBBC05" d="M11.68 28.18C11.18 26.43 10.9 24.74 10.9 23s.28-3.43.78-5.07V12.3H4.34A21.75 21.75 0 0 0 2 23c0 3.54.85 6.89 2.34 9.87l7.34-5.69z"/>
                    <path fill="#EA4335" d="M24 9.5c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 14.13l7.34 5.69c1.74-5.2 6.59-9.07 12.32-9.07z"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </div>
  
            <!-- Verification Completion State -->
            <div v-else class="verification-complete">
              <div class="checkmark">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2>Registration Complete</h2>
              <p>An email verification was sent to your inbox.</p>
              <button @click="goToLogin">
                Go to Login
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import signupFunction from '@/servicesJS/SignUp';
  
  export default {
    name: 'SignupPage',
    data() {
      return {
        email: '',
        username: '',
        password: '',
        termsAccepted: false,
        isSignupComplete: false
      };
    },
    methods: {
      async handleSignup() {
        try {
          const response = await signupFunction(this.email, this.username, this.password);
          
          if (response.status === 200) {
            this.isSignupComplete = true;
          }
        } catch (error) {
          console.error('Signup error:', error);
        }
      },
      signupWithGoogle() {
        console.log('Signing up with Google');
      },
      goToLogin() {
        this.$router.push('/auth/login');
      }
    }
  };
  </script>
  
  <style scoped src="./css/style.css"></style>