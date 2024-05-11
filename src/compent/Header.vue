<template>
    <div v-show="pubulicshow()" class="header">
        <span class="username">
            <div class="logo">
                <img src="../page/login/logo.jpg" alt="Image" style="width: 200px; height: auto;" />
            </div>
            <div class="font">
                <p class="p">苏州科技大学试卷管理系统</p>
            </div>
        </span>
        <div class="user-info">
            <span class="username">
                <el-tag type="primary">
                    <el-icon>
                        <UserFilled />
                    </el-icon> 欢迎你: {{ username }}</el-tag>

                <el-tag type="success" style="margin-left: 10px;">
                    <el-button type="success" @click="refresh"><el-icon>
                            <Refresh />
                        </el-icon>刷新页面</el-button>
                </el-tag>
                <el-select v-model="selectedOption" placeholder="操作" @change="handleOptionChange" class="custom-select">
                    <el-option label="退出登录" value="logout"></el-option>
                    <el-option label="切换登录" value="switchUser"></el-option>
                    <el-option label="刷新页面" value="refresh"></el-option>
                </el-select>
            </span>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import router from '../router'; // 导入Vue Router实例
import { ElLoading } from 'element-plus';
export default {
    name: 'Header',
    data() {
        return {
            username: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : null,
        };
    },
    methods: {
        handleOptionChange() {//对账号的选择
            if (this.selectedOption === 'logout') {
                this.logout();
            } else if (this.selectedOption === 'switchUser') {
                this.switchUser();
            } else if (this.selectedOption === 'refresh') {
                this.refresh();
            }
            this.selectedOption = ''; // 重置选择器的值
        },
        logout() {
            const loading = ElLoading.service({
                lock: true,
                text: '正在注销登录，请稍等...',
                background: 'rgba(0, 0, 0,1)',
            });
            setTimeout(() => {
                router.push('/');
            }, 200);
            localStorage.clear();
            sessionStorage.clear();

            setTimeout(() => {
                window.location.reload();
            }, 500);


            setTimeout(() => {
                loading.close();
            }, 1000);

        },
        switchUser() {
            const loading = ElLoading.service({
                lock: true,
                text: '正在返回登录界面，请稍等...',
                background: 'rgba(0, 0, 0,1)',
            });
            setTimeout(() => {
                router.push('/');
            }, 200);
            localStorage.clear();
            sessionStorage.clear();
            setTimeout(() => {
                window.location.reload();
            }, 500);
            setTimeout(() => {
                loading.close();
            }, 1000);
        },
        refresh() {
            location.reload();
        },
        pubulicshow() {
            if (this.username !== null) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<style scoped>
.header {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    /* 添加底部边框，模拟分割线效果 */
    background-color: #0168B7;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.menu {
    margin-left: 20px;
    /* 添加左侧边距，与 Logo 分隔开 */
}

.user-info button {
    background-color: transparent;
    color: #333;
    border: none;
    cursor: pointer;
}

.custom-select {
    width: 80px;
    /* 设置选择框宽度 */
    margin-left: 15px;
    margin-right: 20px;
    /* 靠右对齐 */
}



.username {
    display: flex;
    align-items: center;
}

.username el-icon {
    margin-right: 5px;
    /* 调整图标与文字之间的间距 */
}

.logo {
    margin-left: 20px;
    /* 添加左侧边距，与 Logo 分隔开
    width: 15%; */

}

.p {
    color: #fff;
    font-size: 20px;
    /*与logo紧靠*/
    float: left;
    /*字体种类为微软雅黑*/
    font-family: "楷体";

}
</style>