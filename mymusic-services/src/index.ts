import usePlayer from './services/usePlayer'
import useSettings from './services/useSettings'
import usePlaylist from './services/usePlaylist'
import useTags from './services/useTags'
import storage from './services/storage'
import utils from './services/utils'
import ISong, { isSong } from './models/ISong'
import ITag, { isTag } from './models/ITag'

import { useStore } from './store'

export {
  usePlayer,
  useSettings,
  usePlaylist,
  useTags,
  useStore,
  storage,
  utils,
  isTag,
  isSong,
}
export type { ISong, ITag }
