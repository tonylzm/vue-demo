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
                        <el-input placeholder="请输入内容" v-model="form.faculty" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="form.name"></el-input>
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
            <el-table-column prop="name" label="真实姓名"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="permission" label="用户权限"></el-table-column>
            <el-table-column label="下载">
                <template v-slot="scope">
                    <el-button type="primary" @click="download(scope.row.name)"><el-icon>
                            <Download />
                        </el-icon>
                        下载</el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="200" align="center">
                <template v-slot="scope">
                    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                        icon-color="red" title="开启后密码解开" @confirm="decrpyt(scope.row.name)">
                        <template #reference>
                            <el-button type="danger" slot="reference">验证出卷人身份 <el-icon>
                                    <Checked />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style></style>
<script>
export default {
    data: function () {
        return {
            loading: true,
            flowSrc: '',
            drawer: false,

            tableData: [{
                id: '1',
                name: '张天赐',
                username: 'ztc',
                password: '123',

            },],
            form: {
                faculty: '',
                name: '',
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
            // this.Upload();
            console.log('submit!');
        },
    }
}
</script>
