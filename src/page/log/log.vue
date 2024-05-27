<template>
    <div class="contain">
        <el-card class="box-card" shadow="hover" style="background-color: #409EFF;" @click="handleCardClick2()">
            <div slot="header" class="clearfix">
                <span style="color: aliceblue;">所有操作日志</span>
                <!-- <el-button style="float: right">操作按钮</el-button> -->
            </div>
            <el-divider></el-divider>
            <div class=" text item">
                <p class="text">{{ k }}</p>
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="background-color: #F56C6C;" @click="handleCardClick1()">
            <div slot="header" class="clearfix">
                <span style="color: aliceblue;">错误日志</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <el-divider></el-divider>
            <div class="text item">
                <p class="text">{{ i }}</p>
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="background-color: #E6A23C;" @click="handleCardClick()">
            <div slot="header" class="clearfix">
                <span style="color: aliceblue;">警告日志</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <el-divider></el-divider>
            <div class="text item">
                <p class="text">{{ j }}</p>
            </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="background-color: #909399;">
            <div slot="header" class="clearfix">
                <span style="color: aliceblue;">数据库请求日志</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <el-divider></el-divider>
            <div class="text item">
                <p class="text">{{ l }}</p>
            </div>
        </el-card>
    </div>
    <div>
        <el-card class="box-card1" shadow="hover">
            <h1>日志信息</h1>
            <div class="log">
                <ul v-if="logs.length > 0">
                    <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
                </ul>
                <el-empty v-else description="请点击卡片查看相应日志输出"></el-empty>
            </div>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import echarts from 'echarts';
export default {
    data() {
        return {
            logs: [],
            errorlogs: [],
            warnlogs: [],
            i: "",
            j: "",
            k: "",
            l: ""
        };
    },
    mounted() {
        this.fetchLogs(); // 初始加载日志数据
        setInterval(this.fetchLogs, 60000); // 每隔一分钟请求一次数据
    },
    methods: {
        fetchLogs() {
            axios.get('/api/log/logs', {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                }
            }) // 这里的'/logs'应该是你后端接口的路径
                .then(response => {
                    this.errorlogs = response.data.logs.split('\n'); // 假设日志是以换行符分隔的
                    this.warnlogs = response.data.warn_logs.split('\n');
                    this.i = response.data.errorCount;
                    this.j = response.data.warnCount;
                    this.k = response.data.allCount;
                    this.l = response.data.databaseCount;
                })
                .catch(error => {
                    console.error('Error fetching logs:', error);
                });
        },
        handleCardClick() {
            // 在这里执行点击卡片时的操作
            // 比如触发一个方法、发送一个请求等等
            console.log('Card clicked');
            this.logs = this.warnlogs;

        },
        handleCardClick1() {
            // 在这里执行点击卡片时的操作
            // 比如触发一个方法、发送一个请求等等
            console.log('Card clicked');
            this.logs = this.errorlogs;

        },
        handleCardClick2() {
            // 在这里执行点击卡片时的操作
            // 比如触发一个方法、发送一个请求等等
            console.log('Card clicked');
            this.logs = [];

        },
    }
};
</script>
<style>
.text {
    font-size: 100px;
    color: aliceblue;
}

.contain {
    display: flex;
    width: 1300px;
    justify-content: space-around;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 300px;
    height: 300px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.7);
}

.box-card1 {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.7);
    margin-top: 20px;
    min-height: 500px;
}

.log {
    font-size: 15px;
}
</style>