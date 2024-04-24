<template>
    <h1>个人信息</h1>
    <el-row>
        <el-col :span="3">
            <div class="demo-basic--circle">
                <div class="block" v-for="size in  sizeList " :key="size">
                    <el-avatar shape="square" :size="size" :style="{ width: size, height: size }"
                        :src="squareUrl"></el-avatar>
                </div>
            </div>
        </el-col>
        <el-col :span="12">
            <el-form :model="form" label-width="auto" style="max-width: 400px">
                <el-form-item label="用户名">
                    <el-input v-model="username" :disabled="true">{{ username }}</el-input>

                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="password" :disabled="true" show-password>{{ password }}</el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="phone" :disabled="true">{{ phone }}</el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="innerDrawer1 = true" round>编辑</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <div>
        <el-drawer v-model="innerDrawer1" title="编辑" :append-to-body="true" :before-close="handleClose" size="50%">
            <div>
                <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
                    :percentage="uploadProgress"></el-progress>
            </div>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="用户名">
                    <el-input v-model="username" :disabled="true">{{ username }}</el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="password" :disabled="true" show-password>{{ password }}</el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="phone" :disabled="true">{{ phone }}</el-input>
                </el-form-item>
                <el-form-item label="">
                    <input type="radio" value="修改密码" v-model="editOptions"> 修改密码
                    <input type="radio" value="修改手机号" v-model="editOptions"> 修改手机号
                </el-form-item>

                <el-form-item label="输入新密码" v-if="editOptions === '修改密码'">
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" v-if="editOptions === '修改密码'">
                    <el-input v-model="form.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="输入新手机号" v-if="editOptions === '修改手机号'">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>

        </el-drawer>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            username: 'John Doe',
            password: '********',
            phone: '1234567890',
            squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
            sizeList: ["150px"],
            innerDrawer1: false,
            form: {
                password: '',
                phone: '',
            },
            editOptions: '',


        };
    },
    methods: {
        openEditPassword() {
            this.editPasswordVisible = true;
            this.newPassword = '';
        },
        savePassword() {
            // 在此处实现密码修改逻辑
            this.password = this.newPassword;
            this.editPasswordVisible = false;
        }
    }
}
</script>