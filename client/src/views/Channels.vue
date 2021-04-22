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
        light
      >
        <v-list-item  v-for="(channel, index) in channels" :key="channel._id">
           <!-- <router-link
              :to="{ query: { ch: channel._id } }"
            > -->
          <v-list-item-content @click="getChannel(channel, index)">
            <v-list-item-title
              v-text="channel.name"
              class="item__title white--text"
            ></v-list-item-title>
          </v-list-item-content>
             <!-- </router-link> -->
        </v-list-item>
     
      </v-list-item-group>
    </v-list>
  </v-layout>
</template>

<script>
import { useFind, useGet } from "feathers-vuex";
import { computed,onMounted,ref, reactive } from "@vue/composition-api";

export default {
  setup(props, context) {
    const { Channel } = context.root.$FeathersVuex.api;
    const { emit } = context;
    // const state = reactive({
    //   selectedItem: localStorage.getItem('selectedItem') ? parseInt(localStorage.getItem('selectedItem')) : 0
    // })

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

    const getChannel = (channel, index) => {
      // localStorage.setItem("selectedItem", index)
      // localStorage.setItem("channelId", channel._id)
      // state.selectedItem = index
      emit("getChannel", channel);

    };


    return {
      channels,
      getChannel,
      isPending,
      // state,
    };
  }
};
</script>
