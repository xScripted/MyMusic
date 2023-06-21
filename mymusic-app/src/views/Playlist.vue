<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  Ref,
  onMounted,
  watchEffect,
  reactive,
} from 'vue'

import { add, close, brush } from 'ionicons/icons'
import { IonIcon, IonButton } from '@ionic/vue'
import { useStore, usePlaylist, ISong } from 'mymusic-services'
import { Capacitor } from '@capacitor/core'

export default defineComponent({
  components: {
    IonIcon,
    IonButton,
  },
  setup() {
    const emitter: any = inject('emitter')
    const playlist = usePlaylist(emitter)
    const store = useStore()
    const isForm = ref(false)

    const pagedSongs: Ref<ISong[]> = ref([])
    let page = 1

    onMounted(() => {
      pagedSongs.value = playlist.askMoreSongs()
      const divContainer = document.getElementById('MPlaylist')
      const offset = 20
      divContainer?.addEventListener('scroll', () => {
        if (
          divContainer.offsetHeight + divContainer.scrollTop + offset >=
          divContainer.scrollHeight
        ) {
          ++page
          pagedSongs.value = playlist.askMoreSongs()
        }
      })
    })

    watchEffect(() => {
      page = 1
      pagedSongs.value = playlist.askMoreSongs()
    })

    let div: any
    let size = 0
    let dy = 0
    let isDone = false
    const setSwipe = (ev: any) => {
      dy = ev.touches[0].clientY
      div = ev.target
      while (!div?.classList.contains('song')) div = div.parentNode
    }

    const swipeRight = (ev: any) => {
      const dy2 = ev.touches[0].clientY
      if (dy2 > dy - 20 && dy2 < dy + 20) {
        if (size === 40) {
          isDone = true
        } else {
          size = size + 2
          div.children[0].children[0].style.width = size + 'px'
        }
      }
    }

    const resetSwipe = (ev: Event, song: ISong) => {
      div.children[0].children[0].style.width = 0
      div = null
      size = 0
      if (isDone) {
        if (store.modeBuilder) {
          isForm.value = true
          formData.id = song.id
          formData.title = song.title
          formData.artist = song.artist
          formData.cover = song.cover
          isDone = false
        } else {
          store.addSongToQueue(song)
          emitter.emit('show-alert', `📣 ${song.title} - added to queue!`)
          isDone = false
        }
      }
    }

    const formData = reactive({
      id: '',
      title: '',
      artist: '',
      cover: '',
    })

    const handleClickSong = (song: ISong, index: number) => {
      /*const hasPath = song.path?.match(/\//g)
      if (!hasPath) {
        song.path = Capacitor.convertFileSrc(
          store.settings.folderPath + song.path
        )
      }*/
      playlist.clickSong(song, index)
    }

    return {
      store,
      emitter,
      playlist,
      handleClickSong,
      pagedSongs,
      swipeRight,
      resetSwipe,
      setSwipe,
      add,
      close,
      brush,
      isForm,
      formData,
    }
  },
})
</script>

<template>
  <div
    id="MPlaylist"
    :style="isForm ? `background-image: url(${formData.cover})` : ''"
  >
    <div v-if="isForm" class="edit-song-form">
      <ion-icon class="close-form" @click="isForm = false" :icon="close" />
      <div class="input-group">
        <label for="tag-name"> Title </label>
        <input id="tag-name" v-model="formData.title" type="text" />
      </div>
      <div class="input-group">
        <label for="tag-text-color"> Artist </label>
        <input id="tag-text-color" v-model="formData.artist" type="text" />
      </div>
      <div class="input-group">
        <label for="tag-grad1"> Cover </label>
        <input id="tag-grad1" v-model="formData.cover" type="text" />
      </div>
      <div class="update-buttons">
        <ion-button @click="store.updateSong(formData)"> Update </ion-button>
        <ion-button @click="store.deleteSong(formData.id)" color="danger">
          Delete
        </ion-button>
      </div>
    </div>

    <div
      v-else
      v-for="(song, index) in pagedSongs"
      :key="song.id"
      @click="() => handleClickSong(song, index)"
      @touchstart="setSwipe"
      @touchmove="swipeRight"
      @touchend="resetSwipe($event, song)"
      lines="none"
      class="song"
      :class="{ selected: song.selected }"
    >
      <div class="song-left">
        <div class="swipe-banner">
          <ion-icon v-if="store.modeBuilder" :icon="brush" />
          <ion-icon v-else :icon="add" />
        </div>
        <div
          class="cover"
          :style="'background-image: url(' + song.cover + ');'"
        ></div>
        <div>
          <div class="title">{{ song.title }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
      </div>
      <div class="song-tag-balls">
        <div
          v-for="tagId in song.tags"
          :key="tagId"
          class="tag-ball"
          :style="{ background: store.findTag(tagId)?.bgColor }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#MPlaylist {
  background-size: cover;
  background-position: center;
  background-color: rgb(24, 0, 51);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;

  .song {
    display: grid;
    grid-template-columns: 5fr 3fr;

    margin-bottom: 5px;
    width: 100%;

    .song-left {
      display: flex;
      flex: 1;
      .swipe-banner {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-image: -webkit-linear-gradient(
          214deg,
          rgb(25, 0, 255),
          rgba(255, 0, 206, 1)
        );
        height: 100%;
        width: 0;

        ion-icon {
          position: absolute;
          font-size: 20px;
        }
      }

      .cover {
        width: 50px;
        height: 50px;
        min-width: 50px;
        background-size: cover;
        background-position: center;
        border-radius: 5px;
        border: 2px solid black;
        margin-left: 5px;
      }

      .title {
        padding: 5px;
        padding-left: 10px;
        font-size: 14px;
        color: white;
        text-align: left;
      }
      .artist {
        font-size: 12px;
        color: rgb(205, 167, 255);
        padding: 5px;
        padding-left: 10px;
        padding-top: 0px;
        text-align: left;
      }
    }

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
    .song-tag-balls {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      justify-content: right;
      align-items: center;
      padding: 5px;
      .tag-ball {
        width: 12px;
        height: 12px;
        margin: 2px;
        border-radius: 100%;
      }
    }
  }

  .edit-song-form {
    display: grid;
    padding: 10px;

    .close-form {
      height: 50px;
      display: inline-flex;
      justify-self: end;
      font-size: 25px;
    }

    .input-group {
      display: flex;
      flex-direction: column;

      label {
        padding: 10px 0;
        text-align: center;
      }

      input {
        border-radius: 5px;
        width: 100%;
        color: black;
      }

      input[type='text'] {
        padding: 10px;
      }

      input[type='color'] {
        width: 100%;
        height: 40px;
      }
    }

    .update-buttons {
      display: flex;
      flex-direction: column;

      ion-button {
        height: 50px;
        margin-top: 20px;
      }
    }
  }
}
</style>
