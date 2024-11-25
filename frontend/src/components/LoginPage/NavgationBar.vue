<template>
    <section class="Nav-Bar-Section">
        <nav class="Nav-Bar-container">
            <div class="logo">
                <a href="/" target="_blank" rel="noopener noreferrer">
                    <img src="/logoNav.png" alt="">
                </a>
            </div>

            <ul class="links-nav">
                <li class="item-nav">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        HOME
                    </a>
                </li>
                <li class="item-nav">
                    <a href="/about" target="_blank" rel="noopener noreferrer">
                        ABOUT
                    </a>
                </li>
                <li class="item-nav">
                    <a href="/metodo" target="_blank" rel="noopener noreferrer">
                        LEARNING
                    </a>
                </li>
                <li class="item-nav">
                    <a href="/contato" target="_blank" rel="noopener noreferrer">
                        CONTACT
                    </a>
                </li>
            </ul>
            <a href="/register/signUp" class="action_btn">Sign Up</a>

            <div class="toglle_icon">
                <i class="fa-solid fa-bars"></i>
            </div>
        </nav>
    </section>
</template>

<script>
    export default{
        name: "NavgationBar"
    }
</script>
<style>
    li{
        list-style: none;
    }
    .links-nav a, .logo a{
        text-decoration: none;
        color: aqua;
        font-size: 1rem;
    }
    
    a:hover{
        color: black;
    }
    .Nav-Bar-Section{
        position: relative;
        padding: 0 2rem;
        z-index: 10;
    }
    .Nav-Bar-container{ 
        width: 100%;
        height: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .Nav-Bar-container .logo a{
        font-size: 1.5rem;
        font-weight: bold;
        position: absolute;
        top: 0;
    }
    .Nav-Bar-container .links-nav{
        display: flex;
        gap: 2rem;
        padding-left: 0;

    }

    .Nav-Bar-container .toglle_icon{
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
    }

    .action_btn{
        background-color: blueviolet;
        color: black;
        padding: 0.5rem 1rem;
        border: none;
        outline: none;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
    }
    .action_btn:hover{
        scale: 1.05;
        color: orangered;
    }

    img{
        width: auto;
        height: 100px;
    }
</style>