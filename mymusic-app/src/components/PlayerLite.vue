<script lang="ts">
import { IonIcon } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { defineComponent, inject } from 'vue'
import { play, pause, chevronForward, chevronBack } from 'ionicons/icons'
import { useStore } from 'mymusic-services'

export default defineComponent({
  components: {
    IonIcon,
  },
  setup() {
    const router = useRouter()
    const emitter: any = inject('emitter')
    const store = useStore()

    return {
      store,
      play,
      pause,
      chevronForward,
      chevronBack,
      router,
      emitter,
    }
  },
})
</script>

<template>
  <div id="PlayerLite" :class="{ animated: store.playing }">
    <div class="info" @click="() => router.push('/player')">
      <div class="title">{{ store.currentSong?.title }}</div>
      <div class="artist">{{ store.currentSong?.artist }}</div>
    </div>
    <div class="buttons">
      <ion-icon @click="emitter.emit('before')" :icon="chevronBack"></ion-icon>
      <ion-icon
        v-if="!store.playing"
        @click="emitter.emit('play')"
        class="play-pause"
        :icon="play"
      />
      <ion-icon
        v-else
        @click="emitter.emit('pause')"
        class="play-pause"
        :icon="pause"
      />
      <ion-icon @click="emitter.emit('next')" :icon="chevronForward"></ion-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#PlayerLite {
  position: absolute;
  bottom: 60px;
  width: 100%;
  height: 70px;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    214deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 20%,
    rgba(255, 0, 206, 1) 100%
  );
  background-size: 200% 200%;
  border-top: 2px solid rgb(9, 9, 9);

  &.animated {
    animation: rotatebg 5s ease infinite;
  }

  .info {
    width: 100%;
    height: fit-content;
    padding: 0px 20px;
    .artist {
      font-size: 12px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  .buttons {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
  }

  ion-icon {
    font-size: 30px;
    padding: 0 5px;
    &.play-pause {
      font-size: 40px;
    }
  }
}

@keyframes rotatebg {
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
