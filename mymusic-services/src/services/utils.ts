import storage from '../services/storage'
import { useStore } from '../store'

export default {
  loadData() {
    const store = useStore()
    const tags = storage.getTags()
    const songs = storage.getSongs()
    const settings = storage.getSettings()

    if (tags) store.storeTags(tags)
    if (songs) store.storeSongs(songs)
    if (settings) store.settings = settings
  },
  onDownload(content: any, filename: string) {
    const a = document.createElement('a')
    const file = new Blob([JSON.stringify(content)], { type: 'text/json' })
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
  },
  formatTime(secs: number) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs - minutes * 60) || 0;
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}