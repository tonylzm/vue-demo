<template>  
  <div class="teacher-profile">  
    <div class="profile-photo">  
      <img :src="src/page/login/Screenshot_20240419_204337_com.huawei.photos.png" alt="Teacher Photo" />  
    </div>  
    <div class="profile-info">  
      <h2>姓名:{{ teacher.name }}</h2>  
      <p>职位:{{ teacher.position }}</p>  
      <p>现居住:{{ teacher.department }}</p>  
      <p>邮箱:{{ teacher.email }}</p>  
      <p>联系电话:{{ teacher.email }}</p>
      <div class="action-buttons">  
        <el-button type="primary" @click="sendMessage">修改密码</el-button>  
        <el-button type="primary" @click="sendMessage">发送消息</el-button>  
        <el-button type="text" @click="viewCourses">查看课程</el-button>  
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
        name: '张三',  
        position: '副教授',  
        department: '计算机科学系',  
        email: 'zhangsan@example.edu',  
        photoUrl: 'path/to/teacher/photo.jpg', // 替换为实际的图片路径  
      },  
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
  flex: 1;  
}  
  
.action-buttons {  
  margin-top: 20px;  
  text-align: center;  
}  
</style>