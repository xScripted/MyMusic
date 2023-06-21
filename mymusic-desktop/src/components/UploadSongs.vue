<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { useSettings, useStore, ISong, storage } from 'mymusic-services'

const { onlyNewSongs, splitNames } = useSettings()
const store = useStore()

const uploadSongs = async () => {
  const options = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'MP3', extensions: ['mp3'] }],
  }

  const songFiles = await ipcRenderer.invoke('showDialog', options)

  let songs: ISong[] = []

  songFiles.filePaths.map((file: any) => {
    const { title, artist } = splitNames(file)

    songs.push({
      id: title + artist,
      title,
      artist,
      path: file,
      selected: false,
      tags: [],
      lyrics: '{}',
      cover: '',
      date: new Date(),
    })
  })

  songs = onlyNewSongs(songs)
  store.storeSongs(songs)
  storage.setSongs(store.songs)
}
</script>

<style lang="scss" scoped>
.upload {
  transition: 0.3s ease;
  position: absolute;
  filter: invert(1);
  width: 25px;
  height: 25px;
  bottom: $playerHeight;
  padding: 15px;
  transform: translateY(0px);
  cursor: pointer;

  &:hover {
    transition: 0.3s ease;
    transform: translateY(-10px);
  }
}
</style>

<template>
  <img
    class="upload"
    @click="uploadSongs"
    src="@/assets/icons/cloud-upload.svg"
  />
</template>
