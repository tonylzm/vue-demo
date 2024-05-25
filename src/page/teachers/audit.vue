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

            <el-table-column label="审批意见" align="center">
                <template v-slot="scope">
                    <el-button type="success" plain @click="open2(scope.row.opinion)">
                        <el-icon>
                            <View />
                        </el-icon>查看意见
                    </el-button>
                </template>
            </el-table-column>

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
                    <el-table-column label="审批意见" align="center">
                        <template v-slot="scope">
                            <el-button type="success" plain @click="open2(scope.row.opinion)">
                                <el-icon>
                                    <View />
                                </el-icon>查看意见
                            </el-button>
                        </template>
                    </el-table-column>
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
import { ElLoading } from 'element-plus';
export default {
    data() {
        return {
            tableData: [

            ],
            historyData: [

            ],
            name: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            visible: false,
            username: JSON.parse(localStorage.getItem('user')).username,
            college: JSON.parse(localStorage.getItem('user')).college,
            uploadProgress: 0,
            drawer1: false,
            progressColor: '',
            innerDrawer: false,
            // popoverContent: '',
        }
    },

    created() {
        this.loadData();
    },
    methods: {
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
                    done();
                })
                .catch(_ => { });
        },
        loadData() {
            axios.get('/api/files/pageByProduced', {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                },
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
                    item.opinion = item.check.opinion;
                });
                // this.popoverContent = this.buildPopoverContent();
                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                this.$message.error('加载数据失败');
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
            axios.post('/api/history/findHistoryfile', data, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = response.data;
                console.log(content)
                this.historyData = content;
                this.historyData.forEach((item) => {
                    item.opinion = item.check.opinion;
                });
                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                console.log(error);
            });
        },
        open2(opinion) {
            // setTimeout(() => {
            //     this.$notify({
            //         title: '审批意见',
            //         message: opinion ? opinion : '无',
            //         duration: 20000
            //     });
            // }, 0);
            // alert(opinion ? opinion : '无');
            this.$alert(opinion ? opinion : '无', '审核意见', {
                confirmButtonText: '确定',
                callback: action => {

                }
            });
        },
    }
}
</script>

<style>
/* Your styles here */
</style>
