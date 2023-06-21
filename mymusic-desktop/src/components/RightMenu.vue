<script setup lang="ts">
import { defineProps } from 'vue'
import Settings from '@/components/Settings.vue'
import Filters from '@/components/Filters.vue'
import Queue from '@/components/Queue.vue'
import DjWorkspace from '@/components/DjWorkspace.vue'
import SongForm from '@/components/forms/SongForm.vue'

const props = defineProps({
  stateRightMenu: {
    type: String,
    default: '',
  },
  editSong: {
    default: {},
  },
})
</script>

<style lang="scss" scoped>
#RightMenu {
  transition: 0.3s ease;
  width: 0px;
  overflow-y: scroll;
  opacity: 0;
  background-color: $colorDarkGrey;
  height: calc(100% - 40px);

  &.open {
    transition: 0.3s ease;
    width: 700px;
    opacity: 1;
    padding: 30px;

    &.extended {
      width: 1400px;
    }
  }

  ::v-deep h1 {
    margin: 0;
  }
}
</style>

<template>
  <div
    id="RightMenu"
    :class="{ open: stateRightMenu, extended: stateRightMenu === 'songForm' }"
  >
    <Settings v-if="stateRightMenu === 'settings'" />
    <DjWorkspace v-if="stateRightMenu === 'djWorkspace'" />
    <Filters v-if="stateRightMenu === 'filters'" />
    <SongForm
      v-if="stateRightMenu === 'songForm'"
      :song="editSong"
      @close="$emit('close')"
    />
    <Queue v-if="stateRightMenu === 'queue'" />
  </div>
</template>
