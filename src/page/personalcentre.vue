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
                <!-- <el-form-item label="密码">
                    <el-input v-model="password" :disabled="true" show-password>{{ password }}</el-input>
                </el-form-item> -->
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
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="max-width: 600px">
                <el-form-item label="用户名">
                    <el-input v-model="username" :disabled="true">{{ username }}</el-input>
                </el-form-item>
                <!-- <el-form-item label="密码">
                    <el-input v-model="password" :disabled="true" show-password>{{ password }}</el-input>
                </el-form-item> -->
                <el-form-item label="手机号">
                    <el-input v-model="phone" :disabled="true">{{ phone }}</el-input>
                </el-form-item>
                <el-form-item label="">
                    <input type="radio" value="修改密码" v-model="editOptions"> 修改密码
                    <input type="radio" value="修改手机号" v-model="editOptions"> 修改手机号
                </el-form-item>
                <el-form-item label="输入原密码" v-if="editOptions === '修改密码'">
                    <el-input v-model="form.prepassword" show-password></el-input>
                </el-form-item>
                <el-form-item label="输入新密码" v-if="editOptions === '修改密码'" prop="newpassword">
                    <el-input v-model="form.newpassword" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" v-if="editOptions === '修改密码'" prop="conpassword">
                    <el-input v-model="form.conpassword" autocomplete="off" show-password></el-input>
                    <!-- <el-form>
                        <el-icon v-if="isPasswordMatch" class="check-icon" name="check" style="color: green;">
                            <Check />
                        </el-icon>
                    </el-form> -->

                </el-form-item>
                <el-icon></el-icon>
                <el-form-item label="输入新手机号" v-if="editOptions === '修改手机号'">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-drawer>
    </div>
</template>
  
<script>
export default {
    data() {
        // 校验密码
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.form.conpassword !== '') {
                    this.$refs.form.validateField('conpassword');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.newpassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            username: 'John Doe',
            password: '12345',
            phone: '1234567890',
            squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
            sizeList: ["150px"],
            innerDrawer1: false,
            form: {
                prepassword: '',
                newpassword: '',
                conpassword: '',
                phone: '',
            },
            editOptions: '',
            isPasswordMatch: false,
            rules: {
                newpassword: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                conpassword: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
            },

        };
    },

    methods: {
        //上传
        onSubmit() {
            // this.Upload();
            console.log(this.form.prepassword);
            console.log(this.form.newpassword);
            console.log(this.form.conpassword);
        },
        Upload() {
            // 构建 FormData 对象，用于发送文件
            const formData = new FormData();
            this.uploadProgress = 0;
            // 将需要加密的文件或文件信息放入 FormData 对象
            formData.append('info', JSON.stringify(this.form));
            var that = this;
            var xhr = new XMLHttpRequest();
            this.showProgress = true;
            xhr.open('POST', 'https://localhost:8443/api/upload/upload');
            // 上传完成后的回调函数
            xhr.onload = function () {
                if (xhr.status === 200) {
                    //弹出上传成功
                    that.$message.success('上传成功');
                    setTimeout(() => {
                        that.showProgress = false;
                    }, 1000);
                    that.loadData();
                    that.encryptedFile = null;
                    clearInterval(that.timer); // 上传成功后暂停计时
                    that.countdown = 120; // 重置倒计时
                } else {
                    that.progressColor = 'OrangeRed';
                    that.$message.error('上传失败！' + xhr.responseText);
                    setTimeout(() => {
                        that.showProgress = false;
                    }, 2000);
                    console.log('上传出错');
                }
            }
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    }
}
</script>