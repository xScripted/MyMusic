<script setup lang="ts">
import { useStore } from 'mymusic-services'

const store = useStore()
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
}

.searcher {
  display: flex;
  align-items: flex-end;
  margin: 20px 0;

  .trash {
    filter: invert(1);
    width: 25px;
    margin: 0 10px;
    cursor: pointer;
  }
  margin-bottom: 30px;
}

.orders,
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 30px;
}

.button-85 {
  margin-left: 0;
  font-size: 12px;
}
</style>

<template>
  <div class="playlist-modifiers">
    <h1>Search & Order</h1>
    <div class="searcher">
      <div class="form__group field">
        <input
          type="input"
          class="form__field"
          placeholder="Name"
          name="name"
          id="name"
          autofocus
          v-model="store.filterText"
          @input="store.filterSongs()"
        />
        <label for="name" class="form__label">Searcher</label>
      </div>
      <img
        class="trash"
        @click="store.clearAll()"
        src="@/assets/icons/trash.svg"
      />
    </div>
    <span>Order</span>
    <div class="orders">
      <button
        class="button-85"
        @click="
          () => {
            store.orderBy.artist = store.orderNext(store.orderBy.artist)
            store.orderByType('artist')
          }
        "
      >
        👨‍🎤 ARTIST
      </button>
      <button
        class="button-85"
        @click="
          () => {
            store.orderBy.title = store.orderNext(store.orderBy.title)
            store.orderByType('title')
          }
        "
      >
        🎼 TITLE
      </button>
      <button
        class="button-85"
        @click="
          () => {
            store.orderBy.date = store.orderNext(store.orderBy.date)
            store.orderByType('date')
          }
        "
      >
        📆 DATE
      </button>
      <button class="button-85" @click="store.shuffleSongs()">
        🎶 SHUFFLE
      </button>
    </div>
    <span>Filter</span>
    <div class="filters">
      <button
        class="button-85"
        @click="
          () => {
            store.withLyrics = store.withLyricsNext(store.withLyrics, 'LYRICS')
            store.filterSongs()
          }
        "
      >
        🎤 {{ store.withLyrics }}
      </button>
      <button
        class="button-85"
        @click="
          () => {
            store.withCover = store.withCoverNext(store.withCover, 'COVER')
            store.filterSongs()
          }
        "
      >
        🌆 {{ store.withCover }}
      </button>
      <button
        class="button-85"
        @click=";(store.isRepre = !store.isRepre), store.filterSongs()"
        style="grid-column: 1 / 3"
      >
        📢 REPRESENTATION
      </button>
    </div>
  </div>
</template>
