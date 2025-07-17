import WangeditorDirVue3 from './WangeditorDirVue3.vue'
import type { App, DefineComponent } from 'vue'

// 组件属性类型定义
export interface WangeditorDirProps {
  rootSelector: HTMLElement; // wangEditor根元素
  indentSize?: number; // 目录缩进间隔
  containerStyle?: Record<string, string>;
  itemStyle?: Record<string, string>;
  headerStyle?: Record<string, string>;
  activeStyle?: Record<string, string>;
}

// 组件暴露的方法
export interface WangeditorDirExpose {
  init: () => void;
}

// 组件实例类型
export interface WangeditorDirVue3Type extends DefineComponent<WangeditorDirProps> {
  install: (app: App) => void;
}

// 设置安装方法
WangeditorDirVue3.install = (app: App) => {
  app.component(WangeditorDirVue3.name as string, WangeditorDirVue3)
}

// 导出组件
export { WangeditorDirVue3 }