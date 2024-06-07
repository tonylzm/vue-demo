<template>
    <div>
        <div style="margin: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
            <el-button class="ml-5" type="primary" @click="getallCourse">搜索<el-icon>
                    <Search />
                </el-icon></el-button>
            <el-button type="warning" @click="reset">重置<el-icon>
                    <Refresh />
                </el-icon></el-button>
        </div>

        <div style="display: flex; align-items: center;">
            <el-upload class="ml-5" action="#" :show-file-list="false" :before-upload="beforeUpload">
                <el-button type="success">课程导入<el-icon>
                        <Upload />
                    </el-icon>
                </el-button>
            </el-upload>

            <el-button type="success" @click="addcourse" style="margin-left: 10px;"> 新增课程<el-icon>
                    <Plus />
                </el-icon>
            </el-button>

            <el-button type="danger" @click="resetallcourse" style="margin-left: 10px;">重置所有课程<el-icon>
                    <Refresh />
                </el-icon>
            </el-button>

            <el-button type="danger" @click="resetallTeacher" style="margin-left: 10px;">重置老师<el-icon>
                    <Refresh />
                </el-icon>
            </el-button>


        </div>
        <!-- <div>
            <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26" :percentage="uploadProgress"
                :color="progressColor" :format="formatText"></el-progress>
        </div> -->

        <el-dialog title="新增课程" v-model="addcoursedialogVisible" width="30%">
            <el-form :model="courseForm">
                <el-form-item label="课程 ID">
                    <el-input v-model="courseForm.courseId"></el-input>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-input v-model="courseForm.courseName"></el-input>
                </el-form-item>
                <el-form-item label="任课老师">
                    <el-select v-model="selectedTeacher" filterable :filter-method="filterMethod" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.label" :label="item.label"
                            :value="item.selectedTeacher">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addcoursedialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitCourse">确定</el-button>
            </div>
        </el-dialog>

        <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="75"></el-table-column>
            <el-table-column prop="college" label="学院名称" width="200"></el-table-column>
            <el-table-column prop="course_id" label="课程编号" width="200"></el-table-column>
            <el-table-column prop="courseName" label="课程名称" width="300"></el-table-column>
            <el-table-column prop="courseTeacher" label="任课老师" width="200"></el-table-column>

            <el-table-column label="操作" width="300" align="center">
                <template v-slot="scope">
                    <el-button type="primary" @click="handleSelectTeacher(scope.row)"><el-icon>
                            <View />
                        </el-icon>
                        选择老师</el-button>

                    <el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                        icon-color="red" title="确定要删除这门课程吗？" @confirm="handledelete(scope.row.course_id)">
                        <template #reference>
                            <el-button type="danger" slot="reference"><el-icon>
                                    <Delete />
                                </el-icon>删除课程
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="请选择授课老师" v-model="dialogVisible">
            <el-form label-width="100px">
                <div class="course-info">
                    <el-form-item label="课程编号：" class="course-id">
                        <span>{{ selectedRow.course_id }}</span>
                    </el-form-item>
                    <el-form-item label="课程名称：" class="course-name">
                        <span>{{ selectedRow.courseName }}</span>
                    </el-form-item>
                </div>
                <el-form-item label="任课老师：" class="teacher-select">
                    <div style="width: 40%;">
                        <el-select v-model="selectedTeacher" filterable :filter-method="filterMethod" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.label" :label="item.label"
                                :value="item.selectedTeacher">
                            </el-option>
                        </el-select>

                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmTeacher">确定</el-button>
            </div>
        </el-dialog>

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

export default {
    data() {
        return {
            tableData: [
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
            dialogVisible: false, // 弹窗可见性
            selectedRow: {}, // 选中的行数据
            selectedTeacher: '', // 选中的老师
            alloptions: [],//获取所有的老师
            options: [],//取所有老师中的前10项
            addcoursedialogVisible: false,
            courseForm: {
                courseId: '',
                courseName: '',
                selectedTeacher: ''
            }
        }
    },
    created() {
        this.getallTeacher();
        this.getallCourse();
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
                    item.opinion = item.check.opinion;
                });
                // this.popoverContent = this.buildPopoverContent();
                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                console.error('Error loading data:', error);
            });
        },
        handlePageChange(pageNum) {
            this.pageNum = pageNum;
            this.getallCourse();
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getallCourse();
        },
        handleSelectTeacher(row) {
            this.selectedRow = row; // 将选中行的数据保存
            this.dialogVisible = true; // 打开弹窗
        },

        confirmTeacher() {
            // 在这里可以进行一些逻辑判断或数据处理
            const index = this.tableData.findIndex(item => item.course_id === this.selectedRow.course_id);
            if (index !== -1) {
                this.tableData[index].courseTeacher = this.selectedTeacher; // 更新表格数据中的任课老师信息
            }
            const data = {

                Id: this.selectedRow.course_id,
                teacher: this.selectedTeacher

            }
            axios.post('/api/course/update_teacher', data, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(response => {
                    if (response.data.body === "success") {
                        this.$message.success('更新成功');
                    } else {
                        this.$message.error('更新失败');
                    }
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    this.$message.error('更新出错了');
                });
            this.dialogVisible = false; // 关闭弹窗
        },

        handledelete(row) {
            const data = {
                course_id: row
            }
            axios.post('/api/course/delete_course', data,
                {
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    if (response.data.body === "success") {
                        this.$message.success('删除成功');
                        this.getallCourse();
                    } else {
                        this.$message.error('删除失败');
                    }
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    this.$message.error('课程删除时出错');
                });

        },
        beforeUpload(file) {
            // 获取文件后缀名
            const extension = file.name.split('.').pop().toLowerCase();
            // 判断文件类型是否为 Excel 文件
            if (extension !== 'xls' && extension !== 'xlsx') {
                this.$message.error('请上传 Excel 文件');
                return false; // 阻止上传
            }
            // 调用上传方法
            this.handleUpload(file);
            return false; // 阻止上传
        },

        handleUpload(file) {
            // 创建一个 FormData 对象
            const formData = new FormData();
            // 将文件添加到 FormData 对象中
            formData.append('file', file);
            formData.append('college', this.college);
            // 发送 POST 请求
            axios.post('/api/course/add_more_course', formData, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                }

            })
                .then(response => {
                    if (response.data.body === "success") {
                        this.$message.success('导入成功');
                        this.getallCourse();
                    } else {
                        this.$message.error('导入失败');
                    }
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    this.$message.error('上传文件时出错');
                });

        },
        resetallcourse() {
            const data = {
                college: this.college
            }
            axios.post('/api/course/delete_all', data, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then(response => {
                if (response.data.body === "success") {
                    this.$message.success('重置成功');
                    this.getallCourse();
                } else {
                    this.$message.error('重置失败');
                }
            })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    this.$message.error('课程重置时出错');
                });
        },

        resetallTeacher() {
            axios.post('/api/course/reset_all_teachers', {}, {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                }

            })
                .then(response => {
                    if (response.data.body === "success") {
                        this.$message.success('重置成功');
                        this.getallCourse();
                    } else {
                        this.$message.error('重置失败');
                    }
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    this.$message.error('老师重置时出错');
                });
        },

        getallCourse() {
            axios.get('/api/course/all_page', {
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                },
                params: {
                    pageNum: this.pageNum - 1,
                    pageSize: this.pageSize,
                    name: this.name,
                    college: this.college
                }
            }).then(response => {
                const {
                    content,
                    totalElements,
                    number
                } = response.data.body;
                console.log(content)
                this.tableData = content;

                // this.popoverContent = this.buildPopoverContent();
                this.total = totalElements;
                this.pageNum = number + 1;
            })
                .catch(err => {
                    console.log(err);
                })
        },
        getallTeacher() {
            axios.get('/api/users/get_teacher',
                {
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                    },
                    params: {
                        college: this.college
                    }
                })
                .then(res => {
                    const { userName, realName } = res.data.body;
                    this.alloptions = userName.map((name, index) => ({
                        selectedTeacher: name,
                        label: realName[index] + '(' + name + ')'
                    }));
                })
                .catch(err => {
                    console.log(err);
                })
        },
        filterMethod(query) {
            if (query == '') {
                this.options = this.alloptions.slice(0, 10); // 使用 this.options 而不是 options
            } else {
                let result = [];
                this.alloptions.forEach(val => { // 使用 this.options 而不是 options
                    if (val.label.indexOf(query) != -1) result.push(val);
                });
                this.options = result.slice(0, 10); // 只取前10个
            }
        },
        addcourse() {
            this.addcoursedialogVisible = true;
        },
        submitCourse() {
            const courseData = {
                college: this.college,
                course_id: this.courseForm.courseId,
                course_name: this.courseForm.courseName,
                course_teacher: this.selectedTeacher
            };
            axios.post('/api/course/add_course', courseData,
                {
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    if (response.data.body === "success") {
                        this.$message.success('新增成功');
                        this.getallCourse();
                        //关闭弹窗
                        this.addcoursedialogVisible = false;
                        //重置表单
                        this.resetForm();
                    } else {
                        this.$message.error('新增失败');
                    }
                })
                .catch(error => {
                    this.$message.error('课程增加时出错');
                });
        },
        resetForm() {
            this.courseForm = {
                courseId: '',
                courseName: '',
                selectedTeacher: ''
            };
        },
    }
}
</script>

<style>
.course-info {
    display: flex;
    justify-content: space-between;
}

.course-info .course-id,
.course-info .course-name {
    flex-basis: 48%;
    /* 或者根据需要设置固定宽度 */
}

.teacher-select {
    margin-top: 10px;
    /* 可根据需要调整上边距 */
}
</style>