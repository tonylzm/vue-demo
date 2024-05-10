<template>
    <div class="body">
        <div class="Box">
            <div class="left">
                <div class="centerBox">
                    <img src="../login/OIP-C(7).jpg" alt="">
                    <h4>苏州科技大学试卷管理系统</h4>
                    <p>USTS Paper Manage</p>
                </div>
            </div>
            <div class="right">
                <el-form>
                    <div slot="header" class="clearfix">
                        <span class="login-title">登录</span>
                    </div>
                    <br />
                    <el-form-item label="账号" prop="username">
                        <el-input placeholder="请输入账号" v-model="username" clearable required>
                            <template #prepend>
                                <el-icon>
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <!-- <el-input type="password" v-model="password" placeholder="请输入密码" required></el-input> -->
                        <el-input placeholder="请输入密码" v-model="password" show-password required>
                            <template #prepend>
                                <el-icon>
                                    <Lock />
                                </el-icon>
                            </template></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="loginBtn" @click="handleSubmit">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <!-- <p class="no">没有账号？<el-link type="primary" @click="handleRegister">立即注册</el-link></p> -->
                    </el-form-item>
                </el-form>

            </div>
        </div>
    </div>
</template>
<script>
import router from '../../router'; // 导入Vue Router实例
import axios from 'axios';
import CryptoJS from 'crypto-js';
// 密码加密函数
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
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        handleSubmit() {
            //const hashedPassword = hashPassword(this.password);
            const hashedPassword = this.password;
            axios.post('https://localhost:8443/api/users/login', {
                username: this.username,
                password: hashedPassword
            }).then(response => {
                if (response.data.code === 200) {
                    this.$message.success('登录成功');
                    // 处理登录成功逻辑
                    //将用户信息保存到本地存储
                    localStorage.clear();
                    localStorage.setItem('user', JSON.stringify(response.data.body));
                    //将用户信息保存到sessionStorage
                    sessionStorage.clear();
                    sessionStorage.setItem('user', JSON.stringify(response.data.body));
                    router.push('/'); // 替换 '/new-page' 为你想要跳转的页面路径
                } else {
                    this.$message.error('登录失败');
                    // 处理登录失败逻辑
                }
            }).catch(error => {
                console.error('登录失败:', error);
                // 处理登录失败逻辑
            });
        },
        handleRegister() {
            // 处理注册逻辑，可以跳转至注册页面或显示注册表单  
        },
    },
};  
</script>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.body {
    height: 100vh;
    background-color: aquamarine;
    /* background: url("https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1") no-repeat; */
    background: url("@/page/login/IMG_20240425_192514.jpg") no-repeat;
    /* background: url("@/page/login/Screenshot_20240419_204337_com.huawei.photos.png") no-repeat; */
    background-size: cover;
}

.clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;

}

.Box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 680px;
    height: 330px;
    display: flex;
}

.left {
    position: relative;
    width: 40%;
    height: 100%;
    background-color: rgba(57, 99, 134, 0.75);
}

.right {
    position: relative;
    width: 60%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
}

.login-title {
    font-size: 20px;
}

.centerBox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    text-align: center;
}

.left img {
    width: 50px;
    height: 50px;
    margin-bottom: 5px;
}

.left p {
    font-size: 14px;
    color: #fff;
}

.left h4 {
    font-size: 18px;
    color: #fff;
    margin-bottom: 10px;
}

.right form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    text-align: center;
}

h3 {
    margin-bottom: 20px;
}

.input {
    width: 100%;
    height: 30px;
    border: 1px solid #767676;
    background-color: transparent;
    padding-left: 10px;
    font-size: 12px;
    color: #000000;
    margin-bottom: 15px;
    outline: none;
}

.loginBtn {
    width: 100%;
    height: 35px;
    line-height: 32px;
    text-align: center;
    font-size: 15px;
    color: #fff;
    border-radius: 6px;
    background: rgb(57, 99, 134);
    outline: none;
    border: none;
    margin-top: 10px;
}

.no {
    cursor: pointer;
    margin-top: 30px;
    text-align: center;
    font-size: 12px;
    color: #828282;
}
</style>
