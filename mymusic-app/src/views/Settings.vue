<script lang="ts">
import { IonContent, IonIcon, IonButton } from '@ionic/vue'
import { add } from 'ionicons/icons'
import { defineComponent, inject } from 'vue'

import { v4 as uuid } from 'uuid'
import { FilePicker } from '@capawesome/capacitor-file-picker'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import {
  useStore,
  useSettings,
  storage,
  ISong,
  ITag,
  isTag,
  isSong,
} from 'mymusic-services'

export default defineComponent({
  components: {
    IonContent,
    IonIcon,
    IonButton,
  },
  setup() {
    const emitter: any = inject('emitter')

    const store = useStore()
    const { splitNames, onlyNewSongs } = useSettings()

    const addSongs = async () => {
      try {
        const result = await FilePicker.pickFiles({
          types: ['audio/*'],
          multiple: true,
          readData: false,
        })

        let songs: ISong[] = []

        result.files.map((file: any) => {
          let names = splitNames(file.name)

          songs.push({
            id: 'song-' + uuid(),
            title: names.title,
            artist: names.artist,
            path: file.name,
            selected: false,
            tags: [],
            cover: '',
            lyrics: '',
            date: new Date(),
          })
        })

        songs = onlyNewSongs(songs)

        store.storeSongs(songs)
        await storage.setSongs(store.songs)
        emitter.emit('show-alert', `🎉 ${songs.length} songs imported!`)
      } catch (err) {
        console.error('Error: ' + err)
      }
    }

    const uploadSongs = (event: any) => {
      let reader = new FileReader()

      reader.readAsText(event.target.files[0])

      reader.onload = function () {
        let songs = JSON.parse(reader.result as string)
        songs = onlyNewSongs(songs)
        store.storeSongs(songs)
        storage.setSongs(songs)
      }

      emitter.emit('show-alert', `🎉 Songs imported!`)

      reader.onerror = function () {
        emitter.emit('show-alert', `⛔ This json is not ISong[]`)
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
        emitter.emit('show-alert', `🎉 Tags imported!`)
      }

      reader.onerror = function () {
        console.error(reader.error)
        emitter.emit('show-alert', `⛔ This json is not ITag[]`)
      }
    }

    const writeSecretFile = async (data: any, name: string) => {
      await Filesystem.writeFile({
        path: name + '.json',
        data: JSON.stringify(data),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
      emitter.emit('show-alert', `Saved on Documents: <br>${name}.json`)
    }

    return {
      add,
      addSongs,
      store,
      emitter,
      writeSecretFile,
      uploadSongs,
      uploadTags,
      storage,
    }
  },
})
</script>

<template>
  <ion-content>
    <div id="MSettings">
      <ion-button class="add-songs" color="primary" @click="addSongs">
        <ion-icon :icon="add" />
        <span> Add songs </span>
      </ion-button>

      <input
        v-model="store.settings.folderPath"
        @input="storage.setSettings(store.settings)"
        class="folder-path"
        type="text"
        placeholder="📂 Folder path"
      />

      <div class="cores">
        <h3>Nightcore {{ store.settings.nightcore }}%</h3>
        <input
          v-model="store.settings.nightcore"
          @input="
            () => {
              emitter.emit('updateRate')
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
              emitter.emit('updateRate')
              storage.setSettings(store.settings)
            }
          "
          type="range"
          min="1"
          max="50"
        />
      </div>

      <div class="dj-mode">
        <h3>DJ Mode 😎</h3>
        <div>
          Song starts at:
          <input
            v-model="store.settings.songStarts"
            @input="storage.setSettings(store.settings)"
            type="number"
            min="0"
            max="100"
          />
          %
        </div>
        <div>
          Song ends at:
          <input
            v-model="store.settings.songEnds"
            @input="storage.setSettings(store.settings)"
            type="number"
            min="0"
            max="100"
          />
          %
        </div>
      </div>

      <div class="mix-mode">
        <h3>MIX Mode 🧬</h3>
        <div>
          Delay:
          <input
            v-model="store.settings.mixMode"
            @input="storage.setSettings(store.settings)"
            type="number"
            min="0"
            max="100"
          />
          seconds
        </div>
      </div>

      <div class="exports-imports">
        <ion-button
          class="export-songs"
          color="primary"
          @click="writeSecretFile(store.songs, store.songs.length + '-songs')"
        >
          🎵 Export Songs
        </ion-button>
        <ion-button
          class="export-tags"
          color="primary"
          @click="writeSecretFile(store.tags, store.tags.length + '-tags')"
        >
          📚 Export Tags
        </ion-button>
        <ion-button
          id="import-songs"
          color="primary"
          onclick="document.getElementById('getFileSongs').click()"
        >
          🎵 Import Songs
        </ion-button>
        <ion-button
          id="import-tags"
          color="primary"
          onclick="document.getElementById('getFileTags').click()"
        >
          📚 Import Tags
        </ion-button>

        <input
          type="file"
          id="getFileSongs"
          @input="uploadSongs"
          style="display: none"
        />

        <input
          type="file"
          id="getFileTags"
          @input="uploadTags"
          style="display: none"
        />
      </div>

      <p>Version 1.0</p>
    </div>
  </ion-content>
</template>

<style lang="scss">
ion-content {
  --ion-background-color: rgb(24, 0, 51);
  * {
    color: white;
  }
}

#MSettings {
  padding: 20px;
  height: fit-content;

  h3 {
    margin-top: 20px !important;
  }

  input[type='number'] {
    padding: 5px;
    width: 50px;
  }

  input[type='range'] {
    width: 80%;
  }

  .add-songs {
    width: 100%;
    height: 40px;
  }

  .cores {
    text-align: center;
  }

  .folder-path {
    padding: 10px;
    width: 100%;
    margin: 5px 0;
  }

  .exports-imports {
    margin-top: 10px;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 1fr 1fr;
  }

  .dj-mode,
  .mix-mode {
    text-align: center;
    div {
      padding: 10px;
    }
  }
}
</style>
