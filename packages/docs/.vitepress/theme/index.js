import Badge from './components/Badge.vue';
import Badges from './components/Badges.vue';
import Layout from './components/Layout.vue';
import NotFound from './components/NotFound.vue';
import PreviewIframe from './components/PreviewIframe.vue';
import RenderTwig from './components/RenderTwig.vue';
import Stories from './components/Stories.vue';
import Story from './components/Story.vue';
import Tabs from './components/Tabs.vue';
import './custom.scss';

export default {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component('Badge', Badge);
    app.component('Badges', Badges);
    app.component('PreviewIframe', PreviewIframe);
    app.component('RenderTwig', RenderTwig);
    app.component('Stories', Stories);
    app.component('Story', Story);
    app.component('Tabs', Tabs);
  },
};
