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
            <el-button type="success" @click="exportToExcel">统计上传<el-icon>
                    <DataAnalysis />
                </el-icon></el-button>
            <el-button type="success" @click="exportToExcels">统计详细上传记录<el-icon>
                    <DataAnalysis />
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
            <el-table-column prop="classes" label="考试课程"></el-table-column>
            <el-table-column prop="testtype" label="考试类型"></el-table-column>
            <el-table-column prop="testtime" label="考试时间"></el-table-column>
            <el-table-column prop="size" label="文件大小(kb)"></el-table-column>
            <el-table-column label="下载">
                <template v-slot="scope">
                    <el-button type="primary" @click="download(scope.row.name)"><el-icon>
                            <Download />
                        </el-icon>
                        下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="加载预览">
                <template v-slot="scope">
                    <el-button type="primary"
                        @click="preview(scope.row.name, scope.row.decrypt, scope.row.produced, scope.row.uploadTime)">加载预览<el-icon>
                            <Monitor />
                        </el-icon></el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                        icon-color="red" title="开启后密码解开" @confirm="decrpyt(scope.row.name)">
                        <template #reference>
                            <el-button type="danger" slot="reference" :disabled="scope.row.decrypt">解密该试卷<el-icon>
                                    <Checked />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible="previewModalVisible" title="preview" width="50%">
            <!-- 在这里显示预览数据 -->
            <div v-html="previewData"></div>
            <!-- 或者根据实际情况使用其他方式显示预览数据 -->
            <!-- 例如：使用 <iframe> 标签加载预览数据 -->
            <iframe :src="pdfUrl" width="100%" height="600px"></iframe>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="previewModalVisible = false">Close</el-button>
            </span>
        </el-dialog>
        <div style="padding: 10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="pageNum"
                :page-sizes="[2, 5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-drawer v-model="visible" :show-close="false" size="50%">
            <template #header="{ close, titleId, titleClass }">
                <h4 :id="titleId" :class="titleClass">试卷预览</h4>
                <el-button type="danger" @click="close">
                    <el-icon class="el-icon--left">
                        <CircleCloseFilled />
                    </el-icon>
                    关闭
                </el-button>
                <div>
                    <el-button @click="innerDrawer = true" :disabled="!this.canclick">审批</el-button>
                    <el-drawer v-model="innerDrawer" title="试卷审批" :append-to-body="true" :before-close="handleClose">
                        <div>
                            <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
                                :percentage="uploadProgress"></el-progress>
                        </div>
                        <el-form ref="form" :model="form" label-width="120px">
                            <el-form-item label="考试名称">
                                <el-input v-model="checkfilename"></el-input>
                            </el-form-item>
                            <el-form-item label="命题人">
                                <el-input v-model="checkfileproduced"></el-input>
                            </el-form-item>
                            <el-form-item label="审批意见">
                                <input type="radio" value="系主任通过" v-model="approvalStatus"> 审批通过
                                <input type="radio" value="系主任不通过" v-model="approvalStatus"> 审批不通过
                            </el-form-item>
                            <el-form-item>
                                <textarea v-if="approvalStatus === '系主任不通过'" v-model="reason" placeholder="请输入不通过的原因"
                                    style="width: 100%; height: 200px;"></textarea>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">确认</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-drawer>
                </div>
            </template>
            <iframe ref="pdfViewer" style="width: 100%; height: 600px;" frameborder="0"></iframe>
        </el-drawer>
    </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import { ElLoading } from 'element-plus';
import * as XLSX from 'xlsx';
export default {
    data() {
        return {
            tableData: [
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
            realName: JSON.parse(localStorage.getItem('user')).realName,
            uploadProgress: 0,
            showProgress: false, // 是否显示进度条 
            innerDrawer: false,
            drawer1: false,
            progressColor: '',
            timer: null,
            fullscreenLoading: false,
            canclick: false,
            ipAddress: '',
            approvalStatus: '系主任通过',
            reason: '',
            checkfilename: '',
            checkfileproduced: '',
            uploadTime: '',
            form: {
                name: '',
                class: '',
                region: '',
                college: '',
                date1: '',
                date2: '',
                delivery: false,
                desc: ''
            }
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
                classCheck: this.realName,
                status: this.approvalStatus,
                opinion: this.reason,
                starttime: this.uploadTime
            }
            //console.log(data);
            axios.post('/api/checked/classChecked', data, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                //console.log(response.data)
                this.$message.success('审批成功');
                this.loadData();
                this.innerDrawer = false;
                this.visible = false;
            }).catch(error => {
                //console.error('Error loading data:', error);
                this.$message.error('审批失败');
                this.loadData();
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
                //console.log(hashedPassword)
                // 构建发送给后端的数据
                const data = {
                    hashedPassword,
                    username,
                    time,
                    ipAddress
                    // 可以根据需要添加其他信息
                };

                // 发送 POST 请求给后端
                const response = await axios.post('/api/users/test', data);

                //console.log(response.data);
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
            const data = qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                class_check: this.realName,
                status: "待审核",
                college: this.college,
                name: this.name,
                produced: this.username
            });

            axios.post('/api/checked/findClassCheckFile', data, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                //console.log(response.data)
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = response.data.body;
                //console.log(content)
                this.tableData = content;
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
        download(name) {
            axios.get('/api/download/download', {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token
                },
                params: {
                    filename: name
                },
                responseType: 'blob'
            }).then(response => {
                const a = document.createElement('a');
                const url = window.URL.createObjectURL(response.data);
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.$message.success('下载成功');
            }).catch(error => {
                console.error('Error downloading file:', error);
                this.$message.error('下载失败');
            });
        },
        decrpyt(name) {
            axios.post('/api/files/decrypt', null, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token
                },
                params: {
                    fileName: name,
                    Actor: this.realName
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
        preview(fileName, decrypt, produced, uploadTime) {
            axios.get(`/api/files/preview?fileName=${fileName}&Actor=${this.realName}`, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token
                },
                responseType: 'blob'
            })
                .then(response => {
                    // 成功获取预览数据后，加载到 <iframe> 中预览	
                    const pdfData = new Blob([response.data], { type: 'application/pdf' });
                    const viewer = this.$refs.pdfViewer;
                    this.visible = true;
                    this.$nextTick(() => {
                        const viewer = this.$refs.pdfViewer;
                        //console.log(1);
                        setTimeout(() => {
                            //console.log(2);
                            viewer.src = URL.createObjectURL(pdfData);
                        }, 100); // 等待1秒后设置src
                    });
                    this.canclick = decrypt;
                    this.checkfilename = fileName;
                    this.checkfileproduced = produced;
                    this.uploadTime = uploadTime;
                })
                .catch(error => {
                    this.$message.error('加载预览失败');
                });
        },
        exportToExcel() {
            // try {
            // 发送GET请求
            axios.get('/api/checked/findUploadFile', {
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                },
                params: {
                    college: this.college,
                },
            }
            ).then(response => {
                console.log(response.data.body);
                // // 处理响应数据
                const data = response.data.body;
                // 规范化数据
                const normalizedData = data.map(item => ({
                    "ID": item.id,
                    "文件名": item.name,
                    "上传者": item.produced,
                    "考试课程": item.classes,
                    "检查主任": item.check.classCheck,
                    "检查院长": item.check.collegeCheck,
                    "归属学院": item.college,
                    "审核状态": item.check.checkStatus,
                    "归档状态": item.pigeonhole ? "是" : "否",
                    "考试时间": item.testtime,
                    "考试类型": item.testtype,
                    "考试名称": item.testname,
                    "解密状态": item.decrypt ? "是" : "否",
                    "文件类型": item.type,
                    "文件大小(kb)": item.size,
                    "上传时间": item.uploadTime,
                    "检查意见": item.check.opinion,
                }));
                //创建工作表
                const worksheet = XLSX.utils.json_to_sheet(normalizedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                // 导出Excel文件
                XLSX.writeFile(workbook, "统计表.xlsx");
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        },

        exportToExcels() {
            // try {
            // 发送GET请求
            axios.get('/api/history/findCollegeHistoryfile', {
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                },
                params: {
                    college: this.college,
                },
            }
            ).then(response => {
                // // 处理响应数据
                const data = response.data.body;
                // 规范化数据
                const normalizedData = data.map(item => ({
                    "ID": item.id,
                    "文件名": item.name,
                    "上传者": item.produced,
                    "考试课程": item.classes,
                    "审核状态": item.status,
                    "审核间隔时间": item.intervalTime,
                    "审核意见": item.opinion,
                    "审核日期": item.date,
                    "所属学院": item.college,
                    "文件类型": item.type,
                    "文件大小": item.size,
                }));
                //创建工作表
                const worksheet = XLSX.utils.json_to_sheet(normalizedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                // 导出Excel文件
                XLSX.writeFile(workbook, "详细统计表.xlsx");
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        },

    }
}
</script>

<style>
/* Your styles here */
</style>
