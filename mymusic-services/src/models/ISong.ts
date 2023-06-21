export default interface ISong {
  id: string
  title: string
  artist: string
  path?: string
  selected: boolean
  cover: string
  tags: string[] // only ids
  lyrics: string
  date: Date,
  timerBegin?: string,
  timerEnd?: string
}

// Find a better way someday
export const isSong = (obj: ISong) => {
  const checks = [
    typeof obj.id === 'string',
    typeof obj.title === 'string',
    typeof obj.artist === 'string',
    typeof obj.selected === 'boolean',
    typeof obj.cover === 'string',
    typeof obj.tags === 'object',
    typeof obj.date === 'string',
  ]

  return checks.every(el => el)
}