<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import Tabs from '@/components/Tabs.vue'
import Alert from '@/components/Alert.vue'
import PlayerLite from '@/components/PlayerLite.vue'
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'
import { defineComponent, provide, onMounted } from 'vue'
import { utils, usePlayer } from 'mymusic-services'
import mitt from 'mitt'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    Tabs,
    Alert,
    Header,
    PlayerLite,
  },
  setup() {
    const emitter: any = mitt()
    const route = useRoute()
    const { next, before, play, pause } = usePlayer(emitter)

    provide('emitter', emitter)

    emitter.on('before', () => before())
    emitter.on('play', () => play())
    emitter.on('pause', () => pause())
    emitter.on('next', () => next())

    onMounted(() => {
      AndroidPermissions.requestPermissions([
        AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      ])

      utils.loadData()
    })

    return { route }
  },
})
</script>

<template>
  <ion-app style="justify-content: flex-start">
    <Alert />
    <Header />
    <div class="routes" :class="{ player: route.name === 'Player' }">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
    <div :style="{ zIndex: route.name === 'Player' ? -1 : 6 }" class="controls">
      <PlayerLite />
      <Tabs />
    </div>
  </ion-app>
</template>

<style lang="scss">
.player {
  position: relative;
  height: 100% !important;
}

.routes {
  height: calc(100% - 190px);
}

body {
  background: black;
  color: white;
  user-select: none;

  * {
    font-family: 'Rubik';
  }

  input {
    border: 0;
    background-color: rgb(235, 235, 235);
    color: black;
    border-radius: 5px;
  }
}

.tag {
  transition: 0.3s ease;
  border-radius: 6px;
  width: 100%;
  min-height: 40px;
  padding: 5px;
  font-size: 15px;
  box-shadow: 0 0 5px 0 black;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.active {
    transition: 0.3s ease;
    border: 2px solid black;
    transform: skewY(-6deg) scale(0.9);
  }
  &.unactive {
    transition: 0.3s ease;
    opacity: 0.5;
    transform: scale(0.7);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
