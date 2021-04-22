<template>
  <v-layout>

    <v-form  @submit.prevent="onSubmit" class="chat-box d-flex justify-center">
      <v-text-field
        style="width: 100%"
        placeholder="Compose Message"
        outlined
        rounded
        v-model="message.text"
      ></v-text-field>
      <v-btn type="submit" icon large class="mt-2"><v-icon medium>mdi-send</v-icon></v-btn>
    </v-form>
  </v-layout>
</template>
<script>
import { reactive, ref, watchEffect, watch, onMounted, on } from '@vue/composition-api'
export default {
  props: {
    communityId: {
      type: Object
    },
    channelId: {
      type: Object
    }
  },
  setup(props, context) {
    const { $route } = context.root
    const { Message } = context.root.$FeathersVuex.api

    const state = reactive({
      text: '',
      communityId: '',
      channelId: ''
    })

    // watch(() =>  $route.params.id,(route) => {
    //     state.communityId = route
    //     return state.communityId
    // })
    const commRoute = () => { return $route.params.id};
    // const chanRoute = () =>  { return $route.query.ch};
  //   watch(commRoute, (route) => {
  //       console.log(route);
  //   })
  const commR = (route) => {
   state.communityId = route
  }
  watch(commRoute, commR, {immediate: true} )

// console.log(commRoute);
// console.log( $route.query.ch);

   
    const message = ref(new Message({
      text: state.text,
      communityId: $route.params.id || state.communityId,
      channelId: localStorage.getItem('channelId')
    }))

   function reset() {
      message.value = new Message({
       text: state.text,
       communityId: $route.params.id || state.communityId,
      channelId: localStorage.getItem('channelId')
    })
    }

  //   onMounted(() => {
  //       state.communityId = $route.params.id
  //       state.channelId = $route.query.ch 
  //   })

   const onSubmit = async () =>{
      if (!message.value.text) return
      try {
          const res = await message.value.save()
          reset()
      } catch (error) {
          console.log(error.message);
      }
    }

  


    // console.log('Community',$route.params.id);
    // console.log('Channel',$route.query.ch);
    return {
      state,
       message,
       onSubmit
    }

  },
}
</script>

<style lang="scss" scoped>
.chat-box{
    width: 100%;
    margin-top: 2em;
}
</style>