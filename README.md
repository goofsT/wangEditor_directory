# wangeditor-directory-vue3

一个基于Vue 3的wangEditor目录组件，用于自动生成wangEditor编辑器内容的目录导航。

## 安装

```bash
npm install wangeditor-directory-vue3
```

## 使用方法

### 全局注册

```js
import { createApp } from 'vue'
import App from './App.vue'
import { WangeditorDirVue3 } from 'wangeditor-directory-vue3'
import 'wangeditor-directory-vue3/dist/style.css'

const app = createApp(App)
app.use(WangeditorDirVue3)
app.mount('#app')
```

### 局部注册

```vue
<template>
  <div class="editor-container">
    <div id="editor-content"></div>
    <WangeditorDirVue3 
      :rootSelector="editorRoot"
      :indentSize="15"
      @close="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { WangeditorDirVue3 } from 'wangeditor-directory-vue3'
import 'wangeditor-directory-vue3/dist/style.css'
import { createEditor } from '@wangeditor/editor'

const editorRoot = ref(null)

onMounted(() => {
  // 创建编辑器
  const editor = createEditor({
    selector: '#editor-content',
    html: '<h1>标题1</h1><p>内容...</p><h2>标题2</h2><p>更多内容...</p>',
    config: {
      // 编辑器配置
    }
  })
  
  // 获取编辑器根元素
  editorRoot.value = document.querySelector('#editor-content')
})

const handleClose = () => {
  // 处理目录关闭事件
  console.log('目录已关闭')
}
</script>
```

## 属性

| 属性名 | 类型 | 默认值 | 描述 |
| ------ | ---- | ------ | ---- |
| rootSelector | HTMLElement | - | wangEditor的根元素，必传 |
| indentSize | Number | 15 | 目录层级缩进大小 |
| containerStyle | Object | {} | 容器样式 |
| itemStyle | Object | {} | 目录项样式 |
| headerStyle | Object | {} | 目录头部样式 |
| activeStyle | Object | {} | 激活项样式 |

## 事件

| 事件名 | 描述 |
| ------ | ---- |
| close | 目录关闭时触发 |

## 插槽

| 插槽名 | 描述 |
| ------ | ---- |
| header | 自定义目录头部 |
| empty | 没有目录项时的提示 |

## 方法

通过ref可以调用组件内部方法：

```vue
<template>
  <WangeditorDirVue3 ref="directoryRef" :rootSelector="editorRoot" />
  <button @click="refreshDirectory">刷新目录</button>
</template>

<script setup>
import { ref } from 'vue'

const directoryRef = ref(null)

const refreshDirectory = () => {
  directoryRef.value.init()
}
</script>
```

## 示例

目录组件会自动识别编辑器内的h1, h2, h3标签并生成对应的目录项，点击目录项可以快速定位到对应的标题位置。

## 许可证

MIT
