<template>
  <div >
    <p>{{ channel && channel._id }}</p>
    <p>{{ channel && channel.communityId }}</p>

  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from "@vue/composition-api";
export default {
  props: ["singleChannel"],
  setup(props) {

      const ch = ref(null)

      const channel = computed(() => {
          ch.value = props.singleChannel
          return ch.value
      })

    return {
     channel
    };
  }
};
</script>

<style></style>
