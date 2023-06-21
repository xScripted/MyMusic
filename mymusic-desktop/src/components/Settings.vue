<script setup lang="ts">
import { inject } from 'vue'
import {
  usePlayer,
  useStore,
  storage,
  utils,
  useSettings,
} from 'mymusic-services'

const emitter: any = inject('emitter')

const store = useStore()
const { onlyNewSongs } = useSettings()
const { updateRate } = usePlayer(emitter)

const uploadSongs = (event: any) => {
  let reader = new FileReader()

  reader.readAsText(event.target.files[0])

  reader.onload = function () {
    let songs = JSON.parse(reader.result as string)
    songs = onlyNewSongs(songs)
    store.storeSongs(songs)
    storage.setSongs(songs)
  }

  reader.onerror = function () {
    console.error(reader.error)
  }
}

const uploadTags = (event: any) => {
  let reader = new FileReader()

  reader.readAsText(event.target.files[0])

  reader.onload = function () {
    let tags = JSON.parse(reader.result as string)
    tags = onlyNewSongs(tags)
    store.storeTags(tags)
    storage.setTags(tags)
  }

  reader.onerror = function () {
    console.error(reader.error)
  }
}
</script>

<style lang="scss" scoped>
#Settings {
  input {
    width: 100%;
  }

  .dj-mode {
    display: flex;

    .form__group:after {
      position: absolute;
      right: 20px;
      top: 30px;
      content: '%';
    }
  }

  .exports-imports {
    display: grid;
    grid-template-columns: 50% 50%;
  }

  h3,
  .exports-imports {
    margin-top: 35px;
    margin-bottom: 5px;
  }
}
</style>

<template>
  <div id="Settings">
    <h1>Settings</h1>

    <div class="cores">
      <h3>Nightcore {{ store.settings.nightcore }}%</h3>
      <input
        v-model="store.settings.nightcore"
        @input="
          () => {
            updateRate()
            storage.setSettings(store.settings)
          }
        "
        type="range"
        min="1"
        max="100"
      />
      <h3>Lowcore {{ store.settings.lowcore }}%</h3>
      <input
        v-model="store.settings.lowcore"
        @input="
          () => {
            updateRate()
            storage.setSettings(store.settings)
          }
        "
        type="range"
        min="1"
        max="50"
      />
    </div>

    <h3>DJ Mode 😎</h3>
    <div class="dj-mode">
      <div class="form__group field">
        <input
          v-model="store.settings.songStarts"
          @input="storage.setSettings(store.settings)"
          type="number"
          min="0"
          max="100"
          class="form__field"
          name="name"
        />
        <label for="name" class="form__label">Song starts at:</label>
      </div>

      <div class="form__group field">
        <input
          v-model="store.settings.songEnds"
          @input="storage.setSettings(store.settings)"
          type="number"
          min="0"
          max="100"
          class="form__field"
          name="name"
        />
        <label for="name" class="form__label">Song ends at:</label>
      </div>
    </div>

    <div class="mix-mode">
      <h3>MIX Mode 🧬</h3>
      <div class="form__group field">
        <input
          class="form__field"
          name="name"
          v-model="store.settings.mixMode"
          @input="storage.setSettings(store.settings)"
          type="number"
          min="0"
          max="100"
        />
        <label for="name" class="form__label">Delay in seconds</label>
      </div>
    </div>

    <div class="exports-imports">
      <button
        class="button-85"
        @click="
          utils.onDownload(store.songs, `songs-${store.songs.length}.json`)
        "
      >
        🎵 Export Songs
      </button>
      <button
        class="button-85"
        @click="utils.onDownload(store.tags, `tags-${store.tags.length}.json`)"
      >
        📚 Export Tags
      </button>

      <button
        class="button-85"
        onclick="document.getElementById('getFileSongs').click()"
      >
        🎵 Import Songs
      </button>

      <input
        type="file"
        id="getFileSongs"
        @input="uploadSongs"
        style="display: none"
      />

      <button
        class="button-85"
        onclick="document.getElementById('getFileTags').click()"
      >
        📚 Import Tags
      </button>

      <input
        type="file"
        id="getFileTags"
        @input="uploadTags"
        style="display: none"
      />
    </div>
  </div>
</template>
