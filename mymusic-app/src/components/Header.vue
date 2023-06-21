<script lang="ts">
import { IonIcon, IonButton } from '@ionic/vue'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'mymusic-services'

import {
  search,
  caretUp,
  trashOutline,
  brushOutline,
  brush,
} from 'ionicons/icons'

export default defineComponent({
  components: {
    IonIcon,
    IonButton,
  },

  setup() {
    const route = useRoute()
    const fullHeight = ref(false)
    const store = useStore()

    const isPlaylist = computed(() => route.name === 'Playlist')

    return {
      search,
      route,
      fullHeight,
      isPlaylist,
      store,
      caretUp,
      trashOutline,
      brushOutline,
      brush,
    }
  },
})
</script>

<template>
  <div
    id="MHeader"
    :class="{
      fullHeight: fullHeight && isPlaylist,
      builder: store.modeBuilder,
    }"
  >
    <div class="header">
      <router-link :to="{ name: 'Playlist' }">
        <div class="logo" :class="{ builder: store.modeBuilder }">
          <h1>
            MyMusic {{ store.songsFilter.length }}
            <span v-if="store.modeBuilder" style="font-style: italic">
              - Mode editor</span
            >
          </h1>
        </div>
      </router-link>
      <div style="display: flex; gap: 20px">
        <div
          @click="
            () => {
              store.modeBuilder = !store.modeBuilder
              store.filterSongs()
            }
          "
        >
          <ion-icon v-if="store.modeBuilder" :icon="brush" />
          <ion-icon v-else :icon="brushOutline" />
        </div>
        <div v-if="isPlaylist">
          <ion-icon @click="fullHeight = !fullHeight" :icon="search" />
        </div>
      </div>
    </div>
    <div class="header-content">
      <div class="playlist-buttons">
        <div class="searcher">
          <input
            type="text"
            v-model="store.filterText"
            @input="store.filterSongs()"
            placeholder="Search for a song..."
          />

          <ion-icon @click="store.clearAll" :icon="trashOutline" />
        </div>

        <div class="order-buttons">
          <ion-button @click="store.orderByType('title')">
            Title
            <ion-icon
              v-if="store.orderBy.title != 'NONE'"
              class="order-icon"
              :class="{ 'rotate-it': store.orderBy.title === 'DESC' }"
              :icon="caretUp"
            />
          </ion-button>

          <ion-button @click="store.orderByType('artist')">
            Artist
            <ion-icon
              v-if="store.orderBy.artist != 'NONE'"
              class="order-icon"
              :class="{ 'rotate-it': store.orderBy.artist === 'DESC' }"
              :icon="caretUp"
            />
          </ion-button>

          <ion-button @click="store.orderByType('date')">
            Date
            <ion-icon
              v-if="store.orderBy.date != 'NONE'"
              class="order-icon"
              :class="{ 'rotate-it': store.orderBy.date === 'DESC' }"
              :icon="caretUp"
            />
          </ion-button>

          <ion-button
            class="representation"
            :color="store.isRepre ? 'success' : 'primary'"
            @click="
              () => {
                store.isRepre = !store.isRepre
                store.filterRepre()
                store.filterSongs()
              }
            "
          >
            Representation
          </ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#MHeader {
  transition: 0.3s ease;
  position: relative;
  background-color: black;
  color: white;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  z-index: 8;
  overflow: hidden;

  &.fullHeight {
    min-height: 250px;
    height: max-content;
  }

  &.builder {
    background-image: -webkit-linear-gradient(
      214deg,
      rgb(25, 0, 255),
      rgba(255, 0, 206, 1)
    );
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
  }

  .header-content {
    padding-bottom: 20px;

    .searcher {
      display: flex;

      input {
        padding: 10px;
        border-radius: 7px;
        width: 100%;
        color: black;
      }

      ion-icon {
        padding: 10px 20px;
        font-size: 30px;
      }
    }

    .order-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin-top: 20px;

      .order-icon {
        padding-left: 5px;
        transition: 0.3s ease;
        transform-origin: 70% 55%;

        &.rotate-it {
          transition: 0.3s ease;
          transform: rotate(180deg);
        }
      }

      .representation {
        grid-column: 1 / 4;
      }
    }
  }

  .icon {
    background: rgb(255, 0, 255);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  a {
    text-decoration: none;
  }

  .logo {
    display: flex;
    color: rgb(255, 255, 255);

    h1 {
      margin: 0 5px;
      font-size: 20px;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
        sans-serif;
    }

    &:not(.builder) {
      background-image: -webkit-linear-gradient(
        170deg,
        rgb(96, 78, 255),
        rgba(255, 0, 206, 1)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
