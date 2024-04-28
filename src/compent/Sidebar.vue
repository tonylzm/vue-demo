<template>
    <div class="sidebar">
        <el-row class="tac">
            <el-col :span="50" :border="false">
                <img src="../page/login/th.jpg" alt="Image" style="width: 200px; height: auto;margin-top: 0;" />
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>试卷管理</span>
                        </template>
                        <el-menu-item-group title="试卷管理">
                            <el-menu-item index="1-1" @click="gotoItemOne">试卷上传</el-menu-item>
                            <el-menu-item index="1-2" @click="gotoItemTwo">试卷查验</el-menu-item>
                        </el-menu-item-group>
                        <!-- <el-menu-item-group title="Group Two">
                            <el-menu-item index="1-3">item three</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="1-4">
                            <template #title>item four</template>
                            <el-menu-item index="1-4-1">item one</el-menu-item>
                        </el-sub-menu> -->
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <Menu />
                            </el-icon>
                            <span>试卷审核(主任)</span>
                        </template>
                        <el-menu-item-group title="试卷审核(主任)">
                            <el-menu-item index="2-1" @click="gotoItemThree">试卷审核</el-menu-item>
                            <el-menu-item index="2-2" @click="gotoItemFour">用户管理</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <Menu />
                            </el-icon>
                            <span>试卷审核(院长)</span>
                        </template>
                        <el-menu-item-group title="试卷审核(院长)">
                            <el-menu-item index="3-1" @click="gotoItemFive">试卷审核</el-menu-item>
                            <el-menu-item index="3-2" @click="gotoItemSix">用户管理</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <!-- <el-menu-item index="3" disabled>
                        <el-icon>
                            <document />
                        </el-icon>
                        <span>Navigator Three</span>
                    </el-menu-item> -->
                    <el-menu-item index="4" @click="gotoItemThree">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <span>个人中心</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    created() {
        // 在组件创建时获取用户权限信息
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : null;
        this.hasPermission = user && user.role === 'user'; // 假设只有管理员有权限访问
    },
    methods: {
        gotoItemOne() {
            this.$router.push('/');
        },
        gotoItemTwo() {
            this.$router.push('/audit');
        },
        gotoItemThree() {
            this.$router.push('/class');
        },
        gotoItemFour() {
            this.$router.push('/classadmin');
        },
        gotoItemFive() {
            this.$router.push('/college');
        },
        gotoItemSix() {
            this.$router.push('/administrotor');
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }

    }
}
</script>

<style>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    padding-top: 10px;
    width: auto;
}
</style>