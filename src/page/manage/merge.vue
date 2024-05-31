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
            <el-table-column prop="classes" label="考试课程"></el-table-column>

            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button type="primary" @click="download(scope.row.name)" :disabled="scope.row.delete"><el-icon>
                            <Download />
                        </el-icon>
                        下载</el-button>
                    <el-button type="primary" @click="reload(scope.row.name)" :disabled="!scope.row.delete"><el-icon>
                            <Download />
                        </el-icon>
                        要求重传</el-button>
                </template>
            </el-table-column>
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
            name: '',
            direction: 'rtl',
            multipleSelection: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            uploadProgress: 0,
            progressColor: '',
            reason: '',
            college: JSON.parse(localStorage.getItem('user')).college,
        }
    },

    created() {
        this.loadData();

    },
    methods: {

        loadData() {
            let params = {
                college: this.college,
                pageNum: this.pageNum - 1,
                pageSize: this.pageSize
            }
            axios.get('/api/pigeonhole/find_all', {
                params: params,
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then(res => {
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = res.data.body;
                this.tableData = content;
                this.total = totalElements;
                this.pageNum = number + 1;
            })
        },
        download(name) {
            axios.get('/api/download/pigeonholeDownload', {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
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
                this.deleted(name);
                this.$message.success('下载成功');
                this.loadData();
            }).catch(error => {
                console.error('Error downloading file:', error);
                this.$message.error('下载失败');
            });
        },

        reload(name) {
            const data = {
                fileName: name
            }
            axios.post('/api/pigeonhole/reupload', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then(res => {
                this.loadData();
                this.$message.success('要求重传成功');

            })
        },

        deleted(name) {
            const data = {
                fileName: name
            }
            axios.post('/api/pigeonhole/delete', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then(res => {
                console.log(res);
            })
        },

        changeEnable(row) {
            console.log(row);
        },
        reset() {
            this.name = '';
        },


        handlePageChange(pageNum) {
            this.pageNum = pageNum;
            this.loadData();
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.loadData();
        },


    }
}


</script>

<style>
/* Your styles here */
</style>
