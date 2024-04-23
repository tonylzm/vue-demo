<template>
    <div>
        <h1>你好</h1>
        <el-radio-group v-model="direction">
            <el-radio label="ltr">从左往右开</el-radio>
            <el-radio label="rtl">从右往左开</el-radio>
            <el-radio label="ttb">从上往下开</el-radio>
            <el-radio label="btt">从下往上开</el-radio>
        </el-radio-group>

        <div>
            <el-button @click="innerDrawer">审批</el-button>
            <el-drawer v-model="drawer1" title="审批" :append-to-body="true" :before-close="handleClose" size="50%">
                <div>
                    <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
                        :percentage="uploadProgress"></el-progress>
                </div>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="考试名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="命题人">
                        <el-input v-model="form.real_name"></el-input>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <input type="radio" value="院长审核通过" v-model="approvalStatus"> 审批通过
                        <input type="radio" value="院长审核不通过" v-model="approvalStatus"> 审批不通过

                    </el-form-item>
                    <el-form-item>

                        <textarea v-if="approvalStatus === '院长审核不通过'" v-model="reason" placeholder="请输入不通过的原因"
                            style="width: 100%; height: 200px;"></textarea>
                    </el-form-item>



                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>

            </el-drawer>
        </div>

    </div>
</template>


<script>
import axios from 'axios';
import md5 from 'js-md5';
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
export default {
    data() {
        return {
            drawer1: false,
            approvalStatus: '院长审核通过',
            reason: '',
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
        };
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
        innerDrawer() {
            this.drawer1 = true;
        },
        onSubmit() {
            console.log(this.reason);
        },

    }
};
</script>