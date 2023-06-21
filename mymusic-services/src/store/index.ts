import { defineStore } from 'pinia'
import ISong from '../models/ISong'
import ITag from '../models/ITag'
import ISettings from '../models/ISettings'
import storage from '../services/storage'

type Orders = 'title' | 'artist' | 'date'
type Cover = 'COVER' | 'WITH COVER' | 'WITHOUT COVER'
type Lyrics = 'LYRICS' | 'WITH LYRICS' | 'WITHOUT LYRICS'

export const useStore = defineStore('MPlayer', {
  state: () => {
    return {
      songs: [] as ISong[],
      songsFilter: [] as ISong[],
      songsRepre: [] as ISong[],
      songsHistoric: [] as string[],
      currentSong: {} as ISong,
      tags: [] as ITag[],
      queue: [] as ISong[],
      filterText: '',
      orderBy: {
        title: '',
        artist: '',
        date: '',
      },
      settings: {
        nightcore: 10,
        lowcore: 10,
        songStarts: 20, // %
        songEnds: 80, // %
        mixMode: 5, // seconds
        folderPath: '',
        volume: 1,
      } as ISettings,
      isNightcore: false,
      isLowcore: false,
      isDJMode: false,
      isBucle: false,
      isShuffle: false,
      isRepre: false,
      withCover: 'COVER' as Cover,
      withLyrics: 'LYRICS' as Lyrics,
      playing: false,
      dynamicWidth: '0%',
      modeBuilder: false,
      tagAndOr: true,
    }
  },
  actions: {
    storeSongs(songs: ISong[]) {
      this.songs = this.songs.concat(songs)
      this.songsFilter = this.songs
    },
    storeTags(tags: ITag[]) {
      this.tags = this.tags.concat(tags)
    },
    filterRepre() {
      if (this.isRepre) {
        // Disorder array of songs
        this.songsFilter = this.songs.sort(() => Math.random() - 0.5)
        // Get only one song per artist
        this.songsFilter.map((song: ISong) => {
          const already = this.songsRepre.some(
            (tmpSong: ISong) => tmpSong.artist === song.artist
          )
          if (!already) this.songsRepre.push(song)
        })
      }
    },
    filterSongs() {
      this.filterRepre()
      const arrSongs = this.isRepre ? this.songsRepre : this.songs

      this.songsFilter = arrSongs.filter((song: ISong) => {
        let tagExists = true

        if (!this.modeBuilder) {
          const negative = this.tags.some(
            (tag: ITag) =>
              tag.status === 'unactive' && song.tags.includes(tag.name)
          )
          if (negative) return false

          const activeTags = this.tags.filter(
            (tag: ITag) => tag.status === 'active'
          )

          if (activeTags.length) {
            if (this.tagAndOr) {
              tagExists = activeTags.some((tag: ITag) =>
                song.tags.includes(tag.name)
              )
            } else {
              tagExists = activeTags.every((tag: ITag) =>
                song.tags.includes(tag.name)
              )
            }
          }
        }

        const ifsCover = {
          COVER: true,
          'WITH COVER': !!song.cover,
          'WITHOUT COVER': !song.cover,
        }
        const ifsLyrics = {
          LYRICS: true,
          'WITH LYRICS': song.lyrics && song.lyrics !== '{}',
          'WITHOUT LYRICS': song.lyrics === '{}',
        }
        const inTitle = song.title
          ?.toLowerCase()
          .includes(this.filterText.toLowerCase())
        const inArtist = song.artist
          ?.toLowerCase()
          .includes(this.filterText.toLowerCase())

        return (
          (inTitle || inArtist) &&
          tagExists &&
          ifsCover[this.withCover as Cover] &&
          ifsLyrics[this.withLyrics as Lyrics]
        )
      })
      this.orderAll()
    },
    orderByType(type: Orders) {
      if (this.orderBy[type]) {
        this.songsFilter.sort((a: ISong, b: ISong) => {
          const ar1 =
            typeof a[type] === 'string'
              ? a[type].toString().toLowerCase()
              : a[type]
          const ar2 =
            typeof b[type] === 'string'
              ? b[type].toString().toLowerCase()
              : b[type]

          if (ar1 < ar2) return this.orderBy[type] === 'ASC' ? -1 : 1
          if (ar1 > ar2) return this.orderBy[type] === 'ASC' ? 1 : -1

          // Always reorder by title
          const ti1 = a.title?.toLowerCase()
          const ti2 = b.title?.toLowerCase()
          if (ti1 < ti2) return -1
          if (ti2 > ti1) return 1
          return 0
        })
      }
    },
    orderAll() {
      Object.keys(this.orderBy).map((value: any) => this.orderByType(value))
    },
    orderNext(state: string): string {
      if (state === 'ASC') return 'DESC'
      if (!state) return 'ASC'
      return ''
    },
    withLyricsNext(state: string, type: string): Lyrics {
      if (state === type) return 'WITH LYRICS'
      if (state === `WITH ${type}`) return 'WITHOUT LYRICS'
      return 'LYRICS'
    },
    withCoverNext(state: string, type: string): Cover {
      if (state === type) return 'WITH COVER'
      if (state === `WITH ${type}`) return 'WITHOUT COVER'
      return 'COVER'
    },
    shuffleSongs() {
      this.songsFilter = this.songsFilter.sort(() => Math.random() - 0.5)
    },
    clearAll() {
      this.orderBy.title = ''
      this.orderBy.artist = ''
      this.orderBy.date = ''
      this.withCover = 'COVER'
      this.withLyrics = 'LYRICS'
      this.isRepre = false
      this.filterText = ''
      this.filterSongs()
    },
    findTag(tagName: string): ITag | null {
      return this.tags.find((tag: ITag) => tag.name === tagName) || null
    },
    applyTagsToSong(id: string) {
      const i = this.songs.findIndex((song: ISong) => song.id === id)

      this.tags.map((tag: ITag) => {
        if (tag.status == 'active') {
          const exists = this.songs[i].tags.includes(tag.name)
          if (!exists) this.songs[i].tags.push(tag.name)
        }

        if (tag.status == 'unactive') {
          this.songs[i].tags = this.songs[i].tags.filter(
            (idt: string) => idt != tag.name
          )
        }
      })

      storage.setSongs(this.songs)
    },
    addSongToQueue(song: ISong) {
      this.queue.push(song)
    },
    removeFromQueue(index: number) {
      this.queue = this.queue.filter((_song: ISong, i: number) => i !== index)
    },
    toggleTagStatus(name: string) {
      const i = this.tags.findIndex((tag: ITag) => tag.name === name)
      const status = this.tags[i].status

      this.tags[i].status = status
        ? status === 'active'
          ? 'unactive'
          : ''
        : 'active'
      if (!this.modeBuilder) this.filterSongs()
    },
    clearStatus() {
      for (const i in this.tags) this.tags[i].status = ''
      if (!this.modeBuilder) this.filterSongs()
    },
    updateSong(data: any) {
      const i = this.songs.findIndex((song: ISong) => data.id === song.id)

      this.songs[i].title = data.title
      this.songs[i].artist = data.artist
      this.songs[i].cover = data.cover
      this.songs[i].lyrics = data.lyrics

      storage.setSongs(this.songs)
    },
    deleteSong(id: string) {
      this.songs = this.songs.filter((song: ISong) => song.id !== id)
      this.filterSongs()

      storage.setSongs(this.songs)
    },
  },
})
