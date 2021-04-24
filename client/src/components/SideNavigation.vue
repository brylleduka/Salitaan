<template>
  <v-layout fill-height>
    <v-navigation-drawer class="nav__drawer" permanent width="100%">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title d-flex justify-center align-center">
            <router-link to="/">
           <h4 class="subtitle-1 white--text">Salitaan</h4>
           </router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-layout class="d-flex flex-column justify-center align-center my-1">
        <CommunityList />

        <v-avatar
          class="server__avatar server__add"
          size="52"
          @click="state.overlay = !state.overlay"
          ><v-icon medium class="icon">mdi-plus</v-icon></v-avatar
        >
         <member-community-list></member-community-list>
      </v-layout>
    </v-navigation-drawer>
    <!-- OVERLAY FORM -->
     <v-overlay opacity="0.6" :dark="false" color="#000" :value="state.overlay">
      <v-layout>
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
              Customize your community
            </v-card-title>

            <v-card-subtitle
              class="text--primary d-flex justify-center align-center flex-column"
            >
              <p class="text-center ma-0">
                Give your new community a personality with a name and icon.
              </p>
              <p class="text-center">You can always change it later</p>
            </v-card-subtitle>
          </v-card-text>
          <v-card-subtitle>
            <v-form
              ref="form"
              @submit.prevent="createCommunity"
              @keydown.prevent.enter
              lazy-validation
            >
              <v-text-field
                outlined
                v-model="community.name"
                label="Community Name"
                required
              ></v-text-field>
                <v-switch
                  v-model="community.public"
                  label="Public Community"
                ></v-switch>
              <div class="d-flex justify-end">
                <v-btn type="submit" color="primary">
                  Create
                </v-btn>
              </div>
            </v-form>
          </v-card-subtitle>
        </v-card>
      </v-layout>
     </v-overlay>
    <!-- END OVERLAY FORM -->

    
  </v-layout>
  
</template>

<script>
import { reactive, ref } from '@vue/composition-api'
import CommunityList from "./CommunityList"
import MemberCommunityList from './MemberCommunityList.vue'
export default {
    components: {
        CommunityList,
        MemberCommunityList
    },
    setup(props, context) {
        const state = reactive({
            overlay: false,
            community: {
                name: '',
                icon: '',
                public: false
            },
        })
        const { Community, Channel } = context.root.$FeathersVuex.api

        const community = ref(new Community(state.community))
        
        const reset = () => {
            community.value = new Community(state.community);
            state.overlay = false;
        }

        const createCommunity = async () => {
            if(!community.value.name) return;
            const commResult = await community.value.save()
           
            const channel = new Channel({name: 'general',communityId: commResult._id})
            await channel.save()
            reset()
        }


        return { 
            state,
            community,
            createCommunity,
       
        }
    },
}
</script>
<style lang="scss">

</style>