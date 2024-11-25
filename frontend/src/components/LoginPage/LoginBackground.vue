<template>
  <div class="background">
    <div class="triangulo-superior"></div>
    <div class="triangulo-inferior"></div>
  </div>
</template>

<script>
    export  default{
        name: "LoginBackground"
    }
</script>

<style>
  .triangulo-superior{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(2,0,36);
    background: linear-gradient(247deg, rgba(2,0,36,1) 6%, rgba(9,9,121,1) 44%, rgba(0,212,255,1) 95%);
    clip-path: polygon(0% 0%,
                   130% 0%,
                   0% 120%,
                    0% 0%);
  }
</style>