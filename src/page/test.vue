<template>
    <el-button type="primary" @click="openFullScreen1" v-loading.fullscreen.lock="fullscreenLoading">
        指令方式
    </el-button>
    <el-button type="primary" @click="openFullScreen2">
        服务方式
    </el-button>
</template>

<script>
import { ElLoading } from 'element-plus'
export default {
    data() {
        return {
            fullscreenLoading: false
        }
    },
    methods: {
        openFullScreen1() {
            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
            }, 2000);
        },
        openFullScreen2() {
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(() => {
                loading.close()
            }, 2000)
        }
    }
}
</script>