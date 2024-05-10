<template>
    <div class="sidebar">
        <el-row class="tac">
            <el-col :span="50" :border="false" style="width: 190px;">
                <!-- <img src="../page/login/th.jpg" alt="Image" style="width: 200px; height: auto;margin-top: 0;" /> -->
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
                    </el-sub-menu>
                    <el-sub-menu v-show="show('check')" index="2">
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
                    <el-sub-menu v-show="show('college')" index="3">
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
                    <el-sub-menu v-show="show('college')" index="4">
                        <template #title>
                            <el-icon>
                                <Operation />
                            </el-icon>
                            <span>院长管理</span>
                        </template>
                        <el-menu-item-group title="院长管理">
                            <el-menu-item index="4-1" @click="gotoItemEight">院长管理</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="5">
                        <template #title>
                            <el-icon>
                                <UserFilled />
                            </el-icon>
                            <span>个人中心</span>
                        </template>
                        <el-menu-item-group title="个人中心">
                            <el-menu-item index="5-1" @click="gotoItemSeven">个人中心1</el-menu-item>
                            <el-menu-item index="5-2" @click="gotoItemNine">个人中心2</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user'))
        }
    },
    created() {

    },
    methods: {
        gotoItemOne() {
            this.$router.push('/files');
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
        gotoItemSeven() {
            this.$router.push('/teacher');
        },
        gotoItemEight() {
            this.$router.push('/collegeadmin')
        },
        gotoItemNine() {
            this.$router.push('/personalcentre')
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        show(role) {
            return this.user && this.user.role === role;
        }

    }
}
</script>

<style>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    padding-top: 80px;
    width: 190px;
}
</style>