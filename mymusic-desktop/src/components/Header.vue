<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useStore } from 'mymusic-services'

const store = useStore()

const props = defineProps({
  stateRightMenu: {
    type: String,
    default: '',
  },
})

const openSearcher = ref(false)
</script>

<style lang="scss" scoped>
#Header {
  transition: 0.3s ease;
  position: relative;
  top: 0;
  width: 100%;
  height: $headerHeight;
  background: black;
  overflow: hidden;
  z-index: 1;

  .header {
    height: $headerHeight;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  &.modeBuilder {
    transition: 0.3s ease;
    background: $gradient;
  }

  h1 {
    margin: 0;
    margin-left: 10px;
  }

  .icons {
    display: flex;

    img {
      width: 20px;
      height: 20px;
      padding: 10px;
      margin-right: 10px;
      cursor: pointer;
      filter: invert(1);

      &:hover {
        transition: 1s ease;
        transform: rotate(360deg);
      }
    }
  }

  .trash {
    width: 30px;
    height: 30px;
    padding: 10px;
    margin-right: 6px;
    cursor: pointer;
    filter: invert(1);
  }

  .playlist-modifiers {
    position: relative;
    transition: 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: calc(100% - $headerHeight);
    opacity: 0;
    z-index: -1;

    .filters {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      &:before {
        content: 'Filter playlist';
        position: absolute;
        margin-top: -20px;
        margin-left: 10px;
      }

      .searcher {
        grid-column: 1 / 4;
        display: flex;
        align-items: center;
      }
    }

    .orders {
      &:before {
        content: 'Order playlist';
        position: absolute;
        margin-top: -20px;
        margin-left: 10px;
      }

      display: grid;
      max-width: 350px;
      grid-template-columns: 1fr 1fr;
    }
  }

  .nQueue {
    position: absolute;
    background-color: $colorPink;
    padding: 5px;

    border-radius: 100%;
    width: fit-content;
    height: 6px;
    font-size: 14px;
    line-height: 0.5;
    z-index: 1;
  }

  .filter-text {
    line-height: 2.5;
    margin-right: 10px;
    color: $colorPink;
  }
}
</style>

<template>
  <div id="Header" :class="{ modeBuilder: store.modeBuilder }">
    <div class="header">
      <h1>MyMusic {{ store.songsFilter.length }}</h1>

      <div class="icons">
        <img
          @click="
            $emit(
              'state-right-menu',
              stateRightMenu === 'filters' ? '' : 'filters'
            )
          "
          src="@/assets/icons/search.svg"
        />
        <div
          @click="
            $emit(
              'state-right-menu',
              stateRightMenu === 'filters' ? '' : 'filters'
            )
          "
          class="filter-text"
        >
          {{ store.filterText }}
        </div>
        <div>
          <div v-if="store.queue.length" class="nQueue">
            {{ store.queue.length }}
          </div>
          <img
            @click="
              $emit(
                'state-right-menu',
                stateRightMenu === 'queue' ? '' : 'queue'
              )
            "
            src="@/assets/icons/reorder-four.svg"
          />
        </div>
        <img
          @click="
            $emit(
              'state-right-menu',
              stateRightMenu === 'djWorkspace' ? '' : 'djWorkspace'
            )
          "
          src="@/assets/icons/dj.svg"
        />
        <img
          @click="
            () => {
              store.modeBuilder = !store.modeBuilder
              store.filterSongs()
            }
          "
          src="@/assets/icons/brush.svg"
        />
        <img
          @click="
            $emit(
              'state-right-menu',
              stateRightMenu === 'settings' ? '' : 'settings'
            )
          "
          src="@/assets/icons/settings.svg"
        />
      </div>
    </div>
  </div>
</template>
