<template>
  <div class="common-layout">
      <el-container>
          <el-aside width="200px" >
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                  <el-sub-menu index="1">
                      <template #title>
                          <el-icon>
                              <location />
                          </el-icon>
                          <span>试卷管理</span>
                      </template>

                      <el-menu-item index="1-1" @click="switchPage">试卷上传</el-menu-item>
                      <el-menu-item index="1-2" >试卷审查</el-menu-item>

                      <!-- <el-sub-menu index="1-1">
                          <template #title>试卷审查</template>
                          <el-menu-item index="1-2-1">item one</el-menu-item>
                      </el-sub-menu> -->

                  </el-sub-menu>

                  <el-menu-item index="/">
                      <el-icon><document /></el-icon>
                      <span>Navigator Two</span>
                  </el-menu-item>

                  <!-- <el-menu-item index="3" disabled>
                      <el-icon>
                          <document />
                      </el-icon>
                      <span>Navigator Three</span>
                  </el-menu-item> -->

                  <el-menu-item index="4">
                      <el-icon>
                          <setting />
                      </el-icon>
                      <span>个人管理</span>
                  </el-menu-item>
              </el-menu>
          </el-aside>
          <el-main ><iframe :src="flowSrc" style="height:100%; width:100%;margin:0;border:0;" v-if="loading" ref="iframeId" id="myFrameId" name="myFrameName">
        </iframe>
      </el-main>
      </el-container>
  </div>
</template>
<style>
.common-layout {
    height: 800px;
}
.el-aside {
    height: 800px;
}
</style>
<script>


export default {
  data : function() {
      return {
        loading: true,
        flowSrc: '',
      };
      },
      methods:{
        switchPage:function (){
        var iframe=document.querySelector("iframe");
        iframe.src="/1";
      },
      }
}
</script>
