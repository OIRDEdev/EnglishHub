<template>
  <NavgationBar />

  <main class="main-content">
    <section class="intro-login">
      <section class="login-name">
          <h1 class="montserrat-bold">ENGLISH HUB</h1>
          <h3 class="montserrat-medium">Expanda seu vocabulário de forma divertida! Mergulhe em <br>narrativas envolventes que tornam o 
            aprendizado do inglês <br>intuitivo e memorável. Comece sua jornada agora!</h3>
      </section>
      <section class="login-form">
        <form @submit.prevent="loginUser">
          <div class="form-Email">
            <label for="username">E-mail</label>
            <input type="text" v-model="username" id="username"  placeholder="Digite seu Username" autocomplete="off"   required>
          </div>
          <div class="form-Password">
            <label for="password">Senha</label>
            <input type="password" v-model="password" id="password" placeholder="Digite sua senha" autocomplete="off" required>
          </div>
          <div class="form-Btn-submit">
            <button type="submit">LogIn</button>
          </div>
          <div class="Extra">
             <a href="/auth/forgotPassword"><span>Esqueceu sua senha?</span></a>
          </div>
        </form>
      
      </section>
    </section>
  </main>

  <LoginBackground />
</template>

<script>
import LoginBackground from './LoginBackground.vue';
import NavgationBar from './NavgationBar.vue';
import loginUser from '@/servicesJS/LoginJS.js';

export default {
  name: "LoginPage",
  data (){
    return {
      username: '',
      password: ''  
    };
  },
  components: {
    LoginBackground,
    NavgationBar,
  },
  methods:{
    async loginUser(){
      try {
        const response = await loginUser(this.username, this.password);
        
        if(response.status === 200){
          this.$router.push('/main/account');
        }
      }catch (error) {
        console.error('Erro durante o login:', error);
      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Jacquarda+Bastarda+9+Charted&family=Jersey+15+Charted&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap');

  .main-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 5;
  }
  .intro-login{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 112%;
  }
  .login-name{
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  

  .montserrat-bold {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700; 
    font-size:  96px;
    color: white;
    margin: 0;
  }
  .montserrat-medium {
    font-family: 'Montserrat', sans-serif;
    font-weight: 550; 
    font-size: large;
    color: white;  
  }
  .login-form{
    background: white;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    height: 387px;
    width: 487px;
    box-shadow: 0 0 7px 4px rgba(0, 0, 0, 0.5);
    justify-content: center;
  }
  form{
    margin: 24px;
  }
  [class^="form-"] {
    padding: 6px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  label{
    padding: 6px;
  }

  input{
      box-sizing: border-box;
      font-family: inherit;
      font-size: 20px;
      vertical-align: baseline;
      font-weight: 400;
      line-height: 1.29;
      letter-spacing: .16px;
      border-radius: 0;
      outline: 2px solid transparent;
      outline-offset: -2px;
      width: 100%;
      height: 40px;
      border: none;
      border-bottom: 1px solid #8d8d8d;
      background-color: #ffffff;
      padding: 0 16px;
      color: #161616;
      transition: background-color 70ms cubic-bezier(.2,0,.38,.9),outline 70ms cubic-bezier(.2,0,.38,.9);  
      :focus{
          outline: 2px solid #0f62fe;
          outline-offset: -2px;
      }
  }

  button{
    display: inline-block;
    outline: 0;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 2px 5px 0 rgb(213 217 217 / 50%);
    background: #FFD814;
    border: 1px solid #FCD200;
    font-size: 13px;
    height: 31px;
    padding: 0 11px;
    text-align: center;
    width: 100%;
    min-width: 200px;
    font-weight: 500;
    color: #0F1111;
    :hover{
        background: #F7CA00;
        border-color: #F2C200;
        box-shadow: 0 2px 5px 0 rgb(213 217 217 / 50%);
    }
  }

  .form-Btn-submit{
    margin-top: 25px;
  }

  .Extra a{ 
    text-decoration: none;
    color: #0F1111;
  }

</style>
