<script setup lang="ts">
import { useStore } from 'mymusic-services'

const store = useStore()
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}

.song-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .song {
    margin-bottom: 5px;
    width: 100%;
    cursor: pointer;

    .title {
      padding: 5px;
      color: white;
      text-align: left;
    }
    .artist {
      font-size: 12px;
      color: $colorLightViolet;
      padding: 5px;
      padding-top: 0px;
      text-align: left;
    }
  }

  .remove {
    cursor: pointer;
    padding: 0 20px;
    font-size: 25px;
    color: white;

    filter: invert(1);

    img {
      width: 25px;
      height: 25px;
    }
  }
}
</style>

<template>
  <div class="queue">
    <h1>Queue</h1>
    <div
      class="song-container"
      v-for="(song, index) in store.queue"
      :key="song.id"
    >
      <div class="song" :class="{ selected: song.selected }">
        <div class="title">{{ song.title }}</div>
        <div class="artist">{{ song.artist }}</div>
      </div>
      <div class="remove" @click="store.removeFromQueue(index)">
        <img src="@/assets/icons/close.svg" />
      </div>
    </div>
  </div>
</template>
