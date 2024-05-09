<template>
    <h1 style="width: 15%;">个人信息</h1>
    <el-row class="left">
        <el-col>
            <div class="demo-basic--circle">
                <div class="block" v-for="size in  sizeList " :key="size">
                    <el-avatar shape="square" :size="size" :style="{ width: size, height: size }"
                        :src="squareUrl"></el-avatar>
                </div>
            </div>
        </el-col>
        <el-col style="margin-top: 50px;">
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

            </el-form>
            <div class="action-buttons">
                <el-button type="primary" @click="innerDrawer1 = true" round>编辑</el-button>
            </div>

        </el-col>
    </el-row>

    <div>
        <el-drawer v-model="innerDrawer1" title="编辑" :append-to-body="true" :before-close="handleClose" size="40%">
            <div>
                <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
                    :percentage="uploadProgress"></el-progress>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="max-width: 600px">
                <el-form-item label="用户名">
                    <el-input v-model="username" :disabled="true">{{ username }}</el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="email" :disabled="true">{{ email }}</el-input>
                </el-form-item>
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

        <div class="right">

            <el-calendar v-model="value" />
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
const value = ref(new Date())
function hashPassword(password) {
    const salt = '8nuWjDlIY5Aw+i7q5v04tQ=='; // 这里使用固定的 salt 值
    const keySize = 256 / 32; // 输出密钥的大小（单位：字节）
    const iterations = 1000; // 迭代次数
    const hashedPassword = CryptoJS.PBKDF2(password, salt, {
        keySize: keySize,
        iterations: iterations
    });
    return hashedPassword.toString(CryptoJS.enc.Hex);
}
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
            username: JSON.parse(localStorage.getItem('user')).username,
            phone: JSON.parse(localStorage.getItem('user')).tel,
            email: JSON.parse(localStorage.getItem('user')).email,
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
    mounted() {
        this.refreshResources();
    },

    methods: {
        //上传
        onSubmit() {
            // this.Upload();
            console.log(this.form.prepassword);
            console.log(this.form.newpassword);
            console.log(this.conpassword);
            //如果选择的是修改密码
            const hashedPassword = hashPassword(this.form.prepassword);
            const hashedPassword1 = hashPassword(this.form.newpassword);
            if (this.editOptions === '修改密码') {
                const data = {
                    username: this.username,
                    oldPassword: hashedPassword,
                    newPassword: hashedPassword1
                }
                axios.post('https://localhost:8443/api/users/updatePassword', data).then(response => {
                    console.log('修改密码成功:', response.data);
                    this.$message.success('修改密码成功');
                    this.innerDrawer1 = false;
                }).catch(error => {
                    console.error('修改密码失败:', error);
                    this.$message.error('修改密码失败');
                });
            }
        },
        refreshResources() {
            //刷新页面资源

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
<style>
.left {
    width: 15%;
    height: 100%;
    float: left;
    background-color: #fff;
}

.right {
    width: 85%;
    height: 100%;
    float: right;
}

.demo-basic--circle {
    display: flex;
    margin: 10px, auto, 0px, 50px;
    align-items: center;
    text-align: center;
}

.action-buttons {
    margin-top: 20px;
    text-align: center;
}
</style>