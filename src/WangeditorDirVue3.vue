<template>
  <div class="directory-container" ref="containerRef" :style="containerStyle">
    <div class="header" ref="headerRef" :style="headerStyle">
      <slot name="header">
        <div class="close-button" @click="emit('close')">
          <svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
            <path
              d="M563.8 512l194.7-194.7c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L518.5 466.7 323.8 272c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L473.2 512 278.5 706.7c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L518.5 557.3l194.7 194.7c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L563.8 512z" />
          </svg>
        </div>
        <div class="title" style="margin-left: -50px;">目录</div>
      </slot>
    </div>
    <!-- 目录 -->
    <div v-if="tableOfContents.length > 0" class="table-of-contents"
      :style="{ height: containerHeight - headerHeight + 'px' }">
      <!-- 目录内容 -->
      <ul>
        <li v-for="(item, index) in tableOfContents" :key="item.id" class="li-item"
          :style="{ paddingLeft: item.level * (indentSize || 20) + 'px', ...itemStyle }">
          <span :style="activeIndex === index ? activeStyle : {}" @click="handleItemClick(index)">{{ item.text }}</span>
        </li>
      </ul>
    </div>
    <div v-else class="empty-container">
      <slot name="empty">
        <span>无数据</span>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WangeditorDirVue3'
})
</script>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

interface TocItem {
  id: string;
  text: string | null;
  level: number;
  index: number;
}

const emit = defineEmits(['close'])
const props = defineProps({
  rootSelector: {
    type: Object as () => HTMLElement,
    required: true
  },
  indentSize: {
    type: Number,
    default: 15
  },
  containerStyle: {
    type: Object as () => Record<string, string>,
    default: () => ({})
  },
  itemStyle: {
    type: Object as () => Record<string, string>,
    default: () => ({})
  },
  headerStyle: {
    type: Object as () => Record<string, string>,
    default: () => ({})
  },
  activeStyle: {
    type: Object as () => Record<string, string>,
    default: () => ({})
  }
})

let tableOfContents = ref<TocItem[]>([])

// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay) as unknown as number
  }
}

const levelMap = {
  'H1': 0,
  'H2': 1,
  'H3': 2
}

// 生成目录
const generateTableOfContents = () => {
  const rootSelector = props.rootSelector
  if (rootSelector) {
    const headings = rootSelector.querySelectorAll('h1, h2, h3')
    const toc: TocItem[] = []
    headings.forEach((heading, index) => {
      const id = `section-${index + 1}`
      const level = levelMap[heading.tagName as keyof typeof levelMap]
      heading.setAttribute('id', id) // 设置标题的id属性
      toc.push({ 
        id: id, 
        text: heading.textContent, 
        level: level, 
        index: index 
      }) // 将标题文本、id和等级添加到目录项中
    })
    return toc
  } else {
    return []
  }
}

// 更新目录项点击事件处理函数
const handleItemClick = (index: number) => {
  activeIndex.value = index

  // 获取目标目录项的锚点链接 href 属性值
  const sectionId = `section-${index + 1}`
  const targetItem = document.getElementById(sectionId) as HTMLElement
  // 滚动目录以确保当前点击的目录项可见
  if (targetItem && props.rootSelector) {
    const scrollContainer = props.rootSelector.querySelector('.w-e-scroll') as HTMLElement
    if (scrollContainer) {
      scrollContainer.scrollTop = targetItem.offsetTop
      activeIndex.value = index
    }
  }
}

const activeIndex = ref<number | undefined>()

// 判断元素是否在容器可视区域内
const isElementInView = (element: HTMLElement, container: HTMLElement) => {
  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom
  )
}

// 使用防抖处理滚动
const handleScroll = debounce((scrollY: number) => {
  if (!props.rootSelector) return;

  const sections = props.rootSelector.querySelectorAll('h1,  h2,  h3')
  if (sections.length === 0) return;

  const seenText = new Set();
  const filteredSections = Array.from(sections).filter(section => {
    const text = (section as HTMLElement).textContent?.trim() || '';
    seenText.add(text);
    return true
  });

  if (filteredSections.length === 0) return;

  let currentIndex = -1;
  const container = props.rootSelector.querySelector('.w-e-scroll') as HTMLElement;
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top;
  const visibleThreshold = 50; // 可见阈值

  // 找出第一个可见的标题
  for (let i = 0; i < filteredSections.length; i++) {
    const section = filteredSections[i] as HTMLElement;
    const sectionRect = section.getBoundingClientRect();
    const relativeTop = sectionRect.top - containerTop;
    // 如果标题在可视区域内或刚好在上方一点
    if (relativeTop <= visibleThreshold) {
      currentIndex = i;
    } else {
      // 一旦找到第一个不在可视区域的标题，就停止
      break;
    }
  }

  // 如果没有找到可见标题，使用最接近的一个
  if (currentIndex === -1 && filteredSections.length > 0) {
    currentIndex = 0;
  }

  // 只有当activeIndex变化时才更新和滚动
  if (activeIndex.value !== currentIndex && currentIndex !== -1) {
    activeIndex.value = currentIndex;

    // 延迟执行滚动，避免频繁触发
    nextTick(() => {
      // 滚动目录以确保当前高亮的目录项可见
      const activeItem = document.querySelector('.table-of-contents .active') as HTMLElement;
      if (activeItem) {
        const container = document.querySelector('.table-of-contents') as HTMLElement;

        // 只有当当前活动项不在可视区域内时才滚动
        if (container && !isElementInView(activeItem, container)) {
          const scrollTop = activeItem.offsetTop - container.clientHeight / 2 + activeItem.clientHeight / 2;
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }
    });
  }
}, 100);

// 添加锚点
const addAnchorLinks = () => {
  if (!props.rootSelector) return
  const headings = props.rootSelector.querySelectorAll('h1,h2,h3')
  headings.forEach((heading, index) => {
    const anchorLink = document.createElement('a')
    anchorLink.setAttribute('href', `#section-${index + 1}`)
    // anchorLink.textContent = heading.textContent; // 设置锚点文本为标题文本
    anchorLink.style.pointerEvents = 'none' // 设置 pointer-events 为 none，使链接不可点击
    // 设置标题的id属性
    heading.setAttribute('id', `section-${index + 1}`)

    // 将锚点链接插入到标题内
    heading.innerHTML = anchorLink.outerHTML + heading.innerHTML
  })
}

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const containerHeight = ref(0)
const headerHeight = ref(0)
const initHeight = () => {
  if (containerRef.value && headerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
    headerHeight.value = headerRef.value.clientHeight
  }
}

const init = () => {
  tableOfContents.value = generateTableOfContents()
  handleScroll(0)
  addAnchorLinks()

  if (props.rootSelector) {
    const scrollContainer = props.rootSelector.querySelector('.w-e-scroll');
    scrollContainer && scrollContainer.addEventListener('wheel', hanldleRootScroll)
  }
}

const hanldleRootScroll = () => {
  if (!props.rootSelector) return;
  const scrollContainer = props.rootSelector.querySelector('.w-e-scroll');
  if (scrollContainer) {
    const scrollTop = scrollContainer.scrollTop;
    handleScroll(scrollTop);
  }
}


onMounted(() => {
  initHeight()
  init()
})

onBeforeUnmount(() => {
  if (props.rootSelector) {
    const scrollContainer = props.rootSelector.querySelector('.w-e-scroll');
    scrollContainer && scrollContainer.removeEventListener('wheel', hanldleRootScroll)
  }
})

defineExpose({ init })
</script>

<style scoped>
.directory-container {
  position: relative;
  width: 300px;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 40px;
  background: #f1f1f1;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}

.close-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.table-of-contents {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.table-of-contents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.li-item {
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.li-item span {
  cursor: pointer;
  border-radius: 3px;
  padding: 2px 4px;
  transition: all 0.3s;
}

.li-item span:hover {
  background: #f0f0f0;
}

.li-item span.active {
  color: #1890ff;
  font-weight: bold;
}

.empty-container {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>
