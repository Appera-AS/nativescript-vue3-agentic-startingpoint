<template>
  <GridLayout columns="*,auto,*">
    <ContentView col="1">
      <LottieView
        margin="5"
        verticalAlignment="center"
        horizontalAlignment="center"
        key="~/assets/lottie/spinner_gray.json"
        src="~/assets/lottie/spinner_gray.json"
        :width="size"
        :height="size"
        :loop="true"
        :autoPlay="true"
      />
    </ContentView>
  </GridLayout>
</template>

<script lang="ts" setup>
defineProps({
  size: { type: Number, default: 20 },
});
</script>
