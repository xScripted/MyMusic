<script setup lang="ts">
import { useStore, usePlaylist, ISong } from 'mymusic-services'
import { ref, Ref, onMounted, watchEffect, inject, defineEmits } from 'vue'

const emit = defineEmits(['state-right-menu'])
const emitter: any = inject('emitter')
const store = useStore()
const playlist = usePlaylist(emitter)
const pagedSongs: Ref<ISong[]> = ref([])

const formOrQueue = (song: ISong) => {
  if (store.modeBuilder) {
    emit('state-right-menu', song)
    return
  }
  store.addSongToQueue(song)
  emitter.emit('show-alert', song.title + ' 🎶 added to the Queue!')
}

onMounted(() => {
  const div = document.getElementById('Playlist')
  const offset = 20

  pagedSongs.value = playlist.askMoreSongs()

  div?.addEventListener('scroll', () => {
    const isScrollBottom =
      div.offsetHeight + div.scrollTop + offset >= div.scrollHeight
    if (isScrollBottom) {
      pagedSongs.value = playlist.askMoreSongs()
    }
  })
})

watchEffect(() => {
  store.songsFilter
  pagedSongs.value = playlist.askMoreSongs(true)
})
</script>

<style lang="scss" scoped>
#Playlist {
  position: relative;
  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: $colorDarkGrey;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $colorLightGrey;
    border-radius: 5px;
  }

  .song {
    cursor: pointer;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      background: $colorDarkGrey;
    }

    .left-side {
      display: flex;
      .cover {
        width: 50px;
        height: 50px;
        margin-right: 15px;
        background-color: rgba(0, 0, 0, 0.082);
        background-size: cover;
        background-position: center;
      }

      .artist {
        color: $colorLightViolet;
        font-size: 14px;
      }
    }

    .song-tags {
      display: flex;
      gap: 10px;
      margin-right: 20px;

      .tag {
        min-height: 10px;
        min-width: fit-content;
        padding: 10px;
        height: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <div id="Playlist">
    <div
      class="song"
      v-for="(song, index) in pagedSongs"
      :key="song.id"
      @click="playlist.clickSong(song, index)"
      @contextmenu="formOrQueue(song)"
      :class="{ selected: song.selected }"
    >
      <div class="left-side">
        <div
          class="cover"
          :style="'background-image: url(' + song.cover + ');'"
        ></div>
        <div>
          <div class="title">{{ song.title }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
      </div>
      <div class="song-tags">
        <div
          v-for="tag of song.tags"
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
  </div>
</template>
