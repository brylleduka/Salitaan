<template>
  <v-layout fill-height>
    <v-container fluid class="pa-0">
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
        <v-col class="col-7" style="background: #eee; height: 100%">
          <chat :singleChannel="singleChannel"></chat>
        </v-col>
        <v-col class="col-2">
          <v-layout fill-height column>
            <v-layout column
              ><v-list
                color="transparent"
                dense
                fluid
                flat
                min-width="100%"
                max-width="100%"
                class="ma-0 pa-0"
                ><v-subheader>Owner</v-subheader></v-list
              ></v-layout
            >
            <v-layout fill-height column>
              <v-list
                color="transparent"
                dense
                fluid
                flat
                min-width="100%"
                max-width="100%"
                class="ma-0 pa-0"
              >
                <v-subheader>Members</v-subheader>
                <v-list-item
                  v-for="member in pendingActiveMembers(commList, true)"
                  :key="member._id"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="member.username"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="d-flex flex-row">
                    <!-- <v-btn icon>
                      <v-icon small color="green lighten-1">mdi-check</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon small color="red lighten-1">mdi-close</v-icon>
                    </v-btn> -->
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-layout>
            <v-divider></v-divider>
            <v-layout fill-height column>
              <v-list
                color="transparent"
                dense
                fluid
                flat
                min-width="100%"
                max-width="100%"
                class="ma-0 pa-0"
              >
                <v-subheader>Requests</v-subheader>
                <v-list-item
                  v-for="member in pendingActiveMembers(commList, false)"
                  :key="member._id"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="member.username"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="d-flex flex-row">
                    <v-form @submit.prevent="approve(commList, member._id)">
                      <v-btn icon type="submit">
                        <v-icon small color="green lighten-1">mdi-check</v-icon>
                      </v-btn>
                    </v-form>

                    <v-btn icon @click="deny(member._id)">
                      <v-icon small color="red lighten-1">mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-layout>
          </v-layout>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay
      opacity="0.7"
      :dark="false"
      color="#000"
      :value="
        (commList && commList.ownerId) === currentUser._id
          ? (state.overlay = false)
          : state.overlay
      "
    >
      <v-layout>
        <v-card class="mx-auto" width="500" height="420" color="white">
          <v-card-actions class="d-flex justify-end ma-0 pa-0">
            <!-- <v-btn x-small text color="primary" @click="state.overlay = false">
              <v-icon x-small>mdi-close</v-icon>
            </v-btn> -->
          </v-card-actions>
          <v-card-text>
            <v-card-title
              class="display-1 text-center d-flex justify-center align-center text--primary headline mb-4 mt-0"
            >
              Welcome to {{ commList && commList.name }}
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
            <v-form
              ref="form"
              lazy-validation
              @submit.prevent="
                commList ? reqToJoin(commList._id, currentUser._id) : null
              "
            >
              <div class="d-flex justify-end">
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-3"
                  v-if="!checkIfAlreadyReq(commList, currentUser._id)"
                >
                  Request to join
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-3"
                  v-else
                  :disabled="
                    checkIfAlreadyReq(commList, currentUser._id) ? true : false
                  "
                >
                  Requested already
                </v-btn>
                <v-btn color="secondary" to="/"> Back </v-btn>
              </div>
            </v-form>
          </v-card-subtitle>
        </v-card>
      </v-layout>
    </v-overlay>
  </v-layout>
</template>
<script>
import { watch, ref, computed, reactive } from "@vue/composition-api";
import { useGet } from "feathers-vuex";
import Channels from "./Channels.vue";
import Test from "../components/Test.vue";
import Chat from "./Chat.vue";

export default {
  components: {
    Channels,
    Test,
    Chat,
  },
  setup(props, context) {
    const { $store } = context.root;
    const currentUser = $store.state.auth.user;
    const { Community } = context.root.$FeathersVuex.api;

    const singleChannel = ref(null);
    const communityList = ref({});
    const checkReq = ref(null);
    const state = reactive({
      overlay: false,
    });

    const setChannel = (channel) => {
      singleChannel.value = channel;
    };

    const communityId = () => context.root.$route.params.id;

    const getCommunity = (id) => {
      return useGet({
        model: Community,
        id,
      });
    };

    const fetchCommunity = async () => {
      // const c = await getCommunity(id)
      // communityList.value = c.item
      singleChannel.value = null;
      state.overlay = true;
    };

    watch(communityId, fetchCommunity, { immediate: true, deep: true });
    // watch(singleChannel, () => {
    //     console.log("channel changed");
    // },{deep: true })

    const commList = computed(() => {
      communityList.value = getCommunity(communityId()).item.value;
      return communityList.value;
    });

    const reqToJoin = async (id, _id) => {
      const joinCommunity = new Community({
        id,
        members: { _id },
        query: { add: true },
      });
      return await joinCommunity.patch();
    };

    const checkIfAlreadyReq = (commList, authUser) => {
      const computedReq = computed(() => {
        if (commList && Array.isArray(commList.members)) {
          const member = commList.members.find((m) => m._id === authUser);

          return member;
        }
      });

      return computedReq.value;
    };

    const pendingActiveMembers = (community, membership) => {
      const computedPendingActive = computed(() => {
        if (community && Array.isArray(community.userMembers)) {
          const members = community.userMembers.filter(
            (member) => member.membership === membership,
          );

          return members;
        }
      });

      return computedPendingActive.value;
    };

    const approve = async (community, _id) => {
      const data = { members: { _id } };
      let params = {
        query: {
          approve: true,
        },
      };
      const result = await $store.dispatch("communities/patch", [community && community._id, data, params]);
      // const approveMember = new Community({
      //   id: community && community._id, members: { _id },
      // });
      return result
      // approveMember;
      // return await approveMember.patch({data: {params: {query: {approve: true}}}});
    };

    const deny = (id) => {
      console.log(id);
    };

    return {
      setChannel,
      singleChannel,
      commList,
      state,
      currentUser,
      reqToJoin,
      checkIfAlreadyReq,
      pendingActiveMembers,
      approve,
      deny,
    };
  },
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
