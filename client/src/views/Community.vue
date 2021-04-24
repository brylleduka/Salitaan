<template>
  <v-layout fill-height>
    <v-container fluid class="pa-0 ">
      <v-row no-gutters style="height: 100vh">
        <v-col class="col-3" style="height: 100%">
          <v-layout
            fill-height
            fluid
            class="pa-0 ma-0 community__container"
            column
          >
            <v-layout class="d-flex align-center pa-4 community__title">
              <p>{{ commList && commList.name }}</p>

              <!-- <h4 v-if="state.community.item">{{ state.community.item.name }}</h4> -->
            </v-layout>

            <channels @getChannel="setChannel" />
            <v-layout class="d-flex align-center pa-4 profile-container">
              <h4>Profile</h4>
            </v-layout>
          </v-layout>
        </v-col>
        <v-col class="col-7" style="background: #eee;height: 100%">
          <chat :singleChannel="singleChannel"></chat>
        </v-col>
        <v-col class="col-2" style="background: #000;height: 100vh">
          <v-layout>
            <div style="background: #000;height: 100vh"></div>
          </v-layout>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay opacity="0.7" :dark="false" color="#000" :value="(commList && commList.ownerId) === currentUser ? state.overlay = false : state.overlay">
      <v-layout >
        <v-card class="mx-auto" width="500" height="420" color="white">
          <v-card-actions class="d-flex justify-end ma-0 pa-0">
            <v-btn x-small text color="primary" @click="state.overlay = false">
              <v-icon x-small>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-card-title
              class="display-1 text-center d-flex justify-center align-center text--primary headline mb-4 mt-0"
            >
              Welcome to {{commList && commList.name}}
            </v-card-title>

            <v-card-subtitle
              class="text--primary d-flex justify-center align-center flex-column"
            >
              <p class="text-center ma-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
                placeat. Excepturi explicabo illo quidem, sapiente laborum iure
                delectus vitae facere dolorum consectetur sed, porro quam nobis
                in sunt earum neque.
              </p>
              <p class="text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem,
                placeat. Excepturi explicabo illo quidem, sapiente laborum iure
                delectus vitae facere dolorum consectetur sed, porro quam nobis
                in sunt earum neque.
              </p>
            </v-card-subtitle>
          </v-card-text>
          <v-card-subtitle>
            <v-form ref="form" lazy-validation>
              <div class="d-flex justify-end">
                <v-btn color="primary" class="mr-3">
                  Request to join
                </v-btn>
                <v-btn color="secondary">
                  Back
                </v-btn>
              </div>
            </v-form>
          </v-card-subtitle>
        </v-card>
      </v-layout>
    </v-overlay>
  </v-layout>
</template>
<script>
import { watch, ref, computed, reactive, onMounted } from "@vue/composition-api";
import { useGet } from "feathers-vuex";
import Channels from "./Channels.vue";
import Test from "../components/Test.vue";
import Chat from "./Chat.vue";

export default {
  components: {
    Channels,
    Test,
    Chat
  },
  setup(props, context) {
    const { $store } = context.root;
    const currentUser = $store.state.auth.user._id;
    const { Community } = context.root.$FeathersVuex.api;
 
    const singleChannel = ref(null);
    const communityList = ref({});
    const state = reactive({
        overlay: false
    })

    const setChannel = channel => {
      singleChannel.value = channel;
    };

    const communityId = () => context.root.$route.params.id;

    const getCommunity = id => {
      return useGet({
        model: Community,
        id
      });
    };

    const fetchCommunity =  async () => {
        // const c = await getCommunity(id)
        // communityList.value = c.item
        singleChannel.value = null
        state.overlay = true
    }

    const stopWatch = watch(communityId, fetchCommunity, {immediate: true, deep: true})
    // watch(singleChannel, () => {
    //     console.log("channel changed");
    // },{deep: true })

    const commList = computed(() => {
      communityList.value = getCommunity(communityId()).item.value;
      return communityList.value;
    });
  

    return {
      setChannel,
      singleChannel,
      communityList,
      commList,
      state,
      currentUser

    };
  }
};
</script>

<style lang="scss" scoped>
.community__container {
  background: rgb(54, 54, 54);
  color: #fff;
}
.channel__container {
  background: rgb(78, 78, 78);
}
</style>
