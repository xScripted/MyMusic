import ISong from '../models/ISong'
import ITag from '../models/ITag'
import { useStore } from '../store'
import { Howler as howler, Howl } from 'howler'
import { Emitter } from 'mitt'
import { Events } from '../models/Events'

// Refactor this
const Howler: any = howler

const usePlayer = (emitter: Emitter<Events>) => {
  const mplayer = useStore()
  let index = 0

  const buildSong = async (i: number, queue = false) => {
    index = i
    // fade out last song
    letDieSong()
    // Reset selected song
    mplayer.songs.map((song: ISong) => (song.selected = false))

    // Set currentSong data
    mplayer.currentSong = queue ? mplayer.songs[i] : mplayer.songsFilter[i]

    if (!mplayer.songsHistoric.includes(mplayer.currentSong.id))
      mplayer.songsHistoric.push(mplayer.currentSong.id)

    if (!mplayer.settings.folderPath) mplayer.settings.folderPath = ''
    console.log(mplayer.settings.volume)
    Howler._howls[0] = new Howl({
      src: [mplayer.settings.folderPath + mplayer.currentSong.path || ''],
      rate: 1,
      volume: mplayer.settings.volume,
      html5: false,
      onplay() {
        mplayer.playing = true
        mplayer.songsFilter[index].selected = true

        updateVolume()
        updateRate()

        if (mplayer.isDJMode) {
          const newBeginning =
            (mplayer.settings.songStarts * Howler._howls[0].duration()) / 100
          Howler._howls[0].seek(newBeginning)
        }

        Howler._howls[0].fade(0, 1, mplayer.settings.mixMode * 1000)
      },
      onloaderror(id: any, err: any) {
        if (emitter)
          emitter.emit(
            'show-alert',
            `❌ Load Error: ${err} <br> ${mplayer.currentSong.path}`
          )
        console.error('Load Error', id, err, mplayer.currentSong.path)
      },
      onplayerror(id: any, err: any) {
        if (emitter)
          emitter.emit(
            'show-alert',
            `❌ Play Error: ${err} <br> ${mplayer.currentSong.path}`
          )
        console.error('Play Error', id, err, mplayer.currentSong.path)
      },
    })

    play()
  }

  const before = () => {
    if (mplayer.isBucle) {
      buildSong(index)
      return
    }

    const currentIndex = mplayer.songsFilter.findIndex(
      (song: ISong) => song.id === mplayer.currentSong.id
    )

    if (currentIndex > 0) buildSong(currentIndex - 1)
    else buildSong(0)
  }

  const play = () => {
    if (Howler._howls[0]) Howler._howls[0].play()
    else buildSong(0)
  }

  const pause = () => {
    Howler._howls[0].pause()
    mplayer.playing = false
  }

  const next = () => {
    // First priority: Loop active
    if (mplayer.isBucle) {
      const currentIndex = mplayer.songsFilter.findIndex(
        (song: ISong) => song.id === mplayer.currentSong.id
      )
      if (currentIndex >= 0) {
        buildSong(currentIndex)
        return
      } else {
        mplayer.isBucle = false
      }
    }
    // Second priority: Queue
    if (mplayer.queue.length > 0) {
      const i = mplayer.isShuffle
        ? Math.round(Math.random() * (mplayer.queue.length - 1))
        : 0
      const queueSongId = mplayer.queue[i].id
      index = mplayer.songs.findIndex((song: ISong) => song.id === queueSongId) // Find index of next song
      buildSong(index, true)
      mplayer.removeFromQueue(i) // Remove song from the queue
      return
    }
    // Third priority: Random active
    if (mplayer.isShuffle) {
      const MAX_ATTEMPTS = 20
      let attempt = 0

      while (attempt < MAX_ATTEMPTS) {
        index = Math.floor(Math.random() * (mplayer.songsFilter.length - 1))
        if (!mplayer.songsHistoric.includes(mplayer.songsFilter[index].id)) {
          attempt = MAX_ATTEMPTS
        }
        attempt++
      }

      buildSong(index)
      return
    }
    // Last priority: Find next song available
    const currentIndex = mplayer.songsFilter.findIndex(
      (song: ISong) => song.id === mplayer.currentSong.id
    )

    if (currentIndex < mplayer.songsFilter.length - 1) {
      buildSong(currentIndex + 1)
    } else {
      buildSong(0)
    }
  }

  const updateRate = () => {
    if (Howler._howls.length > 0 && Howler._howls[0].playing()) {
      const nightcoreRate = mplayer.settings.nightcore / 100 + 1
      const lowcoreRate = 1 - mplayer.settings.lowcore / 100

      if (mplayer.isNightcore) Howler._howls[0].rate(nightcoreRate)
      if (mplayer.isLowcore) Howler._howls[0].rate(lowcoreRate)
      if (!mplayer.isNightcore && !mplayer.isLowcore) Howler._howls[0].rate(1)
    }
  }

  const updateVolume = () => {
    Howler.volume(mplayer.settings.volume)
  }

  const switchNightcore = () => {
    if (!mplayer.isNightcore) {
      mplayer.isNightcore = true
      mplayer.isLowcore = false
    } else {
      mplayer.isNightcore = false
    }

    updateRate()
  }
  // esta duplicada?
  const findTag = (tagId: string) =>
    mplayer.tags.find((tag: ITag) => tag.name === tagId)

  const switchLowcore = () => {
    if (!mplayer.isLowcore) {
      mplayer.isLowcore = true
      mplayer.isNightcore = false
    } else {
      mplayer.isLowcore = false
    }

    updateRate()
  }

  const switchShuffle = () => {
    if (!mplayer.isShuffle) {
      mplayer.isShuffle = true
      mplayer.isBucle = false
      return
    }

    mplayer.isShuffle = false
  }

  const switchBucle = () => {
    if (!mplayer.isBucle) {
      mplayer.isBucle = true
      mplayer.isShuffle = false
      return
    }

    mplayer.isBucle = false
  }

  const selectSongMoment = (clientX: number) => {
    if (Howler._howls.length > 0) {
      const songMoment =
        ((clientX / window.innerWidth) * 100 * Howler._howls[0].duration()) /
        100
      Howler._howls[0].seek(songMoment)
    }
  }

  /* Private functions */
  const letDieSong = () => {
    const sound = Howler._howls[0]
    const delay = mplayer.settings.mixMode * 1000

    if (sound) {
      Howler._howls = []
      sound.fade(1, 0, delay)
      setTimeout(() => sound.unload(), delay)
    }
  }

  setInterval(() => {
    if (Howler._howls[0]?.playing()) {
      const duration = Howler._howls[0].duration()
      const newEnding = duration - (duration * mplayer.settings.songEnds) / 100
      const margin = mplayer.isDJMode ? newEnding : mplayer.settings.mixMode

      const deadLine = duration - margin
      const currentSecond = Howler._howls[0].seek()

      if (currentSecond > deadLine) next()

      // LYRICS
      const key = 's' + Math.round(Howler._howls[0]?.seek())
      const content = JSON.parse(mplayer.currentSong.lyrics)[key]

      if (content) emitter.emit('lyric', content)

      if (Howler._howls[0]?.seek() < 1) emitter.emit('lyric', '')
    }
  }, 400)

  const stepFunction = () => {
    const nextWidth =
      (Howler._howls[0]?.seek() / Howler._howls[0]?.duration()) * 100
    mplayer.dynamicWidth = nextWidth + '%'
    window.requestAnimationFrame(() => stepFunction())
  }

  window.requestAnimationFrame(() => stepFunction())

  return {
    buildSong,
    before,
    play,
    pause,
    next,
    updateVolume,
    updateRate,
    switchNightcore,
    switchLowcore,
    switchShuffle,
    switchBucle,
    findTag,
    selectSongMoment,
  }
}

export default usePlayer
