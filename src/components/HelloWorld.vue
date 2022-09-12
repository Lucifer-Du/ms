<script>
import { post } from '../utils/http';
export default {
  data() {
    return {
      title: '',
      content: ''
    }
  },
  methods: {
    submit() {
      console.log('submit')
      post('http://localhost:3002/articles', { title: this.title, content: this.content})
    }
  }
}
</script>

<template>
  <div class="card">
    <input v-model="title" placeholder="title" />
    <input v-model="content" placeholder="content" />
    <button type="button" @click="submit">submit</button>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
