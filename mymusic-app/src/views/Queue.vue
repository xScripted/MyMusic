<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import { useStore } from 'mymusic-services'
import { IonContent, IonIcon } from '@ionic/vue'
import { close } from 'ionicons/icons'

export default defineComponent({
  components: {
    IonContent,
    IonIcon,
  },
  setup() {
    const store = useStore()
    const renderList = ref(true)

    watch(store.queue, () => forceRender())

    const forceRender = () => {
      renderList.value = false
      nextTick(() => (renderList.value = true))
    }

    const removeSong = (i: number) => {
      store.removeFromQueue(i)
      forceRender()
    }

    return {
      store,
      close,
      renderList,
      removeSong,
    }
  },
})
</script>

<template>
  <ion-content>
    <div
      class="song-container"
      v-for="(song, index) in store.queue"
      :key="song.id"
    >
      <div class="song" :class="{ selected: song.selected }">
        <div class="title">{{ song.title }}</div>
        <div class="artist">{{ song.artist }}</div>
      </div>
      <div class="remove">
        <ion-icon @click="removeSong(index)" :icon="close" />
      </div>
    </div>

    <div class="message" v-if="store.queue.length === 0">
      Press a song during one second to add it to the queue!<br /><br />

      Cool features: <br />
      <ul>
        <li>Reorder list (Hold and move)</li>
        <li>If shuffle is activated,It will shuffle inside the queue list</li>
        <li>Remove songs from the queue</li>
        <li>Songs are playable on tab(click)</li>
      </ul>
    </div>
  </ion-content>
</template>

<style lang="scss" scoped>
ion-content {
  --ion-background-color: rgb(24, 0, 51);
}

.message {
  color: gray;
  padding: 20px;
}

.song-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .song {
    margin-bottom: 5px;
    width: 100%;

    &.selected {
      font-weight: bold;
      font-style: italic;
      background-image: -webkit-linear-gradient(
        214deg,
        rgb(25, 0, 255),
        rgba(255, 0, 206, 1)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .title {
      padding: 5px;
      color: white;
      text-align: left;
    }
    .artist {
      font-size: 12px;
      color: rgb(205, 167, 255);
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
  }
}
</style>
