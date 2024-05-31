<template>
    <div v-show="pubulicshow()" class="sidebar">
        <el-row class="tac">
            <el-col :span="50" :border="false" style="width: 190px;">
                <!-- <img src="../page/login/th.jpg" alt="Image" style="width: 200px; height: auto;margin-top: 0;" /> -->
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                    <el-sub-menu v-show="pubulicshow()" index="1">
                        <template #title>
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>试卷管理</span>
                        </template>
                        <el-menu-item-group title="试卷管理">
                            <el-menu-item index="1-1" @click="gotoItemOne">试卷上传</el-menu-item>
                            <el-menu-item index="1-2" @click="gotoItemTwo">试卷进度</el-menu-item>
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
                    <el-sub-menu v-show="pubulicshow()" index="5">
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
                    <el-sub-menu v-show="show('admin')" index="6">
                        <template #title>
                            <el-icon>
                                <Message />
                            </el-icon>
                            <span>日志中心</span>
                        </template>
                        <el-menu-item-group title="日志中心">
                            <el-menu-item index="6-1" @click="gotoItemTen">服务器日志</el-menu-item>
                            <el-menu-item index="6-2" @click="gotoItemEleven">服务器日志中心demo</el-menu-item>
                            <el-menu-item index="6-3" @click="gotoItemTwelve">系统日志</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu v-show="show('manage')" index="7">
                        <template #title>
                            <el-icon>
                                <MessageBox />
                            </el-icon>
                            <span>课程与归档管理</span>
                        </template>
                        <el-menu-item-group title="课程与归档管理">
                            <el-menu-item index="7-2" @click="gotoItemZero">课程分配</el-menu-item>
                            <el-menu-item index="7-3" @click="gotoItemthreeteen">归档管理</el-menu-item>
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
            user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
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
        gotoItemZero() {
            this.$router.push('/course');
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
        gotoItemTen() {
            this.$router.push('/log')
        },
        gotoItemEleven() {
            this.$router.push('/logt')
        },
        gotoItemTwelve() {
            this.$router.push('/syslog')
        },
        gotoItemthreeteen() {
            this.$router.push('/merge')
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        show(role) {
            console.log(this.user)
            return this.user && this.user.role === role;
        },
        pubulicshow() {
            if (this.user !== null) {
                return true
            } else {
                return false
            }
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
    height: 100%;
    border: 1px solid #d3d0d0;
    /*阴影*/
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>