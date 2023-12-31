<script lang="ts">
import {
  playCircle,
  pauseCircle,
  chevronForward,
  chevronBack,
  shuffle,
  reload,
  disc,
  rainy,
  sparkles,
  volumeOff,
  volumeHigh,
} from 'ionicons/icons'
import { defineComponent, inject, ref } from 'vue'

import { Howler as howler } from 'howler'
import { IonIcon, IonContent } from '@ionic/vue'
import { usePlayer, useStore, ITag } from 'mymusic-services'

export default defineComponent({
  components: {
    IonIcon,
    IonContent,
  },
  setup() {
    const emitter: any = inject('emitter')
    const store = useStore()
    const {
      next,
      before,
      switchLowcore,
      switchNightcore,
      switchBucle,
      switchShuffle,
      play,
      pause,
    } = usePlayer(emitter)

    const coverFlip = ref(false)

    // Refactor this
    const Howler: any = howler

    const selectSongMoment = (ev: any) => {
      if (Howler._howls.length > 0) {
        const songMoment =
          ((ev.touches[0].clientX / window.innerWidth) *
            100 *
            Howler._howls[0].duration()) /
          100
        Howler._howls[0].seek(songMoment)
      }
    }

    return {
      playCircle,
      pauseCircle,
      chevronForward,
      chevronBack,
      shuffle,
      reload,
      disc,
      rainy,
      sparkles,
      volumeOff,
      volumeHigh,
      store,
      emitter,
      switchNightcore,
      switchLowcore,
      switchBucle,
      switchShuffle,
      selectSongMoment,
      coverFlip,
    }
  },
})
</script>

<template>
  <ion-content>
    <div id="store" :class="{ animated: store.playing }">
      <div class="extra-bar">
        <ion-icon
          @click="switchLowcore"
          class="lowcore"
          :class="{ activated: store.isLowcore }"
          :icon="rainy"
        />
        <ion-icon
          class="dj-mode"
          @click="store.isDJMode = !store.isDJMode"
          :class="{ activated: store.isDJMode }"
          :icon="disc"
        />
        <ion-icon
          @click="switchNightcore"
          class="nightcore"
          :class="{ activated: store.isNightcore }"
          :icon="sparkles"
        />
      </div>

      <div
        class="flip-card"
        :class="{ 'flip-card-hover': coverFlip }"
        @click="coverFlip = !coverFlip"
      >
        <div class="flip-card-inner">
          <div
            class="flip-card-front"
            :style="{ backgroundImage: `url(${store.currentSong?.cover})` }"
          />
          <div class="flip-card-back">
            <div
              v-for="tagId in store.currentSong?.tags"
              class="tag"
              :style="{
                background: store.findTag(tagId)?.bgColor,
                color: store.findTag(tagId)?.textColor,
              }"
              :key="tagId"
            >
              {{ store.findTag(tagId)?.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="song-data">
        <div class="title">
          {{ store.currentSong?.title }}
        </div>
        <div class="artist">{{ store.currentSong?.artist }}</div>
      </div>

      <div class="progress-bar-container" @touchmove="selectSongMoment($event)">
        <div class="progress-bar">
          <div class="filled" :style="{ width: store.dynamicWidth }" />
        </div>
      </div>

      <div class="player-bar">
        <ion-icon
          @click="switchShuffle"
          :class="{ activated: store.isShuffle }"
          :icon="shuffle"
        />
        <ion-icon @click="emitter.emit('before')" :icon="chevronBack" />
        <ion-icon
          v-if="!store.playing"
          @click="emitter.emit('play')"
          class="play-pause"
          :icon="playCircle"
        />
        <ion-icon
          v-else
          @click="emitter.emit('pause')"
          class="play-pause"
          :icon="pauseCircle"
        />
        <ion-icon @click="emitter.emit('next')" :icon="chevronForward" />
        <ion-icon
          @click="switchBucle"
          :class="{ activated: store.isBucle }"
          :icon="reload"
        />
      </div>

      <div
        class="bg-blur-cover"
        :style="`background-image: url(${store.currentSong?.cover})`"
      />
    </div>
  </ion-content>
</template>

<style lang="scss" scoped>
.bg-blur-cover {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
  opacity: 0.3;
  filter: blur(5px);
  background-position: center;
  background-size: cover;
}

#store {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9;
  height: 100%;
  display: grid;
  grid-template-rows: 100px 1fr 50px 40px 120px;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    214deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 20%,
    rgba(255, 0, 206, 1) 100%
  );
  background-size: 200% 200%;

  &.animated {
    animation: rotatebg 3s ease infinite;
  }

  ion-icon {
    color: white;

    &.activated {
      background-color: rgba(255, 255, 255, 0.8);
      color: black;
      border-radius: 100%;
    }
  }

  .extra-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 30px;

    ion-icon {
      padding: 15px;
    }
  }

  .song-data {
    width: 100%;
    margin: auto;
    text-align: center;

    .title {
      color: white;
      font-size: 20px;
    }
    .artist {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  .progress-bar-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    .progress-bar {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 80%;
      height: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      overflow: hidden;

      .filled {
        position: absolute;
        height: 100%;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .player-bar {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;

    ion-icon {
      font-size: 40px;
      padding: 7px;
    }

    .play-pause {
      font-size: 90px;
    }
  }
}

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 100%;
  height: 100%;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
  padding: 10px 30px;
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card-hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  overflow: hidden;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.8);
}
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.8);

  .tag {
    min-height: 30px;
    height: 30px;
  }
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

/* Style the back side */
.flip-card-back {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  transform: rotateY(180deg);
  border-radius: 10px;
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
