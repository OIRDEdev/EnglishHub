<template>
  <div>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <div ref="googleButtonContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { userstatedata } from '@/servicesJS/user';

const router = useRouter();
const errorMessage = ref('');
const googleClientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
const googleButtonContainer = ref(null);
const handleGoogleCredentialResponse = async (response) => {
  console.log("Google Credential Response Recebida:", response);
  errorMessage.value = '';

  if (!response.credential) {
    errorMessage.value = 'Falha ao obter credencial do Google.';
    return;
  }

  try {
    const backendResponse = await axios.post('/api/auth/google/callback', {
      credential: response.credential
    }, {withCredentials: true});

    if (backendResponse.status === 200 && backendResponse.data.user) {
      const username = backendResponse.data.user.username;
      const userdata = {
        name: backendResponse.data.user.username,
        email: backendResponse.data.user.email,
        avatar: backendResponse.data.user.picture
      }
      const userStore = userstatedata();
      userStore.setUser(userdata);
      localStorage.setItem('username', username);
      router.push({ name: 'MainAccount', params: { username } });
    } else {
      errorMessage.value = backendResponse.data.message || 'Falha no login no backend.';
    }
  } catch (error) {
    errorMessage.value = `Erro ao processar login: ${error.response?.data?.message || error.message}`;
  } 
};

const initializeGoogleAuth = () => {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredentialResponse,
      ux_mode: 'popup',
      auto_select: false
    });

    
    window.google.accounts.id.renderButton(
      googleButtonContainer.value,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width:'300px',
        text: 'signup_with',
        shape: 'pill'
      }
    );
  }
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    initializeGoogleAuth();
  };
});

onBeforeUnmount(() => {
  window.google?.accounts?.id?.cancel(); 
});

</script>

<style scoped>
.google-signup {
  color: #757575;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,.25);
}

#google-button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
