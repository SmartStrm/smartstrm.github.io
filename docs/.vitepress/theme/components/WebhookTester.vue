<script setup>
import { ref, reactive, computed } from 'vue'

const url = ref('http://127.0.0.1:8024/webhook/9dfb5769ad483e83')
const loading = ref(false)
const result = ref('')
const status = ref(null)

const resetBody = () => {
  requestBodyStr.value = `{
  "event": "a_task",
  "task": {
      "name": "test",
      "storage_path": "/drive/quark/test",
      "dir_time_check": false,
      "incremental": false,
      "keep_local_asset": true,
      "plugins": {}
  },
  "delay": 0,
  "strm": {
      "media_ext": [
          "mp4",
          "mkv"
      ],
      "url_encode": true,
      "media_size": 100,
      "copy_ext": [
          "srt",
          "ass"
      ]
  }
}`
}

const minBody = () => {
  requestBodyStr.value = `{
  "event": "a_task",
  "task": {
    "name": "movie_task"
  }
}`
}

const requestBodyStr = ref(``)

const sendRequest = async () => {
  loading.value = true
  result.value = ''
  status.value = null

  try {
    const response = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBodyStr.value
    })

    status.value = response.status
    const text = await response.text()
    result.value = text
  } catch (error) {
    status.value = 'Error'
    result.value = error.message
  } finally {
    loading.value = false
  }
}

resetBody()
</script>

<template>
  <div class="webhook-tester">
    <div class="form-group">
      <label>Webhook URL</label>
      <input v-model="url" type="text" placeholder="http://127.0.0.1:8024/webhook/your_token_here" />
    </div>

    <div class="form-group">
      <label>请求体 (JSON)</label>
      <textarea v-model="requestBodyStr" rows="10"></textarea>
    </div>

    <div class="buttons">
      <button @click="sendRequest" :disabled="loading" class="btn-primary">
        {{ loading ? '发送中...' : '发送请求' }}
      </button>
      <button @click="resetBody" class="btn-secondary">完整示例</button>
      <button @click="minBody" class="btn-secondary">最小示例</button>
    </div>

    <div v-if="status !== null" class="result">
      <label>响应状态: <span :class="status === 200 ? 'success' : 'error'">{{ status }}</span></label>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<style scoped>
.webhook-tester {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: monospace;
  font-size: 13px;
}

.form-group textarea {
  resize: vertical;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
}

.result label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
}

.result pre {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 200px;
}

.success {
  color: #10b981;
}

.error {
  color: #ef4444;
}
</style>
