<template>
    <div style="margin-left: 10px;">
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" v-model="name">
            </el-input>
            <el-button class="ml-5" type="primary" @click="loadData">搜索<el-icon>
                    <Search />
                </el-icon>
            </el-button>
            <el-button type="warning" @click="reset">重置<el-icon>
                    <Refresh />
                </el-icon></el-button>
        </div>
        <div style="margin: 10px 0">
            <el-button type="primary" @click="drawer = true">注册审核员<el-icon>
                    <Promotion />
                </el-icon></el-button>

            <el-drawer v-model="drawer" title="注册" :append-to-body="true" :before-close="handleClose" size="40%">
                <div style="margin-top: -20px;">
                    <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
                        :percentage="uploadProgress"></el-progress>
                </div>
                <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-form-item label="院系">
                        <el-input placeholder="请输入内容" v-model="form.college" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="real_name">
                        <el-input v-model="form.real_name" maxlength="6"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" autocomplete="off" show-password maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkpassword">
                        <el-input v-model="form.checkpassword" autocomplete="off" show-password
                            maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="tel">
                        <el-input v-model="form.tel" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认<el-icon>
                                <Upload />
                            </el-icon></el-button>
                        <el-button @click="resetForm('form')">重置<el-icon>
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
            <el-table-column prop="realName" label="真实姓名"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <!-- <el-table-column prop="password" label="密码"></el-table-column> -->
            <el-table-column prop="college" label="学院"></el-table-column>
            <el-table-column prop="tel" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>


            <el-table-column label="操作" width="300" align="center">
                <template v-slot="scope">
                    <el-button type="primary" @click="handleUpdata(scope.row.username, 'college')"><el-icon>
                            <Discount />
                        </el-icon>晋升院长</el-button>
                    <el-button type="warning" @click="handleUpdata(scope.row.username, 'user')"><el-icon>
                            <Bell />
                        </el-icon>降级</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row.username)"><el-icon>
                            <CloseBold />
                        </el-icon>删除</el-button>
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
<style></style>
<script>
import axios from 'axios';
import { ElLoading } from 'element-plus';
import CryptoJS from 'crypto-js';
// 密码加密函数
function hashPassword(password) {
    const salt = '8nuWjDlIY5Aw+i7q5v04tQ=='; // 这里使用固定的 salt 值
    const keySize = 256 / 32; // 输出密钥的大小（单位：字节）
    const iterations = 1000; // 迭代次数
    const hashedPassword = CryptoJS.PBKDF2(password, salt, {
        keySize: keySize,
        iterations: iterations
    });
    return hashedPassword.toString(CryptoJS.enc.Hex);
}
export default {
    data: function () {

        // 校验密码
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.form.checkpassword !== '') {
                    this.$refs.form.validateField('checkpassword');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            loading: true,
            flowSrc: '',
            drawer: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            name: '',
            form: {
                college: JSON.parse(localStorage.getItem('user')).college,
                real_name: '',
                username: '',
                password: '',
                checkpassword: '',
                tel: '',
                email: '',

            },
            rules: {
                real_name: [
                    {
                        required: true,
                        message: '请输入真实姓名',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5]+$/,
                        message: '姓名必须是中文',
                        trigger: 'blur'
                    }
                ],
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                        message: '用户名只能包含英文、中文、下划线',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' },
                    {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
                        message: '密码必须包含数字、英文且至少8位最长16位',
                        trigger: 'blur'
                    }
                ],
                checkpassword: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                tel: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[1-9]\d{10}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }
                ],
            },
        };
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
                    this.form = {
                        college: JSON.parse(localStorage.getItem('user')).college,
                        real_name: '',
                        username: '',
                        password: '',
                        checkpassword: '',
                        tel: '',
                        email: '',
                    };
                    done();
                })
                .catch(_ => { });
        },
        //提交注册方法
        handleUpdata(username, role) {
            console.log(username);
            const data = {
                Actor: this.realName,
                username: username,
                role: role
            }
            //弹出确认框
            this.$confirm('确认调整该用户权限？')
                .then(() => {
                    axios.post('/api/users/role', data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        this.$message.success('调整成功');
                        this.loadData();
                    }).catch(error => {
                        console.error('Error loading data:', error);
                        this.$message.error('调整失败');
                    });
                })
                .catch(() => {
                    this.$message.info('取消');
                });
        },
        onSubmit() {
            const loading = ElLoading.service({
                lock: true,
                text: '正在注册用户，请稍等...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            const hashedPassword = hashPassword(this.form.password);
            const data = {
                username: this.form.username,
                password: hashedPassword,
                realName: this.form.real_name,
                college: this.form.college,
                tel: this.form.tel,
                email: this.form.email,
            }
            axios.post('/api/users/check_register', data, {
                params: {
                    actor: this.realName
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(response.data)
                loading.close();
                this.$message.success('注册成功');
                this.loadData();
            }).catch(error => {
                console.error('Error loading data:', error);
                loading.close();
                this.$message.error('注册失败' + response.data);
            });
            console.log('submit!');
        },
        //后端返回用户列表
        loadData() {
            const data = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                college: JSON.parse(localStorage.getItem('user')).college,
                role: 'check',
                name: this.name
            }
            axios.post('/api/users/userrole', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = response.data.body;
                this.tableData = content;
                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                console.error('Error loading data:', error);
                this.$message.error('加载用户列表失败');
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
        //删除

        handleDelete(username) {
            console.log(username);
            const data = {
                username: username
            }
            //弹出确认框
            this.$confirm('确认删除该用户？')
                .then(() => {
                    axios.post('/api/users/delete', data, {
                        params: {
                            actor: this.realName
                        },
                    }).then(response => {
                        this.$message.success('删除成功');
                        this.loadData();
                    }).catch(error => {
                        console.error('Error loading data:', error);
                        this.$message.error('删除失败');
                    });
                })
                .catch(() => {
                    this.$message.info('取消删除');
                });
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    }
};
</script>
