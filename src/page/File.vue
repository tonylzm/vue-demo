<template>
	<div>
		<div style="margin: 10px 0">
			<el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
			<el-button class="ml-5" type="primary" @click="loadData">搜索</el-button>
			<el-button type="warning" @click="reset">重置</el-button>
		</div>
		<div style="margin: 10px 0">
			<el-upload action="http://localhost:9090/api/upload/upload" :show-file-list="false"
				:on-success="handleFileUploadSuccess" style="display: inline-block">
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
			<el-table-column label="启用">
				<template v-slot="scope">
					<el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc"
						@change="changeEnable(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template v-slot="scope">
					<el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
						icon-color="red" title="您确定删除吗？" @confirm="del(scope.row.id)">
						<template #reference>
							<el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i>
							</el-button>
						</template>
					</el-popconfirm>
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

	export default {
		data() {
			return {
				tableData: [

					{
						id: 24,
						name: '新建 文本文档.txt',
						type: 'text/plain',
						size: 121,
						url: 'src\\main\\resources\\static\\files\\新建 文本文档.txt',
					}
				],
				name: '',
				multipleSelection: [],
				pageNum: 1,
				pageSize: 10,
				total: 0
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
			}
		}
	}
</script>

<style>
	/* Your styles here */
</style>
