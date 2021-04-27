<template>
  <v-layout>
    <v-form @submit.prevent="onSubmit(cha.communityId, cha._id)" class="chat-box d-flex justify-center pa-2">
      <v-text-field
        dense
        style="width: 98%"
        placeholder="Compose Message"
        outlined
        rounded
        v-model="state.text"
      ></v-text-field>
      <v-btn type="submit" icon small class="mt-2"
        ><v-icon medium>mdi-send</v-icon></v-btn
      >
    </v-form>
  </v-layout>
</template>
<script>
import {
  reactive,
  ref,
  watchEffect,
  watch,
  onMounted,
  on,
  computed,
} from "@vue/composition-api";
export default {
  props: ["channel"],
  setup(props, context) {
    const { Message } = context.root.$FeathersVuex.api;
    const state = reactive({
      text: "",
    });
    const ch = ref(null);
    const chid = ref("");
    const commid = ref("");

    const cha = computed(() => {
      ch.value = props.channel;
      return ch.value;
    });

    // watch(
    //   () => context.root.$route.query.ch,
    //   () => {
    //     chid.value = context.root.$route.query.ch;
    //     commid.value = context.root.$route.params.id;
    //   },
    // );

    // const message = ref(
    // new Message({
    //   text: state.text,
    //   communityId: context.root.$route.params.id,
    //   channelId: context.root.$route.query.ch
    // })
    // );
    // function reset() {
    //   message.value = new Message({
    //     text: state.text,
    //     communityId: context.root.$route.params.id,
    //     channelId: context.root.$route.query.ch,
    //   });
    // }

    async function onSubmit(communityId, channelId ) {
      console.log(state.text);
      if (!state.text) {
        return;
      }
      const message = new Message({
        text: state.text,
        communityId: communityId ? communityId : context.root.$route.params.id,
        channelId: channelId ? channelId : localStorage.getItem("channelId"),
      });

      const res = await message.save();
      console.log(res);
      // reset();
      state.text = ""
    }

    return {
      chid,
      commid,
      cha,
      state,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat-box {
  width: 100%;
}
</style>
