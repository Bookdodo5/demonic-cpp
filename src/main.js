import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('cpp', cpp);

const app = createApp(App)
app.use(hljsVuePlugin)
app.mount('#app')