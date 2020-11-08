
import Vue from 'vue';
import { BaseMeta, BaseStory } from '@storybook/addons';
import VArticleCard, { Props } from './v-article-card.vue';

const meta: BaseMeta<Vue> = {
  title: 'v-article-card'
};

const Template: BaseStory< = (args, { argTypes }) => Vue.extend({
  components: { VArticleCard },
  template: '<VArticleCard />'
});

export default meta;
