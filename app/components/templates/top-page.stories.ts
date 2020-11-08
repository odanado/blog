import TopPage from './top-page.vue';

export default {
  title: 'templates/top-page'
};

export const Primary = () => ({
  components: { TopPage },
  template: '<TopPage><template v-slot:header>poyo</template></TopPage>'
});
