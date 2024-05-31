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
        }
    },

    created() {

    },
    methods: {

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
