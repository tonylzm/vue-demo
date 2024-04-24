<template>
    <div>
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" v-model="name"></el-input>
            <el-button class="ml-5" type="primary" @click="loadData">搜索<el-icon>
                    <Search />
                </el-icon></el-button>
            <el-button type="warning" @click="reset">重置<el-icon>
                    <Refresh />
                </el-icon></el-button>
        </div>
        <div style="margin: 10px 0">
            <el-button type="primary" @click="drawer = true">注册<el-icon>
                    <Promotion />
                </el-icon></el-button>

            <el-drawer v-model="drawer" title="注册" :append-to-body="true" :before-close="handleClose" size="40%">
                <div style="margin-top: -20px;">
                    <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
                        :percentage="uploadProgress"></el-progress>
                </div>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="院系">
                        <el-input placeholder="请输入内容" v-model="form.college" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="form.real_name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="form.checkpassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认<el-icon>
                                <Upload />
                            </el-icon></el-button>
                        <el-button @click="handleClose">取消<el-icon>
                                <Close />
                            </el-icon></el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>

        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="real_name" label="真实姓名"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="colleage" label="学院"></el-table-column>


            <el-table-column label="操作" width="200" align="center">
                <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-table-column>
        </el-table>
    </div>
</template>
<style></style>
<script>
import axios from 'axios';
import { ElLoading } from 'element-plus';
export default {
    data: function () {
        return {
            loading: true,
            flowSrc: '',
            drawer: false,

            tableData: [{
                id: '1',
                real_name: '张天赐',
                username: 'ztc',
                password: '123',
                college: '电子与信息工程',

            },],
            form: {
                college: JSON.parse(localStorage.getItem('user')).college,
                real_name: '',
                username: '',
                password: '',
                checkpassword: '',

            },
        };
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
                    if (this.form.delivery === false) {
                        this.form = {
                            faculty: '',
                            name: '',
                            username: '',
                            password: '',
                            checkpassword: '',
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
        onSubmit() {
            const loading = ElLoading.service({
                lock: true,
                text: '正在注册用户，请稍等...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            const data = {
                username: this.form.username,
                password: this.form.password,
                realName: this.form.real_name,
                college: this.form.college,
            }
            axios.post('https://localhost:8443/api/users/check_register', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response.data)
                loading.close();
                this.$message.success('注册成功');
            }).catch(error => {
                console.error('Error loading data:', error);
                loading.close();
                this.$message.error('注册失败');
            });
            console.log('submit!');
        },
    }
}
</script>
