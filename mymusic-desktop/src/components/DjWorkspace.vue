<script setup lang="ts">
  const playFtx = (sound = '') => {
    new Audio(`ftx/${sound}.mp3`).play()
  }
</script>

<style lang="scss" scoped>
.buttons {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  margin-top: 50px;
}
</style>

<template>
  <div class="queue">
    <h1>DJ Workspace</h1>
    <div class="buttons">
        <button class="button-85" @click="playFtx('feria1')">Beep</button>
        <button class="button-85" @click="playFtx('chiste')">Joke</button>
        <button class="button-85" @click="playFtx('rain')">Rain</button>
        <button class="button-85" @click="playFtx('beat1')">Beat1</button>
        <button class="button-85" @click="playFtx('beat2')">Beat2</button>
        <button class="button-85" @click="playFtx('plato')">Box</button>
    </div>
  </div>
</template>
