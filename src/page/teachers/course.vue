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
            <el-table-column type="selection" width="75"></el-table-column>
            <el-table-column prop="id" label="课程编号" width="250"></el-table-column>
            <el-table-column prop="name" label="课程名称" width="400"></el-table-column>
            <el-table-column prop="produced" label="任课老师" width="400"></el-table-column>

            <el-table-column label="操作"  align="center">
        <template v-slot="scope">
          <el-button type="primary" @click="handleSelectTeacher(scope.row)"><el-icon>
              <View />
            </el-icon>
            选择老师</el-button>
        </template>
      </el-table-column>
        </el-table>

    <el-dialog title="请选择授课老师" v-model="dialogVisible">
    <el-form label-width="100px">
    <div class="course-info">
    <el-form-item label="课程编号：" class="course-id">
        <span>{{ selectedRow.id }}</span>
    </el-form-item>
    <el-form-item label="课程名称：" class="course-name">
        <span>{{ selectedRow.name }}</span>
    </el-form-item>
    </div>
    <el-form-item label="任课老师：" class="teacher-select">
    <div style="width: 40%;">
    <el-select v-model="selectedTeacher" placeholder="请选择老师">
      <el-option v-for="teacher in teachers" :key="teacher.id" :label="teacher.name" :value="teacher.name">
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
            tableData: [ // 假设这是你的表格数据
        { id: 1, name: '课程A', produced: '老师1' },
        { id: 2, name: '课程B', produced: '老师2' },
        // 其他行...
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
            teachers: [ // 所有老师的数据，假设从后端获取
            { id: 1, name: '老师1' },
            { id: 2, name: '老师2' },
        // 其他老师...
            ],
            selectedTeacher: '' // 选中的老师
        }
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
        }, 
        fetchHistoryData(fileName) {
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
                this.historyData.forEach((item) => {
                    item.opinion = item.check.opinion;
                });
                this.total = totalElements;
                this.pageNum = number + 1;
            }).catch(error => {
                console.error('Error loading data:', error);
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
        handleSelectTeacher(row) {
            this.selectedRow = row; // 将选中行的数据保存
            this.dialogVisible = true; // 打开弹窗
        },
        confirmTeacher() {
            // 在这里可以进行一些逻辑判断或数据处理
            const index = this.tableData.findIndex(item => item.id === this.selectedRow.id);
            if (index !== -1) {
                this.tableData[index].produced = this.selectedTeacher; // 更新表格数据中的任课老师信息
            }
            this.dialogVisible = false; // 关闭弹窗
        }
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
  flex-basis: 48%; /* 或者根据需要设置固定宽度 */
}

.teacher-select {
  margin-top: 10px; /* 可根据需要调整上边距 */
}

</style>