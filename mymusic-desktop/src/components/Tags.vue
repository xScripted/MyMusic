<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTags, useStore } from 'mymusic-services'
import TagForm from '@/components/forms/TagForm.vue'

const isForm = ref(false)
const editTagId = ref('')
const formData = reactive({
  name: '',
  textColor: '#FFFFFF',
  grad1: '#dc01c2',
  grad2: '#530693',
})

const store = useStore()

const { clearForm, updateTag, deleteTag, createTag, editTag, openForm } =
  useTags(formData, isForm, editTagId)
</script>

<style lang="scss" scoped>
#Tags {
  width: 100%;
  height: 100%;

  .tool-bar {
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: 50px;
    justify-content: space-between;

    .tagAndOr {
      display: flex;
      align-items: center;
    }

    .pricetags {
      display: flex;
      align-items: center;
      cursor: pointer;

      span {
        margin-top: -6px;
        margin-right: 5px;
        font-size: 20px;
      }
      img {
        padding-left: 0;
      }
    }

    .icon {
      cursor: pointer;
      width: 20px;
      height: 20px;
      padding: 10px;
      filter: invert(1);
    }
  }

  .tags-container {
    display: grid;
    margin-top: 20px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    grid-auto-rows: 30px;
    padding: 15px;

    .tag {
      position: relative;
      cursor: pointer;
    }
  }

  .tags-info {
    color: grey;
  }
}
</style>

<template>
  <div id="Tags">
    <div class="tool-bar">
      <div class="tagAndOr">
        <img class="icon" src="@/assets/icons/contract.svg" />
        <input
          @input="
            () => {
              store.tagAndOr = !store.tagAndOr
              store.filterSongs()
            }
          "
          type="checkbox"
          class="toggle"
          checked
        />
        <img class="icon" src="@/assets/icons/expand.svg" />
      </div>

      <div v-if="!isForm" style="display: flex; gap: 10px">
        <img
          class="icon"
          @click="store.clearStatus()"
          src="@/assets/icons/refresh.svg"
        />
        <div class="pricetags" @click="openForm">
          <span>+</span>
          <img class="icon" src="@/assets/icons/pricetags.svg" />
        </div>
      </div>
      <div v-else>
        <img
          class="icon"
          @click="
            () => {
              clearForm()
              isForm = false
            }
          "
          src="@/assets/icons/close.svg"
        />
      </div>
    </div>

    <TagForm
      v-if="isForm"
      :editTagId="editTagId"
      :formData="formData"
      @update-tag="updateTag"
      @delete-tag="deleteTag"
      @create-tag="createTag"
    />

    <div class="tags-container" v-else>
      <div
        v-for="tag of store.tags"
        class="tag"
        :class="tag.status"
        :style="{ background: tag.bgColor, color: tag.textColor }"
        :key="tag.name"
        @click="store.toggleTagStatus(tag.name)"
        @contextmenu="editTag(tag)"
      >
        {{ tag.name }}
      </div>
    </div>
  </div>
</template>
