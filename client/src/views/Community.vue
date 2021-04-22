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
                            <p>{{commList && commList.name}}</p>
                            
                           
							<!-- <h4 v-if="state.community.item">{{ state.community.item.name }}</h4> -->
						</v-layout>

						<channels @getChannel="setChannel"/>
						<v-layout class="d-flex align-center pa-4 profile-container">
							<h4>Profile</h4>
						</v-layout>
					</v-layout>
              
				</v-col>
				<v-col class="col-7" style="background: #eee;height: 100%">
                    <!-- <test :singleChannel="singleChannel"></test> -->

                    <chat :singleChannel="singleChannel"></chat>
				</v-col>
				<v-col class="col-2" style="background: #000;height: 100vh">
					<v-layout>
						<div style="background: #000;height: 100vh"></div>
					</v-layout>
				</v-col>
			</v-row>
		</v-container>
	</v-layout>
</template>
<script>

import {  watch, ref, computed, reactive } from "@vue/composition-api"
import { useGet } from 'feathers-vuex'
import Channels from './Channels.vue'
import Test from '../components/Test.vue'
import Chat from './Chat.vue'

export default {
    components: {
        Channels,
        Test,
        Chat
    },
    setup(props, context) {
        const { Community } = context.root.$FeathersVuex.api
        const singleChannel = ref(null)
        const communityList = ref({})
    
      const setChannel = (channel) => {
            singleChannel.value = channel
        }

        const communityId = () => context.root.$route.params.id

        const getCommunity =  (id) => {
            return  useGet({
            model: Community,
            id
        })}

        const fetchCommunity =  async (id) => {
            const c = await getCommunity(id)
            communityList.value = c.item
            singleChannel.value = null
        }
        
        watch(communityId, fetchCommunity, {immediate: true, deep: true})
        // watch(singleChannel, () => {
        //     console.log("channel changed");
        // },{deep: true })

  
      
         const commList = computed(() => {
             communityList.value = getCommunity(communityId()).item.value
             return communityList.value
         })

  
        
        // console.log(state.channel);
        // onBeforeMount(async () => {
        //     const c = await getCommunity(communityId())
        //     console.log(c.item.value);
        // })

       
        // onMounted(() => {
        //     const c =  getCommunity(communityId())
        //     console.log(c.item.value);
        //     community.value = c.item.value
        // })

      
        
        return {
         
            setChannel,
            singleChannel,
            communityList,
            commList,
           
        }
    },
}
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