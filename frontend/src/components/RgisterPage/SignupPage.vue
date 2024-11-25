<template>
    <main class="Main-SignUp-Container">
        <section class="Form-Register-Container">
            <form @submit.prevent="SignUp" autocomplete="off">
                <div class="form-item">
                    <label for="Email">Email</label>
                    <input type="email" v-model="Email" id="Email" placeholder="example@gmail.com"  autocomplete="off" required>  
                </div>

                <div class="form-item">
                    <label for="username">username</label>
                    <input type="text" v-model="username" id="username" placeholder="Digite seu Nome" autocomplete="off," required>
                </div>

                <div class="form-item">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" id="password" placeholder="Digite uma senha"  autocomplete="off" required>
                </div>
                <div class="form-Check">
                    <input type="checkbox" name="checkbox" id="checkbox" class="sc-gJwTLC ikxBAC" required>
                    <label for="checkbox">checkbox</label>
                </div>
                <div class="form-item button">
                    <button type="submit" class="submit-btn">Sign Up</button>
                </div>
            </form> 
        </section>
    </main>
</template>

<script>
import signupfunction from '@/servicesJS/SignUp';
    export default{
        name: "SignupPage",
        data (){
            return{
                Email: '',
                username:'',
                password:''
            };
        },
        methods:{
            async SignUp(){
                console.log(this.Email)
                try{
                    const response = await signupfunction(this.Email, this.username, this.password)
                        if(response.status === 201){
                            this.$router.push('/');
                        }
                    
                    } catch(error){
                            console.log('error durante o cadastramento', error);
                    }
                }
            }     
    }
</script>

<style src="./css/style.css" scoped></style>