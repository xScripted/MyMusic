<script setup lang="ts">
import { storage, useStore, usePlayer } from 'mymusic-services'
import { inject } from 'vue'

const emitter: any = inject('emitter')
const { updateVolume } = usePlayer(emitter)

const store = useStore()
</script>

<style lang="scss" scoped>
#Volume {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 10px;
}
</style>

<template>
  <div id="Volume">
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      v-model="store.settings.volume"
      @input="
        () => {
          updateVolume()
          storage.setSettings(store.settings)
        }
      "
    />
  </div>
</template>
