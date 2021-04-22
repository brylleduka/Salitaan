<template>
  <v-layout
    column
    fill-height
    fluid
    class="message d-flex justify-between flex-column"
  >
    <v-layout style="height: 100%; width: 100%; overflow: hidden">
      <v-layout
        style="overflow-y: auto"
        class="message__container pa-2 d-flex justify-between flex-column-reverse"
      >
        <!-- <Message
          v-for="message in messages"
          :key="message._id"
          :message="message"
        /> -->
          <Message
          v-for="message in messages"
          :key="message._id"
          :message="message"
        />
      </v-layout>
    </v-layout>
    <compose-message :communityId="props.community" v-bind="{...props.community, ...props.channel}" :channelId="props.channel" ></compose-message>
  </v-layout>
</template>

<script>
import { useFind } from "feathers-vuex";
import { computed, onMounted, reactive } from "@vue/composition-api";

import Message from "@/components/Message";
import ComposeMessage from '../components/ComposeMessage.vue';
export default {
  components: {
    Message,
    ComposeMessage
  },
  props: {
    community: {
      type: Object
    },
    channel: {
      type: Object
    }
  },
  setup(props, context) {
    const { Message } = context.root.$FeathersVuex.api;
    const state = reactive({
        communityId: '',
        channelId: ''
    })

    // Messages
    const messagesParams = computed(() => {
      return {
        query: {
          communityId: props.community && props.community._id,
          channelId: (props.channel && props.channel._id )|| localStorage.getItem('channelId') ,
          $sort: { createdAt: 1 }
        }
      };
    });

    const { items: messages } = useFind({
      model: Message,
      params: messagesParams
    });


    onMounted(() => {
        state.communityId = props.community && props.community._id
        state.channelId = props.channel && props.channel._id
    })

    return {
      messages,
      props,
      state
    };
  }
};
</script>
