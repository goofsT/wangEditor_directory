<script lang="ts">
import { defineComponent } from 'vue';
import WangeEditor_dir_vue3 from '@/wange-editor_dir_vue3.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    WangeEditor_dir_vue3
  }
});
</script>

<template>
  <div id="app">
    <wange-editor_dir_vue3 />
  </div>
</template>
