<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'

import { IonButton, IonToggle, IonIcon } from '@ionic/vue'
import { useTags, useStore, ITag } from 'mymusic-services'
import {
  expand,
  contract,
  add,
  pricetags,
  close,
  refresh,
  brushOutline,
} from 'ionicons/icons'

export default defineComponent({
  components: {
    IonButton,
    IonIcon,
    IonToggle,
  },
  setup() {
    let startTime: any = new Date()
    const isForm = ref(false)
    const editTagId = ref('')
    const formData = reactive({
      name: '',
      textColor: '#FFFFFF',
      grad1: '#dc01c2',
      grad2: '#530693',
    })
    const store = useStore()
    const { gradient, ungradient, createTag, updateTag, clearForm, deleteTag } =
      useTags(formData, isForm, editTagId)

    const startClick = () => (startTime = new Date())

    const endClick = (tag: ITag) => {
      const endTime: any = new Date()
      const timeDiff = endTime - startTime // ms

      if (store.modeBuilder && timeDiff > 500) {
        isForm.value = true

        const { grad1, grad2 } = ungradient(tag.bgColor)

        formData.name = tag.name
        formData.textColor = tag.textColor
        formData.grad1 = grad1
        formData.grad2 = grad2

        editTagId.value = tag.id
      } else {
        store.toggleTagStatus(tag.name)
      }
    }

    return {
      songs: store.songs,
      formData,
      gradient,
      createTag,
      isForm,
      store,
      startClick,
      endClick,
      updateTag,
      editTagId,
      clearForm,
      deleteTag,

      // icons
      contract,
      expand,
      add,
      pricetags,
      close,
      refresh,
      brushOutline,
    }
  },
})
</script>

<template>
  <div id="MTags">
    <div class="tags-tools">
      <div class="tag-mode">
        <ion-icon :icon="contract" />
        <ion-toggle
          :checked="store.tagAndOr"
          value="false"
          @ionChange="
            () => {
              store.tagAndOr = !store.tagAndOr
              store.filterSongs()
            }
          "
        />
        <ion-icon :icon="expand" />
      </div>
      <div class="group-right">
        <ion-icon
          v-if="!isForm"
          @click="store.clearStatus()"
          style="font-size: 20px"
          :icon="refresh"
        />
        <div class="open-form">
          <div v-if="!isForm" class="open-btn" @click="isForm = true">
            <ion-icon :icon="add" />
            <ion-icon :icon="pricetags" />
          </div>
          <ion-icon
            v-else
            @click="
              () => {
                clearForm()
                isForm = false
              }
            "
            :icon="close"
          />
        </div>
      </div>
    </div>

    <div v-if="isForm" class="create-tag-form">
      <div class="preview" style="grid-column: 1 / 3">
        <div
          class="tag"
          :style="{ background: gradient, color: formData.textColor }"
        >
          {{ formData.name }}
        </div>
      </div>
      <div class="input-group">
        <label for="tag-name"> Name </label>
        <input id="tag-name" v-model="formData.name" type="text" />
      </div>
      <div class="input-group">
        <label for="tag-text-color"> Text Color </label>
        <input id="tag-text-color" v-model="formData.textColor" type="color" />
      </div>
      <div class="input-group">
        <label for="tag-grad1"> Gradient 1 </label>
        <input id="tag-grad1" v-model="formData.grad1" type="color" />
      </div>
      <div class="input-group">
        <label for="tag-grad2"> Gradient 2 </label>
        <input id="tag-grad2" v-model="formData.grad2" type="color" />
      </div>
      <ion-button
        v-if="!editTagId"
        @click="createTag"
        style="grid-column: 1 / 3; height: 50px; margin-top: 50px"
      >
        Create
      </ion-button>
      <div v-else class="update-buttons">
        <ion-button @click="updateTag"> Update </ion-button>
        <ion-button @click="deleteTag" color="danger"> Delete </ion-button>
      </div>
    </div>
    <div class="tags-container" v-else>
      <div
        v-for="tag of store.tags"
        class="tag"
        :class="tag.status"
        :style="{ background: tag.bgColor, color: tag.textColor }"
        :key="tag.id"
        @touchstart="startClick()"
        @touchend="endClick(tag)"
      >
        {{ tag.name }}
      </div>
    </div>

    <div v-if="store.tags.length === 0 && !isForm" class="tags-info">
      Tags are used to add attributes to your songs (e.g: Rock, EDM, Remix,
      Chill, Favorites...).<br /><br />
      This is useful to filter the playlist and make custom playlist combining
      the tags that you want to hear
      <br />
      <br />
      <ion-icon :icon="contract" /> Filter songs that have BOTH tags
      <br />
      <br />
      <ion-icon :icon="expand" /> Filter songs that have atleast one tag
      <br />
      <br />
      <ion-icon :icon="brushOutline" /> Activate mode editor, allows you to add
      or remove current tags selected to songs by clicking the song on the
      playlist tab. (1st click: add, 2nd click: remove)
      <br />
      <br />
      <ion-icon :icon="pricetags" /> Form to create a new tag
      <br />
      <br />
      <ion-icon :icon="refresh" /> Unselect all the tags
      <br />
      <br />
      To edit an existing tag hold click one second and form will display
      <br />
      <br />
      There are three states for tags: normal, activated & negative
    </div>
  </div>
</template>

<style lang="scss" scoped>
#MTags {
  padding: 20px;
  background-color: rgb(24, 0, 51);
  color: white;
  height: 100%;
  overflow-y: scroll;

  .tags-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tag-mode {
      display: flex;
      align-items: center;
    }

    .group-right {
      display: flex;
      align-items: center;
      justify-content: space-between;

      ion-icon {
        padding: 10px;
        padding-left: 20px;
        font-size: 20px;
      }
    }

    .open-form {
      margin-top: 5px;
      font-size: 20px;

      .open-btn {
        ion-icon:nth-child(1) {
          position: absolute;
          color: black;
          font-size: 14px;
          z-index: 2;
          margin-top: 2px;
          margin-left: 2px;
        }
      }
    }
  }

  .create-tag-form {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;

    .input-group {
      display: flex;
      flex-direction: column;

      label {
        padding: 10px 0;
        text-align: center;
      }

      input {
        border-radius: 5px;
        width: 100%;
        color: black;
      }

      input[type='text'] {
        padding: 10px;
      }

      input[type='color'] {
        width: 100%;
        height: 40px;
      }
    }

    .update-buttons {
      grid-column: 1 / 3;
      display: flex;
      flex-direction: column;

      ion-button {
        height: 50px;
        margin-top: 20px;
      }
    }

    .preview {
      display: flex;
      justify-content: center;
      margin: 20px 0;

      .tag {
        width: 150px;
      }
    }
  }

  .tags-container {
    display: grid;
    margin-top: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;
    width: 90%;
  }

  .tags-info {
    color: grey;
  }
}
</style>
