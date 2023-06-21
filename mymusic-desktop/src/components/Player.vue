<script setup lang="ts">
import { ref, inject } from 'vue'
import { usePlayer, useStore, utils } from 'mymusic-services'
import { Howler as h } from 'howler'

const emitter: any = inject('emitter')

const Howler: any = h // Refactor this

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
const store = useStore()

const selectSongMoment = ($event: any) => {
  const percent = ($event.offsetX / $event.target.offsetWidth) * 100
  const songMoment = (percent * Howler._howls[0].duration()) / 100

  Howler._howls[0].seek(songMoment)
}

const currentLyric = ref('')
const fade = ref(false)

emitter.on('lyric', (lyric: string) => {
  currentLyric.value = lyric
  fade.value = true

  setTimeout(() => (fade.value = false), 1000)
})

const expanded = ref(false)
</script>

<style lang="scss" scoped>
#Player {
  $coverWidth: 100px;

  position: absolute;
  width: 100%;
  height: $playerHeight;
  bottom: 0;
  background: $gradient;
  border-top: 2px solid black;
  overflow: hidden;
  z-index: 9;

  &.expanded {
    transition: 0.5s ease-in-out;
    height: 100%;

    animation-name: op;
    animation-duration: 0.5s;

    .names {
      top: 10%;
      right: 5%;
      font-size: 36px;

      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      gap: 20px;

      .artist {
        font-size: 36px;
      }
    }

    .song-tags {
      display: flex;
      gap: 10px;

      .tag {
        width: fit-content;
        padding: 5px 20px;
      }
    }

    .cover {
      top: 10%;
      left: 5%;
      width: 70vh;
      height: 70vh;
      border-radius: 10px;
      box-shadow: 0 0 3px 1px black;
    }

    .lyrics {
      display: block;
      position: absolute;
      top: 25%;
      left: 45%;
      width: 50%;
      height: 60vh;
      font-size: 35px;
      line-height: 70px;
      text-shadow: 3px 5px 8px #000000;
      text-align: center;
    }

    .bg-blur-cover {
      position: absolute;
      height: 100%;
      width: 100%;
      opacity: 0.3;
      filter: blur(5px);
      background-position: center;
      background-size: cover;
    }

    .progress-bar-container {
      width: 90%;
      right: 0;
      left: 0;
      margin: auto;
    }

    .tags {
      position: absolute;
      right: 5%;
      top: 76vh;
      width: calc(90% - 70vh - 20px);
      height: 60px;
    }

    .dj-mode {
      right: 5%;
    }
  }

  // ----------------------------

  .lyrics {
    display: none;
  }

  .progress-bar-container {
    position: absolute;
    bottom: 55px;
    right: 20px;
    width: calc(100% - $coverWidth - 40px);
    height: 10px;
    padding: 18px 0;

    .progress-bar {
      position: absolute;
      width: 100%;
      height: 10px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
      margin: auto;
      overflow: hidden;
      cursor: pointer;
    }
    .filled {
      position: absolute;
      width: 0%;
      height: 10px;
      border-radius: 3px;
      background: $colorLightGrey;
      z-index: -1;
    }
  }

  .names {
    position: absolute;
    font-weight: bold;
    font-size: 20px;

    top: 40px;
    left: $coverWidth + 20px;

    .artist {
      color: $colorLightViolet;
      font-size: 16px;
    }
  }

  .cover {
    position: absolute;
    cursor: pointer;
    width: $coverWidth;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    background-size: cover;
    background-position: center;
  }

  .tool-box {
    display: flex;
    align-items: center;
    width: fit-content;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    gap: 15px;
    user-select: none;

    .timer {
      margin: 0 20px;
      width: 40px;
      text-align: center;
    }
  }

  .icon {
    cursor: pointer;
    width: 25px;
    height: 25px;
    padding: 10px;
    margin: 0px 5px;
    filter: invert(1);
    background: none;

    &.play-pause {
      width: 50px;
      height: 50px;
    }
  }

  button {
    cursor: pointer;
    background: none;
    padding: 0;
    border: 0;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.button-85 {
      padding: 0;
      margin: 0;

      &:after,
      &:before {
        border-radius: 100% !important;
      }
    }
  }

  .dj-mode {
    position: absolute;
    right: 15px;
    bottom: 15px;
  }

  .fade {
    animation: fade 1s;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

@keyframes op {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<template>
  <div id="Player" :class="{ expanded }">
    <div
      class="bg-blur-cover"
      :style="{
        backgroundImage: `url(${store.currentSong.cover})`,
      }"
    />
    <div
      class="cover"
      :style="{
        backgroundImage: `url(${store.currentSong.cover})`,
      }"
      @click="expanded = !expanded"
    />

    <div class="names">
      <div class="title">{{ store.currentSong?.title }}</div>
      <div class="artist">{{ store.currentSong?.artist }}</div>
    </div>

    <transition name="fade">
      <div class="lyrics" :class="{ fade }" v-html="currentLyric" />
    </transition>

    <div v-if="expanded" class="tags">
      <div class="song-tags">
        <div
          v-for="tag of store.currentSong.tags"
          class="tag"
          :style="{
            background: store.findTag(tag)?.bgColor,
            color: store.findTag(tag)?.textColor,
          }"
          :key="tag"
        >
          {{ store.findTag(tag)?.name }}
        </div>
      </div>
    </div>

    <div class="progress-bar-container" @click.stop="selectSongMoment($event)">
      <div class="progress-bar" />
      <div class="filled" :style="{ width: store.dynamicWidth }" />
    </div>

    <div class="tool-box">
      <div class="timer">{{ utils.formatTime(Howler._howls[0]?.seek()) }}</div>

      <button :class="{ 'button-85': store.isLowcore }">
        <img
          class="icon"
          @click="switchLowcore"
          :class="{ 'button-85': store.isLowcore }"
          src="@/assets/icons/rainy.svg"
        />
      </button>

      <button :class="{ 'button-85': store.isShuffle }">
        <img
          class="icon"
          @click="switchShuffle"
          :class="{ 'button-85': store.isShuffle }"
          src="@/assets/icons/shuffle.svg"
        />
      </button>
      <img
        class="icon"
        @click="before()"
        src="@/assets/icons/chevron-back.svg"
      />
      <img
        v-if="store.playing"
        class="icon play-pause"
        src="@/assets/icons/pause.svg"
        @click="pause()"
      />
      <img
        v-else
        class="icon play-pause"
        src="@/assets/icons/play-circle.svg"
        @click="play()"
      />
      <img
        class="icon"
        @click="next()"
        src="@/assets/icons/chevron-forward.svg"
      />

      <button :class="{ 'button-85': store.isBucle }">
        <img
          class="icon"
          @click="switchBucle"
          :class="{ 'button-85': store.isBucle }"
          src="@/assets/icons/reload.svg"
        />
      </button>

      <button :class="{ 'button-85': store.isNightcore }">
        <img
          class="icon"
          @click="switchNightcore"
          src="@/assets/icons/sparkles.svg"
        />
      </button>
      <div class="timer">
        {{ utils.formatTime(Howler._howls[0]?.duration()) }}
      </div>
    </div>

    <button class="dj-mode" :class="{ 'button-85': store.isDJMode }">
      <img
        class="icon"
        @click="store.isDJMode = !store.isDJMode"
        :class="{ 'button-85': store.isDJMode }"
        src="@/assets/icons/disc.svg"
      />
    </button>
  </div>
</template>
