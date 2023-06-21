<script setup lang="ts">
import { inject, ref } from 'vue'
import { useStore } from 'mymusic-services'
const emitter: any = inject('emitter')

const store = useStore()
const message = ref('')
const show = ref(false)

emitter.on('show-alert', (msg: string) => {
  message.value = msg
  show.value = true
  setTimeout(() => (show.value = false), 1500)
})
</script>

<style lang="scss">
.alert {
  transition: 1s ease-out;
  position: absolute;
  background-color: $colorDarkGrey;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 5px 2px $colorPink;
  z-index: 999;
  color: white;
  margin: auto;
  left: 0;
  right: 0;
  top: 50px;
  max-width: 300px;
  margin-top: -30px;
  opacity: 0;
  display: none;

  &.show {
    transition: 1s ease-in;
    display: block;
    opacity: 1;
  }
}
</style>

<template>
  <div class="alert" :class="{ show }">{{ message }}</div>
</template>
