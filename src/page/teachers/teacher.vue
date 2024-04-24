<template>  
  <div class="teacher-profile">  
    <div class="profile-photo">  
      <img src="../../page/login/xm.jpg" alt="Teacher Photo" />  
    </div>  
    <div class="profile-info">
    <h2 :class="{ 'gray-background': index % 2 !== 0 }">姓名: {{ teacher.realName }}</h2>
    <p :class="{ 'gray-background': (index + 1) % 2 !== 0 }">权限: {{ teacher.position }}</p>
    <p :class="{ 'gray-background': (index + 2) % 2 !== 0 }">所属院系: {{ teacher.department }}</p>
    <p :class="{ 'gray-background': (index + 3) % 2 !== 0 }">邮箱: {{ teacher.email }}</p>
    <p :class="{ 'gray-background': (index + 4) % 2 !== 0 }">联系电话: {{ teacher.phone }}</p>
    <div class="action-buttons">
      <el-button type="primary" @click="sendMessage">修改密码</el-button>
      <el-button type="danger" @click="contactAdmin">联系管理员</el-button>
    </div>
  </div>
  </div>  
</template>  
  
<script>

export default {  
  data() {  
    return {  
      teacher: {  
        realName: JSON.parse(localStorage.getItem('user')).realName, 
        position: JSON.parse(localStorage.getItem('user')).role,  
        department: JSON.parse(localStorage.getItem('user')).college,  
        email: 'zhangsan@example.edu',  
        photoUrl: 'path/to/teacher/photo.jpg', // 替换为实际的图片路径  
      },  
      index: 1,// 用于确定奇偶行
    };  
  },  
  methods: {  
    sendMessage() {  
      // 发送消息的逻辑  
      alert('正在发送消息给' + this.teacher.name);  
    },  
    viewCourses() {  
      // 查看课程的逻辑  
      alert('正在查看' + this.teacher.name + '的课程');  
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
  margin: 20px;  
}  
  
.profile-photo {  
  width: 200px;  
  margin-right: 30px;  
}  
  
.profile-photo img {  
  width: 100%;  
  border-radius: 5px;  
}  
  
.profile-info {
  margin-top: 20px;
} 
  
.action-buttons {  
  margin-top: 20px;  
  text-align: center;  
}  
</style>