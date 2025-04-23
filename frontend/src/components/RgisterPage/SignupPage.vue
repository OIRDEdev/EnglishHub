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
                  <GoogleButton />
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
  import GoogleButton from '../GoogleTemplateB/GoogleButton.vue';
  export default {
    name: 'SignupPage',
    components: {
      GoogleButton
    },
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