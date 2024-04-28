<template>
    <div>
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
            <el-button class="ml-5" type="primary" @click="loadData">搜索<el-icon>
                    <Search />
                </el-icon></el-button>
            <el-button type="warning" @click="reset">重置<el-icon>
                    <Refresh />
                </el-icon></el-button>
        </div>

        <div>
            <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26" :percentage="uploadProgress"
                :color="progressColor" :format="formatText"></el-progress>
        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="文件名称"></el-table-column>
            <el-table-column prop="produced" label="出卷人"></el-table-column>
            <el-table-column prop="size" label="文件大小(kb)"></el-table-column>
            <el-table-column prop="status" label="审核状态"></el-table-column>
            <el-table-column prop="class_check" label="审核的主任"></el-table-column>
            <el-table-column prop="college_check" label="审核的院长"></el-table-column>

            <el-table-column label="操作" width="200" align="center">
                <template v-slot="scope">
                    <el-button type="primary" @click="handleViewHistory(scope.row.name)"><el-icon>
                            <View />
                        </el-icon>
                        查看历史记录</el-button>
                </template>
            </el-table-column>
            <el-drawer v-model="innerDrawer" title="我的历史记录" :append-to-body="true" :before-close="handleClose"
                size="50%">
                <el-table :data="historyData" border>
                    <el-table-column prop="name" label="文件名称"></el-table-column>
                    <el-table-column prop="status" label="审核状态"></el-table-column>
                    <el-table-column prop="date" label="审核时间"></el-table-column>
                </el-table>
            </el-drawer>

        </el-table>
        <div style="padding: 10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="pageNum"
                :page-sizes="[2, 5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import md5 from 'js-md5';
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import { ElLoading } from 'element-plus';
export default {
    data() {
        return {
            tableData: [

            ],
            historyData: [

            ],
            name: '',
            direction: 'rtl',
            multipleSelection: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            previewModalVisible: false, // 控制模态框的显示/隐藏
            previewData: '', // 存储预览数据
            visible: false,
            username: JSON.parse(localStorage.getItem('user')).username,
            college: JSON.parse(localStorage.getItem('user')).college,
            uploadProgress: 0,
            showProgress: false, // 是否显示进度条 
            innerDrawer: false,
            drawer1: false,
            progressColor: '',
            timer: null,
            fullscreenLoading: false,
            canclick: false,
            ipAddress: '',
            approvalStatus: '院长审核通过',
            reason: '',
            checkfilename: '',
            checkfileproduced: '',
            form: {
                name: '',
                class: '',
                region: '',
                college: '',
                date1: '',
                date2: '',
                delivery: false,
                desc: ''
            },
            innerDrawer: false,
        }
    },

    created() {
        this.loadData();
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    if (this.form.delivery === false) {
                        this.form = {
                            name: '',
                            class: '',
                            region: '',
                            college: '',
                            date1: '',
                            date2: '',
                            delivery: false,
                            desc: ''
                        };
                    }
                    this.encryptedFile = null;
                    done();
                })
                .catch(_ => { });
        },

        onSubmit() {
            const data = {
                fileName: this.checkfilename,
                collegeCheck: this.username,
                status: this.approvalStatus,
                opinion: this.reason
            }
            console.log(data);
            axios.post('https://localhost:8443/api/checked/collegeChecked', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                console.log(response.data)
                this.$message.success('审批成功');
            }).catch(error => {
                console.error('Error loading data:', error);
                this.$message.error('审批失败');
            });
        },
        changeEnable(row) {
            console.log(row);
        },
        reset() {
            this.name = '';
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.drawer = false;
                    if (this.form.delivery === false) {
                        this.form = {
                            name: '',
                            class: '',
                            region: '',
                            college: '',
                            date1: '',
                            date2: '',
                            delivery: false,
                            desc: ''
                        };
                    }
                    this.encryptedFile = null;
                    this.countdown = 120;
                    clearInterval(this.timer);;
                    done();
                })
                .catch(_ => { });
        },

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
                const hashedPassword = this.encryptedAESKey;
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

                console.log(response.data);
                clearTimeout(timerId);
                loading.close();
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
        loadData() {
            axios.get('https://localhost:8443/api/files/pageByProduced', {
                params: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    produced: this.username,
                    name: this.name
                }
            }).then(response => {
                console.log(response.data)
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = response.data.body;
                console.log(content)
                this.tableData = content;
                this.tableData.forEach((item) => {
                    item.status = item.check.checkStatus;
                    item.class_check = item.check.classCheck;
                    item.college_check = item.check.collegeCheck;
                });
                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                console.error('Error loading data:', error);
            });
        },
        handlePageChange(pageNum) {
            this.pageNum = pageNum;
            this.loadData();
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.loadData();
        },
        decrpyt(name) {
            axios.post('https://localhost:8443/api/files/decrypt', null, {
                params: {
                    fileName: name
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        this.$message.success('验证成功');
                        //将该行的解密该试卷按钮变成不可点击
                        this.tableData.forEach((item) => {
                            if (item.name === name) {
                                item.decrypt = true;
                            }
                        });
                    }
                })
                .catch(error => {
                    // Handle errors here
                    this.$message.error('验证失败');
                });
        },
        preview(fileName, decrypt, produced) {
            axios.get(`https://localhost:8443/api/files/preview?fileName=${fileName}`, { responseType: 'blob' })
                .then(response => {
                    // 成功获取预览数据后，加载到 <iframe> 中预览	
                    const pdfData = new Blob([response.data], { type: 'application/pdf' });
                    const viewer = this.$refs.pdfViewer;
                    this.visible = true;
                    this.$nextTick(() => {
                        const viewer = this.$refs.pdfViewer;
                        console.log(1);
                        setTimeout(() => {
                            console.log(2);
                            viewer.src = URL.createObjectURL(pdfData);
                        }, 100); // 等待1秒后设置src
                    });
                    this.canclick = decrypt;
                    this.checkfilename = fileName;
                    this.checkfileproduced = produced;
                })
                .catch(error => {
                    this.$message.error('加载预览失败');
                });
        },
        handleViewHistory(rowData) {
            // 获取原行的文件名和出卷人信息
            const fileName = rowData;
            console.log(fileName)
            // 调用函数向后端发起请求
            this.fetchHistoryData(fileName);
            // 打开抽屉
            this.innerDrawer = true;
        }, fetchHistoryData(fileName) {
            const data = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                produced: this.username,
                name: fileName, // 使用传入的 fileName 参数
            }
            axios.post('https://localhost:8443/api/history/findHistoryfile', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                console.log(response.data)
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = response.data;
                console.log(content)
                this.historyData = content;

                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                console.error('Error loading data:', error);
            });
        },
    }
}
</script>

<style>
/* Your styles here */
</style>
