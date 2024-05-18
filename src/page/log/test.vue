<template>

    <div style="margin-bottom: 10px;">
        <el-button type="success" @click="connectWebSocket()">接收服务器日志</el-button>
        <el-button type="danger" @click="disconnectWebSocket()">终止服务器日志</el-button>
    </div>
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
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export default {
    data() {
        return {
            stompClient: null,
            messages: [],
            logs: [],
            errorlogs: [],
            warnlogs: [],
            i: "",
            j: "",
            k: "",
            l: ""
        };
    },
    created() {
        this.connectWebSocket();
        this.$message({
            message: '欢迎使用，如果离开页面请关闭连接',
            type: 'warning'
        });
    },
    beforeRouteLeave(to, from, next) {
        this.disconnectWebSocket();
        // 调用 next() 方法来确认路由切换。你可以传递 false 来取消路由切换，或者传递一个路由对象来重定向到一个新的路由。
        next();
    },
    methods: {
        connectWebSocket() {
            try {
                if (this.stompClient && this.stompClient.connected) {
                    console.log('WebSocket connection already established');
                    this.$message({
                        message: '连接已经建立',
                        type: 'warning'
                    });
                    return;
                } else {
                    this.$message({
                        message: '连接中，请稍后',
                        type: 'warning'
                    });
                }
                var socket = new SockJS('https://192.168.101.6:8443/websocket');
                this.stompClient = Stomp.over(socket);
                this.stompClient.connect({}, frame => {
                    this.stompClient.send('/app/hello', {}, JSON.stringify({ 'name': 'hello' }));
                    //设置定时器，每5秒发送一次消息
                    this.messageTimer = setInterval(() => {
                        try {
                            this.stompClient.send('/app/hello', {}, JSON.stringify({ 'name': 'hello' }));
                        } catch (error) {
                            console.error('An error occurred:', error);
                            this.$message({
                                message: '发送消息过程中发生错误，定时器已停止',
                                type: 'error'
                            });
                            clearInterval(this.messageTimer);
                        }
                    }, 5000);
                    this.stompClient.subscribe('/topic/messages', message => {
                        var messageBody = JSON.parse(message.body);
                        this.errorlogs = messageBody.logs.split('\n'); // 假设日志是以换行符分隔的
                        this.warnlogs = messageBody.warn_logs.split('\n');
                        this.i = messageBody.errorCount;
                        this.j = messageBody.warnCount;
                        this.k = messageBody.allCount;
                        this.l = messageBody.databaseCount;
                    });
                });
            } catch (error) {
                console.error('An error occurred:', error);
                this.$message({
                    message: '连接过程中发生错误',
                    type: 'error'
                });
            }
        },
        disconnectWebSocket() {
            try {
                //如果没有this.stompClient
                if (this.stompClient && this.stompClient.connected) {
                    clearInterval(this.messageTimer);
                    clearInterval(this.disconnectTimer);
                    //this.stompClient.send('/app/byb', {}, JSON.stringify({ 'name': 'byb' }));
                    //this.disconnectTimer = setInterval(() => {
                    this.stompClient.disconnect();
                    //}, 2000);
                    //所有定时器清除
                    //clearInterval(this.messageTimer);
                    this.$message({
                        message: '连接已经关闭',
                        type: 'warning'
                    });
                } else {
                    this.$message({
                        message: '连接已经关闭',
                        type: 'warning'
                    });
                }
            } catch (error) {
                console.error('An error occurred:', error);
                this.$message({
                    message: '连接过程中发生错误',
                    type: 'error'
                });
            }
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

<style scoped>
/* 样式 */
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
