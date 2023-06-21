import { useStore } from '../store'
import ITag from '../models/ITag'
import ISong from '../models/ISong'
import storage from './storage'


interface IFormData {
  name: string,
  textColor: string,
  grad1: string,
  grad2: string
}

const useTags = (formData: IFormData, isForm: any, editTagId: any) => {
  const store = useStore()

  const gradient = () => {
    return `linear-gradient(214deg, ${formData.grad2} 0%, ${formData.grad1} 100%)`
  }

  const ungradient = (gradient: string) => {
    const grad1 = '#' + (gradient.split('#')[1].split(' ')[0])
    const grad2 = '#' + (gradient.split('#')[2].split(' ')[0])
    return { grad1, grad2 }
  }

  const editTag = (tag: ITag) => {
    isForm.value = true

    const { grad1, grad2 } = ungradient(tag.bgColor)

    formData.name = tag.name
    formData.textColor = tag.textColor
    formData.grad1 = grad1
    formData.grad2 = grad2

    editTagId.value = tag.name
  }

  const createTag = () => {
    if(store.findTag(formData.name)) return

    const tag = {
      name: formData.name,
      textColor: formData.textColor,
      bgColor: gradient(),
      status: ''
    } as ITag

    store.tags.push(tag)
    storage.setTags(store.tags)

    clearForm()
    isForm.value = false
  }

  const clearForm = () => {
    formData.name = ''
    formData.textColor = '#000000'
    formData.grad1 = '#444444'
    formData.grad2 = '#444444'
  }

  const openForm = () => {
    isForm.value = true
    editTagId.value = ''
  }

  const updateTag = () => {
    const i = store.tags.findIndex((tag: ITag) => tag.name === editTagId.value)
    store.tags[i].name = formData.name
    store.tags[i].bgColor = gradient() 
    store.tags[i].textColor = formData.textColor

    storage.setTags(store.tags)

    //resets
    editTagId.value = ''
    isForm.value = false
    clearForm()
  }

  const deleteTag = () => {
    store.tags = store.tags.filter((tag: ITag) => tag.name !== editTagId.value)
    store.songs = store.songs.map((song: ISong) => {
     song.tags = song.tags.filter((tag: string) => tag !== editTagId.value)
     return song
    })
    storage.setTags(store.tags)
    clearForm()
    isForm.value = false
  }

  return {
    formData,
    gradient,
    createTag,
    isForm,
    updateTag,
    editTagId,
    clearForm,
    ungradient,
    deleteTag,
    editTag,
    openForm
  }
}

export default useTags