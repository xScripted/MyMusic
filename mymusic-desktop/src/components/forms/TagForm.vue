<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useTags } from 'mymusic-services'

const props = defineProps({
  formData: {
    type: Object,
    default: false,
  },
  editTagId: {
    type: String,
    default: '',
  },
})

const gradient = computed(() => {
  return `linear-gradient(214deg, ${props.formData.grad2} 0%, ${props.formData.grad1} 100%)`
})
</script>

<style lang="scss" scoped>
#TagForm {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: 50px;

  .input-group {
    display: flex;
    flex-direction: column;

    label {
      padding: 10px 0;
      text-align: center;
    }

    input[type='color'] {
      width: 95%;
      margin: auto;
      height: 35px;
      border-radius: 5px;
    }
  }

  .update-buttons {
    grid-column: 1 / 4;
    display: flex;
    flex-direction: column;

    button {
      margin: 0;
      height: 40px;
      width: 100%;
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
</style>

<template>
  <div id="TagForm">
    <div class="preview" style="grid-column: 1 / 4">
      <div
        class="tag"
        :style="{ background: gradient, color: formData.textColor }"
      >
        {{ formData.name }}
      </div>
    </div>

    <div v-if="!editTagId" class="form__group field" style="grid-column: 1 / 4">
      <input
        type="text"
        class="form__field"
        name="name"
        id="name"
        v-model="formData.name"
      />
      <label for="name" class="form__label">Name</label>
    </div>

    <div class="input-group">
      <label for="tag-grad1"> Gradient 1 </label>
      <input id="tag-grad1" v-model="formData.grad1" type="color" />
    </div>
    <div class="input-group">
      <label for="tag-text-color"> Text Color </label>
      <input id="tag-text-color" v-model="formData.textColor" type="color" />
    </div>
    <div class="input-group">
      <label for="tag-grad2"> Gradient 2 </label>
      <input id="tag-grad2" v-model="formData.grad2" type="color" />
    </div>
    <button
      v-if="!editTagId"
      @click="$emit('create-tag')"
      class="button-85"
      style="grid-column: 1 / 4; height: 50px; margin-top: 50px"
    >
      Create
    </button>
    <div v-else class="update-buttons">
      <button class="button-85" @click="$emit('update-tag')">Update</button>
      <button class="button-85" @click="$emit('delete-tag')" color="danger">
        Delete
      </button>
    </div>
  </div>
</template>
