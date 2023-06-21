<script setup lang="ts">
import { provide, ref, onMounted } from 'vue'
import mitt from 'mitt'
import Player from '@/components/Player.vue'
import Header from '@/components/Header.vue'
import Playlist from '@/components/Playlist.vue'
import Tags from '@/components/Tags.vue'
import RightMenu from '@/components/RightMenu.vue'
import UploadSongs from '@/components/UploadSongs.vue'
import Volume from '@/components/Volume.vue'
import Message from '@/components/Message.vue'
import { utils, ISong } from 'mymusic-services'

const emitter = mitt()
const stateRightMenu = ref('')
const editSong = ref({})

onMounted(() => utils.loadData())

// Providers
provide('emitter', emitter)

const updateMenuHeader = (value: string) => (stateRightMenu.value = value)

const updateMenuPlaylist = (song: ISong) => (
  (editSong.value = song), (stateRightMenu.value = 'songForm')
)
</script>

<style scoped lang="scss">
.content {
  display: flex;
  height: calc(100vh - $headerHeight - $playerHeight);
  flex: 1;

  .left-menu {
    padding: 10px;
    height: 100%;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    background-color: $colorDarkGrey;
    box-sizing: border-box;
  }
}
</style>

<template>
  <Message />
  <Header
    :stateRightMenu="stateRightMenu"
    @state-right-menu="updateMenuHeader"
  />

  <div class="content">
    <div class="left-menu">
      <Tags />
      <Volume />
    </div>
    <Playlist @state-right-menu="updateMenuPlaylist" />
    <RightMenu
      :stateRightMenu="stateRightMenu"
      :editSong="editSong"
      @close="stateRightMenu = ''"
    />
  </div>
  <UploadSongs />
  <Player />
</template>
