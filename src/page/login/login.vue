<template>
  <div class="body">
    <div class="login-page">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="login-title">登录</span>
        </div>
        <br />
        <div class="login-form">
          <div>
            <el-form-item label="用户名">
              <el-input placeholder="请输入用户名" v-model="loginUsername" required auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="密码">
              <el-input placeholder="请输入密码" type="password" v-model="loginPassword" required></el-input>
            </el-form-item>
          </div>
          <br />
          <div class="button-container">
            <el-button style="width:50%;margin-bottom:30px;" type="primary">登录</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>


<script>
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
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerPassword: ''
    };
  },
  methods: {
    login() {
      const hashedPassword = hashPassword(this.loginPassword);
      axios.post('http://localhost:9090/api/users/login', {
        username: this.loginUsername,
        password: hashedPassword
      }).then(response => {
        console.log('登录成功:', response.data);
        // 处理登录成功逻辑
      }).catch(error => {
        console.error('登录失败:', error);
        // 处理登录失败逻辑
      });
    },
    register() {
      const hashedPassword = hashPassword(this.registerPassword);
      axios.post('http://localhost:9090/api/users/register', {
        username: this.registerUsername,
        password: hashedPassword
      }).then(response => {
        console.log('注册成功:', response.data);
        // 处理注册成功逻辑
      }).catch(error => {
        console.error('注册失败:', error);
        // 处理注册失败逻辑
      });
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