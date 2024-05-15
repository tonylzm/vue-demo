<template>
    <div class="body">
        <div class="Box">
            <div class="left">
                <div class="centerBox">
                    <img src="../login/OIP.jpg" alt="">
                    <h4>苏州科技大学试卷管理系统</h4>
                    <p>USTS Paper Manage</p>
                </div>
            </div>
            <div class="right">
                <div>
                    <el-form>
                        <div>
                            <el-link type="primary" @click="countlogin">账号登录</el-link>
                            |
                            <el-link type="primary" @click="emaillogin">邮箱登录</el-link>
                        </div>
                        <div slot="header" class="clearfix">
                            <span class="login-title">登录</span>
                        </div>
                        <br />
                        <div v-show="countbox" class="loginbox">
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
                        </div>
                        <div v-show="emailbox" class="loginbox">
                            <el-form-item label="邮箱号" prop="email">
                                <el-input placeholder="请输入邮箱" v-model="email" clearable required>
                                    <template #prepend>
                                        <el-icon>
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="验证码" prop="code">
                                <el-input placeholder="请输入验证码" v-model="code" clearable required>
                                    <template #prepend>
                                        <el-icon>
                                            <Lock />
                                        </el-icon>
                                    </template>
                                    <template #append>
                                        <el-button type="primary" @click="codesend" :disabled="isSending"
                                            style="width: 60px">
                                            {{ isSending ? `${countdown}S` : '发送' }}
                                        </el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="loginBtn" @click="emailSubmit">登录</el-button>
                            </el-form-item>
                            <el-form-item>
                                <!-- <p class="no">没有账号？<el-link type="primary" @click="handleRegister">立即注册</el-link></p> -->
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import router from '../../router'; // 导入Vue Router实例
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ElLoading } from 'element-plus';

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
            email: '',
            code: '',
            ipAddress: '',
            countbox: true,
            emailbox: false,
            countdown: 60,
            isSending: false,
        };
    },
    created() {
    },
    methods: {
        countlogin() {
            this.$message({
                message: '切换到账号登录',
                type: 'warning'
            });
            this.countbox = true;
            this.emailbox = false;
        },
        emaillogin() {
            this.$message({
                message: '切换到邮箱登录',
                type: 'warning'
            });
            this.countbox = false;
            this.emailbox = true;
        },
        codesend() {
            if (this.isSending) return;
            this.isSending = true;
            axios.get('https://localhost:8443/api/email/register', {
                params: {
                    to: this.email
                }
            }).then(response => {
                console.log(response);
                if (response.data.code === 200) {
                    this.$message.success('验证码发送成功');
                    let timer = setInterval(() => {
                        if (this.countdown > 0) {
                            this.countdown--;
                        } else {
                            this.isSending = false;
                            this.countdown = 60;
                            clearInterval(timer);
                        }
                    }, 1000);
                } else {
                    this.$message.error('验证码发送失败');
                }
            }).catch(error => {
                this.$message.error('验证码发送失败');
            });


        },
        emailSubmit() {
            const data = {
                email: this.email,
                code: this.code
            }
            axios.post('https://localhost:8443/api/email/email_login', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
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
                    localStorage.setItem('refresh', true);
                    setTimeout(() => {
                        this.$message.info('欢迎使用试卷上传系统')
                        this.$message.info('如果资源布局混乱，请刷新页面')
                    }, 500);
                    router.push('/files'); // 替换 '/new-page' 为你想要跳转的页面路径
                } else {
                    this.$message.error('登录失败');
                    // 处理登录失败逻辑
                }
            }).catch(error => {
                console.error('登录失败:', error);
                // 处理登录失败逻辑
            });
        },
        async handleSubmit() {
            const data = await this.sendVerifyInfo();
            if (data == '非法登录') {
                this.$message.error('请检查你的IP地址');
                return;
            }
            const hashedPassword = hashPassword(this.password);
            //const hashedPassword = this.password;
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

                    localStorage.setItem('refresh', true);
                    setTimeout(() => {
                        this.$message.info('欢迎使用试卷上传系统')
                        this.$message.info('如果资源布局混乱，请刷新页面')
                    }, 500);
                    router.push('/files'); // 替换 '/new-page' 为你想要跳转的页面路径
                } else {
                    this.$message.error('登录失败');
                    // 处理登录失败逻辑
                }
            }).catch(error => {
                console.error('登录失败:', error);
                // 处理登录失败逻辑
            });
        },

        //向后端发送验证信息，信息为随机生成的字符串，包含用户名时间，ip地址等信息
        async sendVerifyInfo() {
            // 生成随机字符串和其他信息
            const loading = ElLoading.service({
                lock: true,
                text: '正在对你进行身份认证，请稍等...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            let timerId;
            // 定时器 ID
            try {
                // 处理后端的响应
                timerId = setTimeout(() => {
                    // 如果请求没有完成，更改加载文本  
                    loading.setText('网络开小差了，正在拼命加载...');
                }, 3000); // 2秒后触发
                const hashedPassword = "";
                const username = this.username;
                const time = this.getCurrentTime();
                const ipAddress = await this.getIPAddress(); // 这里假设你有一个获取 IP 地址的方法
                console.log(hashedPassword)
                // 构建发送给后端的数据
                const data = {
                    hashedPassword,
                    username,
                    time,
                    ipAddress
                    // 可以根据需要添加其他信息
                };

                // 发送 POST 请求给后端
                const response = await axios.post('https://localhost:8443/api/users/test', data);

                // 清除定时器
                clearTimeout(timerId);
                loading.close();
                this.countdown = 120;
                this.$message.success('验证成功');
                return response.data;

            } catch (error) {
                clearTimeout(timerId);
                loading.close();
                this.$message.error('非法登录');
                return '非法登录';
            }
        },

        async getIPAddress() {
            try {
                const response = await axios.get('http://ip-api.com/json/');
                //https://api.ipify.org/?format=json 也可以获取ip地址
                return response.data.query;
            } catch (error) {
                console.error('获取 IP 地址失败:', error);
                return null;
            }
        },
        getCurrentTime() {
            const currentTime = new Date();
            // 将时间格式化为字符串，你可以根据需要进行调整
            const formattedTime = currentTime.toISOString(); // 返回 ISO 格式的字符串，例如："2024-04-12T12:30:00.000Z"
            return formattedTime;
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
    height: 45px;

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
