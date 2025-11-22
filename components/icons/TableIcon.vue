<template>
    <svg :width="props.size" :height="props.size" :fill="props.color"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>table</title> <path d="M18.76,6l2,4H3.24l2-4H18.76M20,4H4L1,10v2H3v7H5V16H19v3h2V12h2V10L20,4ZM5,14V12H19v2Z"></path> <rect width="24" height="24" fill="none"></rect> </g></svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color:{
        type:String,
        default:"#000000"
    },
    size:{
        type:Number,
        default:24
    }
})
</script>

<style scoped>

</style>