<template>
  <div id="login">
    <div class="body">
      <div class="login-page">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="login-title">登录</span>
          </div>
          <br />
          <div class="login-form">
            <el-form :model="form" ref="loginForm">
              <el-form-item prop="name">
                <el-input type="text" name="name" v-model="form.loginUsername" auto-complete="off" placeholder="请输入用户名"
                  required>
                  <template #prepend>
                    <el-icon>
                      <User />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" name="password" v-model="form.loginPassword" auto-complete="off"
                  placeholder="请输入密码" required>
                  <template #prepend>
                    <el-icon>
                      <Lock />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 210px;" type="primary" @click="login" :loading="loading">登录</el-button>
                <el-button style="width: 110px;" @click="showRegistrationForm()">注册</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>

  <div id="register">
    <div class="body">
      <div class="login-page">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="login-title">注册</span>
          </div>
          <br />
          <div class="login-form">
            <el-form :model="form" ref="loginForm">
              <el-form-item prop="name">
                <el-input type="text" name="name" v-model="form.loginUsername" auto-complete="off" placeholder="请输入用户名"
                  required>
                  <template slot="prepend"><i style="font-size:20px" class="el-icon-user"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" name="password" v-model="form.loginPassword" auto-complete="off"
                  placeholder="请输入密码" required>
                  <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 210px;" type="primary" @click="handleLogin" :loading="loading">注册</el-button>
                <el-button style="width: 110px;" @click="showRegistrationForm()">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
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
      registerUsername: '',
      registerPassword: '',
      form: {
        loginUsername: '',
        loginPassword: ''
      }
    };
  },
  methods: {
    login() {
      //const hashedPassword = hashPassword(this.loginPassword);
      const hashedPassword = this.form.loginPassword;
      axios.post('https://localhost:8443/api/users/login', {
        username: this.form.loginUsername,
        password: hashedPassword
      }).then(response => {
        console.log('登录成功:', response.data);
        this.$message.success('登录成功');
        // 处理登录成功逻辑
        router.push('/'); // 替换 '/new-page' 为你想要跳转的页面路径
      }).catch(error => {
        console.error('登录失败:', error);
        // 处理登录失败逻辑
      });
    },
    register() {
      const hashedPassword = hashPassword(this.registerPassword);
      axios.post('https://localhost:8443/api/users/register', {
        username: this.registerUsername,
        password: hashedPassword
      }).then(response => {

        console.log('注册成功:', response.data);
        // 处理注册成功逻辑
      }).catch(error => {
        console.error('注册失败:', error);
        // 处理注册失败逻辑
      });
    },
    showRegistrationForm() {
      document.getElementById("login").style.display = "none";
      document.getElementById("register").style.display = "block";
    }
  }
};
</script>

<style scoped>
/* 样式 */
.body {
  background: linear-gradient(rgb(176, 180, 233), rgb(141, 193, 236), rgb(165, 212, 165));
}

.login-page {
  height: 100vh;
  display: flex;

  align-items: center;
  margin-left: 800px;
}

.login-title {
  font-size: 20px;
}

.box-card {
  width: 400px;
}

.button-container {
  text-align: center;
}
</style>