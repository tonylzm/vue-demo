<template>
  <div class="teacher-profile">
    <el-col>
      <div class="profile-photo">
        <img src="../../page/login/B8D76BE9E703B9C9903B96EDB95_F58EF816_3E65F.jpg" alt="Teacher Photo" />
      </div>
      <div class="profile-info">
        <h2 :class="{ 'gray-background': index % 2 !== 0 }">姓名: {{ teacher.realName }}</h2>
        <p :class="{ 'gray-background': (index + 1) % 2 !== 0 }">权限: {{ teacher.position }}</p>
        <p :class="{ 'gray-background': (index + 2) % 2 !== 0 }">所属院系: {{ teacher.department }}</p>
        <p :class="{ 'gray-background': (index + 3) % 2 !== 0 }">邮箱: {{ teacher.email }}</p>
        <p :class="{ 'gray-background': (index + 4) % 2 !== 0 }">联系电话: {{ teacher.phone }}</p>
        <div class="action-buttons">
          <el-button type="primary" @click="changepassword">修改密码</el-button>
          <el-button type="danger" @click="contactAdmin">联系管理员</el-button>
        </div>
      </div>
    </el-col>
    <el-drawer v-model="innerDrawer" title="修改密码界面" :append-to-body="true" :before-close="handleClose" size="40%">
      <el-form ref="passwordForm" :model="passwordForm" label-width="100px">
        <el-form-item label="当前账号:">
          <el-input style="width: 70%" v-model="username" disabled>
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template></el-input>
        </el-form-item>
        <el-form-item label="输入旧密码:">
          <el-input style="width: 70%" placeholder="请输入密码" v-model="passwordForm.password" show-password required>
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPassword">确认</el-button>
          <el-button @click="resetPassword">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer v-model="innerDrawer2" title="新密码修改界面" :append-to-body="true" :before-close="handleClose" size="40%">
      <el-form ref="passwordForm" :model="passwordForm" label-width="100px">
        <el-form-item label="当前账号:">
          <el-input style="width: 310px" v-model="username" disabled>
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>

        </el-form-item>
        <el-form-item label="输入新密码:" class="password-input">
          <el-input style="width: 310px" placeholder="输入新密码" maxlength="16" v-model="passwordForm.password"
            show-password required @input="validatePassword">
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
          <div class="password-description" :style="{ color: passwordValid ? 'green' : 'red' }">
            {{ passwordDescription }}
          </div>
        </el-form-item>

        <el-form-item label="确认新密码:" class="password-input">
          <el-input style="width: 310px" placeholder="确认新密码" maxlength="16" v-model="passwordForm.password2"
            show-password required @input="checkPasswordMatch">
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
            <template #suffix>
              <el-icon :name="passwordMatch ? 'el-icon-circle-check' : 'el-icon-circle-close'"
                :color="passwordMatch ? 'green' : 'red'"></el-icon>
            </template>
          </el-input>
          <div class="password-message" :class="{ 'text-success': passwordMatch, 'text-danger': !passwordMatch }">
            {{ passwordMessage }}
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitPassword2">确认</el-button>
          <el-button @click="resetPassword">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>



  </div>
  <div class="right">
    <el-calendar v-model="value" />
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
      teacher: {
        realName: JSON.parse(localStorage.getItem('user')).realName,
        position: JSON.parse(localStorage.getItem('user')).role,
        department: JSON.parse(localStorage.getItem('user')).college,
        email: JSON.parse(localStorage.getItem('user')).email,
        phone: JSON.parse(localStorage.getItem('user')).tel,
        photoUrl: 'path/to/teacher/photo.jpg', // 替换为实际的图片路径  
      },
      innerDrawer: false,//确认账号原密码界面
      innerDrawer2: false,//修改新密码界面
      username: JSON.parse(localStorage.getItem('user')).username,
      passwordForm: { // 表单数据对象，用于双向绑定密码输入框
        password: '', // 初始密码为空
        password2: ''
      },
      passwordMatch: false, // 初始化为不匹配状态
      passwordDescription: ''

    };
  },
  methods: {
    changepassword() {
      this.innerDrawer = true;
    },
    submitPassword() {
      const hashedPassword = hashPassword(this.passwordForm.password);
      axios.post('https://localhost:8443/api/users/login', {
        username: this.username,
        password: hashedPassword
      }).then(response => {
        if (response.data.code === 200) {
          this.$message.success('请输入你的新密码');
          // 清空密码输入框
          this.passwordForm.password = '';
          this.innerDrawer = false;//关闭当前抽屉
          this.innerDrawer2 = true;
        } else {
          this.$message.error('密码输入错误');
          // 清空密码输入框
          this.passwordForm.password = '';
        }
      }).catch(error => {
        console.error('密码输入错误:', error);
        // 处理失败逻辑
      });

    },
    checkPasswordMatch() {
      if (this.passwordForm.password === this.passwordForm.password2) {
        this.passwordMatch = true;
        this.passwordMessage = "密码一致";
      } else {
        this.passwordMatch = false;
        this.passwordMessage = "密码不一致";
      }
    },
    validatePassword() {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
      this.passwordValid = passwordRegex.test(this.passwordForm.password);

      if (this.passwordValid) {
        this.passwordDescription = '密码格式正确';
      } else {
        this.passwordDescription = '密码包含数字和字母，长度8到16';
      }
    },
    resetPassword() {
      // 重置密码输入框的方法，清空密码
      this.passwordForm.password = '';
      this.passwordForm.password2 = '';
    },
    submitPassword2() {
      const hashedPassword = hashPassword(this.passwordForm.password2);
      axios.post('https://localhost:8443/api/users/updatePassword2', {
        username: this.username,
        newPassword: hashedPassword
      }).then(response => {
        if (response.data === "修改成功") {
          this.$message.success('新密码修改成功');
          // 清空密码输入框
          this.passwordForm.password = '';
          this.passwordForm.password2 = '';
          this.innerDrawer2 = false;//关闭当前抽屉
        } else {
          this.$message.error('密码修改失败');
          // 清空密码输入框
          this.passwordForm.password = '';
          this.passwordForm.password2 = '';
        }
      }).catch(error => {
        console.error('修改失败:', error);
        // 处理失败逻辑
      });

    },
    contactAdmin() {
      // 联系管理员的逻辑  
      alert('正在联系管理员');
    },
  },
};  
</script>

<style scoped>
.teacher-profile {
  display: flex;
  align-items: flex-start;
  float: left;
  width: 20%;
  height: 100%;
}

.left {
  width: 100%;
  height: 100%;
  float: left;
}

.right {
  width: 80%;
  height: 100%;
  float: right;
}

.profile-photo {
  width: 200px;
  margin-right: 30px;
  float: left;
}

.profile-photo img {
  width: 100%;
  border-radius: 5px;
}

.profile-info {
  margin-top: 20px;
  width: 100%;
  float: left;
}

.action-buttons {
  margin-top: 20px;
  /* text-align: center; */
}

.password-message {
  text-align: right;
  /* 保证文本对齐到右侧 */
  margin-top: 5px;
  /* 适当的顶部间距 */
}

.text-success {
  color: green;
  /* 密码匹配时的文本颜色 */
}

.text-danger {
  color: red;
  /* 密码不匹配时的文本颜色 */
}

.password-input {
  display: flex;
  align-items: center;
}

/* .password-input .el-input {
    flex: 1; /* 让输入框占据剩余的空间 } */

.password-description,
.password-message {
  margin-left: 10px;
  /* 调整输入框和提示信息之间的间距 */
}
</style>