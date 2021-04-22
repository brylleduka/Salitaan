<template>
  <v-layout fill-height column class="d-flex pa-4 channel__container">
    <v-progress-linear
      :active="isPending"
      indeterminate
      color="teal"
    ></v-progress-linear>
    <v-list
      color="transparent"
      nav
      fluid
      min-width="100%"
      max-width="100%"
      class="ma-0 pa-0"
    >
      <v-list-item-group
        mandatory
        v-model="state.selectedItem"
        color="white"
        :value="state.selectedItem"
      >
        <v-list-item v-for="(channel, index) in channels" :key="channel._id">
          <v-list-item-content @click="getChannel(channel, index)">
            <v-list-item-title
              v-text="channel.name"
              class="item__title"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-layout>
</template>

<script>
import { useFind, useGet } from "feathers-vuex";
import { computed, onMounted, reactive, watch } from "@vue/composition-api";
export default {
  setup(props, context) {
    const { Channel } = context.root.$FeathersVuex.api;
    const { emit, root } = context;


    const state = reactive({
      selectedItem: 0,
      channelId: "",
      loading: false,
      channel: {}
    });

    const channelsParams = computed(() => {
      return {
        query: {
          $sort: { createdAt: 1 },
          communityId: context.root.$route.params.id
        }
      };
    });

    const { items: channels, isPending } = useFind({
      model: Channel,
      params: channelsParams
    });

    const communityId = () => context.root.$route.params.id
    const channelId = () => localStorage.getItem("channelId");

    const channel = async (id) => {
            return await useGet({
            model: Channel,
            id
    })}

    const fetchChannel = async (id) => {
        return state.channel = await channel(id)
    }
        
    watch(communityId, fetchChannel, {immediate: true, deep: true})
    

    const getChannel = (channel, index) => {
      // $router.push({path: $router.history.current.path , query: {ch: channel._id}})
      emit("getChannel", channel);
      localStorage.setItem("selectedItem", index);
      localStorage.setItem("channelId", channel._id);
    };

    onMounted(async () => {
      state.selectedItem = parseInt(localStorage.getItem("selectedItem"));
      state.channelId = localStorage.getItem("channelId");
      state.channel = await channel(channelId())
      await emit("getChannel", (state.channel));
    });

    return {
      channels,
      getChannel,
      state,
      isPending,
    };
  }
};
</script>
