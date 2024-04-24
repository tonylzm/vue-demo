<template>
    <div class="header">
        <div class="logo">
            <img src="../page/login/th.jpg" alt="Image" style="width: 200px; height: auto;" />
        </div>
        <div class="user-info">
            <span class="username">
                <el-icon>
                    <UserFilled />
                </el-icon> 欢迎你: {{ username }}
                <el-select v-model="selectedOption" placeholder="操作" @change="handleOptionChange" class="custom-select">
                    <el-option label="退出登录" value="logout"></el-option>
                    <el-option label="切换登录" value="switchUser"></el-option>
                </el-select>
            </span>
        </div>
    </div>
</template>

<script>
import router from '../router'; // 导入Vue Router实例
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
            }
            this.selectedOption = ''; // 重置选择器的值
        },
        logout() {
            localStorage.clear();
            router.push('/4');
        },
        switchUser() {
            localStorage.clear();
            router.push('/4');
        }
    }
}
</script>

<style scoped>
.header {
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    /* 添加底部边框，模拟分割线效果 */
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
</style>