import { App, Plugin } from 'vue';
import component from './wange-editor_dir_vue3.vue';
type InstallableComponent = typeof component & { install: Exclude<Plugin['install'], undefined> };

export default /*#__PURE__*/((): InstallableComponent => {
  const installable = component as unknown as InstallableComponent;
  installable.install = (app: App) => {
    app.component('WangeEditor_dir_vue3', installable);
  };
  return installable;
})();
