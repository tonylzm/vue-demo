<template>
    <div>
      <button @click="openCamera">打开摄像头</button>
      <img v-if="cameraOn" :src="cameraUrl" alt="Camera Stream">
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cameraOn: false,
        cameraUrl: 'http://192.168.43.242:8081/',
      };
    },
    methods: {
      openCamera() {
        this.cameraOn = true;
      },
    },
  };
  </script>
  