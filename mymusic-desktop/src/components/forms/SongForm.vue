<script setup lang="ts">
import { defineProps, computed, reactive, watch, ref } from 'vue'
import { useTags } from 'mymusic-services'
import { useStore, ISong } from 'mymusic-services'

const store = useStore()

const props = defineProps<{
  song: ISong
}>()

const formData = reactive({
  id: props.song.id,
  title: props.song.title,
  artist: props.song.artist,
  cover: props.song.cover,
  lyrics: props.song.lyrics,
})

watch(props, () => {
  formData.id = props.song.id
  formData.title = props.song.title
  formData.artist = props.song.artist
  formData.cover = props.song.cover
  formData.lyrics = props.song.lyrics
})

const second = ref('0')
const strophe = ref('')

const lyricsArr = computed(() => {
  let arr = Object.keys(JSON.parse(formData.lyrics))
    .map((x) => x.substring(1))
    .sort((a, b) => +a - +b)
    .map((x) => 's' + x)

  return arr
})

const addLyricsRow = () => {
  let lyrics = JSON.parse(formData.lyrics)
  lyrics[`s${second.value}`] = strophe.value
  formData.lyrics = JSON.stringify(lyrics)

  strophe.value = ''
  second.value = '0'
}

const prettyLyric = (key: string) => {
  return {
    second: key.substring(1),
    content: JSON.parse(props.song.lyrics)[key],
  }
}

const updateLyric = (key: any) => {
  const x = prettyLyric(key)
  strophe.value = x.content
  second.value = x.second
}

const removeLyric = (lyric: string) => {
  const lyricsObj = JSON.parse(formData.lyrics)
  delete lyricsObj[lyric]
  formData.lyrics = JSON.stringify(lyricsObj)
}
</script>

<style lang="scss" scoped>
#SongForm {
  .close {
    position: absolute;
    transition: 0.3s ease;
    cursor: pointer;
    height: 25px;
    margin-top: 10px;
    right: 20px;
    filter: invert(1);

    &:hover {
      transition: 0.3s ease;
      transform: rotate(90deg);
    }
  }

  .top-section {
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 20px;
    margin: 30px 0;

    .cover {
      width: 100%;
      height: 250px;
      border-radius: 5px;
      background-color: black;
      background-size: cover;
      background-position: center;
    }

    .update-buttons {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 20px;
      .button-85 {
        margin: 0;
        width: 100%;

        &:nth-child(1) {
          height: 100%;
          margin-bottom: 50px;
          font-size: 25px;
        }
      }
    }
  }

  h2 {
    margin-top: 30px;
    margin-bottom: 0;
    background: $gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lyrics-creator {
    .button-85 {
      width: 100% !important;
      margin-right: 0 !important;
    }

    textarea {
      transition: 0.3s ease;
      width: calc(100% - 20px);
      margin-top: 20px;
      outline: none;
      background: $gradient;
      border-radius: 5px;
      border: 0;
      color: white;
      font-size: 18px;
      padding: 10px;

      &:focus {
        transition: 0.3s ease;
        box-shadow: inset 0 0 10px 2px black;
      }
    }

    .lyric-item {
      display: grid;
      grid-template-columns: 25px 1fr 25px;
      cursor: pointer;

      padding: 5px;
      margin: 10px 0;
      border-radius: 5px;
      background: $colorLightViolet;
      color: $colorDarkViolet;
      gap: 5px;
      align-items: center;

      span:nth-child(2) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      img {
        height: 20px;
      }
    }
  }
}
</style>

<template>
  <div id="SongForm">
    <img class="close" @click="$emit('close')" src="@/assets/icons/close.svg" />
    <h1>Edit song</h1>

    <div class="top-section">
      <div
        class="cover"
        :style="{
          backgroundImage: `url(${formData.cover})`,
        }"
      />
      <div class="update-buttons">
        <button
          class="button-85"
          @click="
            () => {
              $emit('close')
              store.updateSong(formData)
            }
          "
        >
          🟢 Update
        </button>
        <button
          class="button-85"
          style="opacity: 0.5"
          @click="
            () => {
              $emit('close')
              store.deleteSong(formData.id)
            }
          "
          color="danger"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="inputs">
      <div class="form__group field">
        <input
          type="input"
          class="form__field"
          placeholder="Title"
          name="title"
          id="title"
          v-model="formData.title"
        />
        <label for="title" class="form__label">Title</label>
      </div>

      <div class="form__group field">
        <input
          type="input"
          class="form__field"
          placeholder="Artist"
          name="artist"
          id="artist"
          v-model="formData.artist"
        />
        <label for="artist" class="form__label">Artist</label>
      </div>
    </div>
    <div class="cover-text">
      <div class="form__group field">
        <input
          type="input"
          class="form__field"
          placeholder="Cover"
          name="cover"
          id="cover"
          v-model="formData.cover"
        />
        <label for="cover" class="form__label">Cover</label>
      </div>
    </div>

    <h2>Lyrics creator</h2>

    <div class="lyrics-creator">
      <div style="display: flex; flex: 1">
        <div class="form__group field">
          <input
            type="number"
            class="form__field"
            name="second"
            id="second"
            v-model="second"
          />
          <label for="second" class="form__label">Second</label>
        </div>

        <button class="button-85" @click="addLyricsRow">Add</button>
      </div>

      <textarea cols="30" rows="10" v-model="strophe" />

      <div class="lyric-item" v-for="(lyric, index) in lyricsArr" :key="index">
        <span @click="updateLyric(lyric)">
          {{ prettyLyric(lyric).second }}
        </span>
        <span @click="updateLyric(lyric)">
          {{ prettyLyric(lyric).content }}
        </span>
        <img src="@/assets/icons/close.svg" @click="removeLyric(lyric)" />
      </div>
    </div>
  </div>
</template>
