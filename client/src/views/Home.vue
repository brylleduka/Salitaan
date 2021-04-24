<template>
  <v-layout fill-height>
    <v-container fluid class="pa-0">
      <v-row no-gutters style="height: 100%">
        <v-col class="col-1" style="height: 100%">
          <div style="background: #ccc; height: 100%"></div>
        </v-col>
        <v-col class="col-10">
          <v-layout class="d-flex flex-start flex-wrap py-4 px-2">
            <v-container fluid>
              <v-row dense>
                <v-col
                  v-for="community in communities"
                  :key="community._id"
                  :cols="4"
                >
                  <v-card>
                    <v-img
                      src="https://cdn.vuetifyjs.com/images/cards/plane.jpg"
                      class="white--text align-end"
                      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                      height="200px"
                    >
                      <v-card-title class="subtitle-1" v-text="community.name"></v-card-title>
                    </v-img>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-layout>
        </v-col>
        <v-col class="col-1">
          <div style="background: #eee;height: 100%"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import { computed } from "@vue/composition-api";
import { useFind } from "feathers-vuex/dist";
export default {
  setup(props, context) {
    const { Community } = context.root.$FeathersVuex.api;

    const communitiesParams = computed(() => {
      return {
        query: {
          $sort: { createdAt: 1 }
        }
      };
    });
    const { items: communities, isPending } = useFind({
      model: Community,
      params: communitiesParams
    });

    return {
      communities,
      isPending
    };
  }
};
</script>
