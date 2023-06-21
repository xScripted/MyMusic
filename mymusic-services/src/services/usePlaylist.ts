import ISong from '../models/ISong'
import { useStore } from '../store'
import { Emitter } from 'mitt';
import usePlayer from './usePlayer'
import { Events } from '../models/Events'

const usePlaylist = (emitter: Emitter<Events>) => {
  const store = useStore()
  const player = usePlayer(emitter)
  let page = 1

  const clickSong = (song: ISong, index: number) => {
    if (store.modeBuilder) {
      store.applyTagsToSong(song.id)
      emitter.emit('show-alert', `📚 Tags applied to: ${song.title}`)
    } else {
      player.buildSong(index)
    }
  }  

  const askMoreSongs = (reset = false): ISong[] => {
    page = reset ? 1 : ++page

    return store.songsFilter.filter(
      (_song: ISong, i: number) => i <= page * 50
    )
  }

  return {
    clickSong,
    askMoreSongs
  }
}

export default usePlaylist
