<template>
	<div>
	  <h2>登录</h2>
	  <form @submit.prevent="login">
		<div>
		  <label>用户名：</label>
		  <input type="text" v-model="loginUsername" required>
		</div>
		<div>
		  <label>密码：</label>
		  <input type="password" v-model="loginPassword" required>
		</div>
		<button type="submit">登录</button>
	  </form>
  
	  <h2>注册</h2>
	  <form @submit.prevent="register">
		<div>
		  <label>用户名：</label>
		  <input type="text" v-model="registerUsername" required>
		</div>
		<div>
		  <label>密码：</label>
		  <input type="password" v-model="registerPassword" required>
		</div>
		<button type="submit">注册</button>
	  </form>
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
  </style>
  