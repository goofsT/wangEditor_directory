# wangeEditor_dir_vue3 目录组件

用于 wangEditor 5 的目录组件
- 它可以自动解析编辑器内容中的标题，生成目录结构
- 点击目录项导航到对应内容位置
- 支持目录随内容滚动。
- 基于`ts` `vue3` `wangEditor5`
## 安装

```bash
npm install wangeEditor_dir_vue3 --save
```

## 引入组件

```javascript
import WangeEditorDir from 'wangeEditor_dir_vue3'
```

## 基本使用

```html
<template>
  <div class="editor-container">
    <!-- wangEditor 编辑器 -->
    <Editor ref="editorRef"></div>
    
    <!-- 目录组件 -->
    <WangeEditorDir 
      ref="directoryRef"
      v-if="show"
      :rootSelector="editorRef.$el" 
      @close="handleDirectoryClose"
      :headerStyle="{
        backgroundColor: 'var(--bg-rich-title)',
        color: 'var(--zing-color-primary)',
        fontSize: '16px',
        fontWeight: 'bold',
        paddingTop: '8px',
        paddingBottom: '8px',
      }"
      :containerStyle="{
        width:'360px',
        height:'400px',
        backgroundColor: 'var(--bg-color)',
        boxShadow: '0 0 3px var(--box-border-color-hover)',
        border: '1px solid var(--box-border-color)',
      }"
      :itemStyle="{
        fontSize: '12px',
        color: 'var(--text-color)',
        hoverColor: 'var(--zing-color-primary)',
      }"
      :activeStyle="{
        color: 'var(--zing-color-primary)',
        fontSize: '14px',
      }"
      ...
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WangeEditorDir from 'wangeEditor_dir_vue3'

import { Editor } from '@wangeditor/editor-for-vue'
const editorRef = ref(null)
const editorContainer = ref(null)


const show=ref(false)
const directoryRef=ref()
onMounted(() => {
  directoryRef.value?.init()
})

const handleDirectoryClose = () => {
  show.value=false
}
</script>
```

## 组件属性

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| rootSelector | HTMLElement | 是 | - | 编辑器的根元素，组件会在此元素内查找标题元素 |
| indentSize | Number | 否 | 15 | 目录缩进间隔，控制不同级别标题的缩进大小 |
| containerStyle | Object | 否 | {} | 目录容器的自定义样式 |
| itemStyle | Object | 否 | {} | 目录项的自定义样式 |
| headerStyle | Object | 否 | {} | 目录头部的自定义样式 |
| activeStyle | Object | 否 | {} | 当前激活目录项的自定义样式 |

## 事件

| 事件名 | 说明 |
| --- | --- |
| close | 当点击关闭按钮时触发 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| close | 自定义关闭按钮内容 |
| empty | 当没有目录内容时显示的内容 |
| header | 自定义标题 |

## 暴露方法

| 方法名 | 说明 |
| --- | --- |
| init | 手动初始化或刷新目录内容 |

## 工作原理

1. 组件会在指定的 `rootSelector` 元素内查找 ` h1,  h2,  h3` 元素作为标题
2. 自动为这些标题元素添加唯一ID
3. 根据标题级别自动生成缩进的目录结构
4. 当用户点击目录项时，自动滚动编辑器到对应的标题位置
5. 当用户在编辑器中滚动时，自动高亮当前可见区域的标题对应的目录项

## 自定义样式示例

```html
<WangeEditorDir
  :rootSelector="editorContainer"
  :containerStyle="{
    width: '250px',
    border: '1px solid #eee',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }"
  :headerStyle="{
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #eee'
  }"
  :itemStyle="{
    fontSize: '14px',
    padding: '5px 0'
  }"
  :activeStyle="{
    color: '#1890ff',
    fontWeight: 'bold'
  }"
/>
```

## 注意事项

1. 确保 `rootSelector` 指向的元素中包含 wangEditor 的编辑区域
2. 目录组件会自动监听编辑器的滚动事件，实时更新当前激活的目录项
3. 如果编辑器内容发生变化，可以调用组件的 `init()` 方法刷新目录
4. 组件会自动为编辑器中的标题添加锚点，便于目录导航

