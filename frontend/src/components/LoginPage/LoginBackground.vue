<template>
  <div class="background">
    <div class="gradient-bg"></div>
  </div>
</template>

<script>
export default {
  name: "LoginBackground"
}
</script>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    #0f0c29,
    #302b63,
    #24243e
  );
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>