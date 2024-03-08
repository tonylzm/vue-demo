<template>
	<div>
		<div style="margin: 10px 0">
			<el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
			<el-button class="ml-5" type="primary" @click="loadData">搜索</el-button>
			<el-button type="warning" @click="reset">重置</el-button>
		</div>
		<div style="margin: 10px 0">
			<el-upload action="http://localhost:9090/api/upload/upload" :show-file-list="false"
				:on-success="handleFileUploadSuccess" style="display: inline-block" accept=".pdf">
				<el-button type="primary" class="ml-5">上传文件 <i class="el-icon-top"></i></el-button>
			</el-upload>
			<el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
				icon-color="#626AEF" title="Are you sure to delete this?" @confirm="delBatch">
				<template #reference>
					<el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
				</template>
			</el-popconfirm>

		</div>
		<el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
			@selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="id" label="ID" width="80"></el-table-column>
			<el-table-column prop="name" label="文件名称"></el-table-column>
			<el-table-column prop="type" label="文件类型"></el-table-column>
			<el-table-column prop="size" label="文件大小(kb)"></el-table-column>
			<el-table-column label="下载">
				<template v-slot="scope">
					<el-button type="primary" @click="download(scope.row.name)">下载</el-button>
				</template>
			</el-table-column>
			<el-table-column label="加载预览">
				<template v-slot="scope">
					<el-button type="primary" @click="preview(scope.row.name)">加载预览</el-button>
				</template>
			</el-table-column>
			<el-table-column label="启用">
				<template v-slot="scope">
					<el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc"
						@change="changeEnable(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template v-slot="scope">
					<el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
						icon-color="red" title="开启后密码解开" @confirm="decrpyt(scope.row.name)">
						<template #reference>
							<el-button type="danger" slot="reference">验证出卷人身份 <i class="el-icon-remove-outline"></i>
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
				<el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
				关闭
			</el-button>
			<div>
				<el-button @click="innerDrawer = true">Click me!</el-button>
				<el-drawer
					v-model="innerDrawer"
					title="I'm inner Drawer"
					:append-to-body="true"
					:before-close="handleClose"
				>
					<p>_(:зゝ∠)_</p>
				</el-drawer>
			</div>
			</template>
			<iframe ref="pdfViewer" style="width: 100%; height: 600px;" frameborder="0"></iframe>
  		</el-drawer>

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
				multipleSelection: [],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				previewModalVisible: false, // 控制模态框的显示/隐藏
                previewData: '', // 存储预览数据
				visible : false,
				innerDrawer :false
			}
		},

		created() {
			this.loadData();
		},
		methods: {
			loadData() {
				axios.get('http://localhost:9090/api/files/page', {
					params: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
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
				axios.get('http://localhost:9090/api/download/download', {
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
			decrpyt(name){
				axios.post('http://localhost:9090/api/files/decrypt', null, {
					params: {
						fileName: name
					}
				})
				.then(response => {
					if (response.status === 200) {
						this.$message.success('验证成功');
					}
				})
				.catch(error => {
					// Handle errors here
					console.error('Error decrypting file:', error);
					this.$message.error('验证失败');
				});
			},
			preview(fileName) {
			axios.get(`http://localhost:9090/api/files/preview?fileName=${fileName}`, { responseType: 'blob' })
				.then(response => {
				// 成功获取预览数据后，加载到 <iframe> 中预览	
				const pdfData = new Blob([response.data], { type: 'application/pdf' });
				const viewer = this.$refs.pdfViewer;
				this.visible = true;
				this.$nextTick(() => {
					const viewer = this.$refs.pdfViewer;
					console.log(1);
					setTimeout(() => {
						console.log(2);
						viewer.src = URL.createObjectURL(pdfData);
					}, 100); // 等待1秒后设置src
				});
			})
			.catch(error => {
				console.error('Error loading preview:', error);
			});
			}
		}
	}
</script>

<style>
	/* Your styles here */
</style>
