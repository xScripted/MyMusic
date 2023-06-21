import ISong from '../models/ISong'
import ITag from '../models/ITag'
import { useStore } from '../store'

const useSettings = () => {
  const store = useStore()

  const onlyNewSongs = (newSongs: ISong[]): ISong[] => {
    return newSongs.filter((song: ISong) =>
      store.songs.every(
        (mpSong: ISong) =>
          mpSong.title !== song.title || mpSong.artist !== song.artist
      )
    )
  }

  const onlyNewTags = (newTags: ITag[]): ITag[] => {
    return newTags.filter((tag: ITag) =>
      store.tags.every((mpTag: ITag) => mpTag.id !== tag.id)
    )
  }

  const splitNames = (fullname: string) => {
    let arr = fullname.split('.mp3')

    arr = arr[0].split(/\\|\//g)
    arr = arr[arr.length - 1].split('-')

    return {
      title: arr[1]?.trim(),
      artist: arr[0]?.trim()
    }
  }

  return {
    onlyNewSongs,
    onlyNewTags,
    splitNames
  }
}



export default useSettings
