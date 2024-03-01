<template>
	<div>
		<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
			:size="formSize" status-icon>
			<el-row :gutter="30" style="margin-bottom: 0;">
				<el-col :span="5">
					<el-form-item label="医疗机构" prop="region1">
						<el-select v-model="ruleForm.region1" placeholder="苏州市姑苏区娄江社区卫生服务中心">
							<el-option label="苏州市姑苏区娄江社区卫生服务中心" value="shanghai" />
							<el-option label="洛杉矶第一人民医院" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="药库" prop="region2">
						<el-select v-model="ruleForm.region2" placeholder="西药房">
							<el-option label="西药房" value="shanghai" />
							<el-option label="中药房" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="配送单位" prop="region3">
						<el-select v-model="ruleForm.region3" placeholder="请选择配送单位">
							<el-option label="苏州科技大学" value="shanghai" />
							<el-option label="苏州第一人民医院" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="基药类型" prop="region4">
						<el-select v-model="ruleForm.region4" placeholder="请选择基药类型">
							<el-option label="国基" value="shanghai" />
							<el-option label="非国基" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="30" style="margin-bottom: 0;">
				<el-col :span="5">
					<el-form-item label="状态" prop="region5">
						<el-select v-model="ruleForm.region5" placeholder="启用">
							<el-option label="启用" value="shanghai" />
							<el-option label="非启用" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="药品编码" prop="num1">
						<el-input v-model="ruleForm.num1" />
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="医保编码" prop="num2">
						<el-input v-model="ruleForm.num2" />
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="生产企业" prop="num3">
						<el-input v-model="ruleForm.num3" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="30" style="margin-bottom: 0;">

				<el-col :span="5">
					<el-form-item label="药品名称" prop="num4">
						<el-input v-model="ruleForm.num4" />
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="30" style="margin-bottom: 0;">
				<div class="y" style="width: 418px;">
					<el-form-item label="药品类别" prop="resource">
						<el-radio v-model="ruleForm.resource" label="1">药品类别</el-radio>
						<el-radio v-model="ruleForm.resource" label="2">基药类型</el-radio>
						<el-radio v-model="ruleForm.resource" label="3">集采类型</el-radio>
					</el-form-item>
				</div>

				<div class="y" style="width: 574px;">
					<el-form-item label="分类明细" prop="type">
						<el-checkbox-group v-model="ruleForm.type" v-if="ruleForm.resource==1">
							<el-checkbox label="西药" />
							<el-checkbox label="中成药" />
							<el-checkbox label="中药饮品" />
							<el-checkbox label="精二类" />
							<el-checkbox label="自制药剂" />
						</el-checkbox-group>
						<el-checkbox-group v-model="ruleForm.type" v-if="ruleForm.resource==2">
							<el-checkbox label="国基" />
							<el-checkbox label="非国基" />
						</el-checkbox-group>
						<el-checkbox-group v-model="ruleForm.type" v-if="ruleForm.resource==3">
							<el-checkbox label="国家采集" />
							<el-checkbox label="省采集" />
							<el-checkbox label="非采集" />
						</el-checkbox-group>
					</el-form-item>
				</div>
				<div class="z">
					<el-form-item>
						<el-button type="primary" @click="submitForm(ruleFormRef)">
							<el-icon>
								<Search />
							</el-icon>搜索
						</el-button>
						<el-button @click="resetForm(ruleFormRef)">
							<el-icon>
								<Refresh />
							</el-icon>重置
						</el-button>
					</el-form-item>
				</div>
			</el-row>
		</el-form>
		<div class="y">
			<el-button type="warning" plain>
				<el-icon>
					<Download />
				</el-icon>导出
			</el-button>

			<el-button type="primary" plain @click="dialogFormVisible = true">
				<el-icon>
					<Plus />
				</el-icon>新增
			</el-button>

			<el-dialog id="x" v-model="dialogFormVisible" title="新增机构药品目录">
				<el-form ref="ruleFormRefs" :model="ruleForm" :rules="rules" class="demo-ruleForm" :size="formSize"
					status-icon>
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item id="x" label="医疗机构">
								苏州市姑苏区娄江社区卫生服务中心
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item id="x" style="float: left;margin-left: 85px ;" label=" 药库">
								西药房
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item id="x" label="药品编码" prop="num5">
								<el-input id="x" v-model="ruleForm.num5" disabled placeholder="请输入药品编码" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item id="x" label="药品名称" prop="num6">
								<el-input id="x" v-model="ruleForm.num6" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item id="x" label="商品名" prop="num7">
								<el-input id="x" v-model="ruleForm.num7" disabled placeholder="请输入商品名" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item id="x" label="医保编码" prop="num8">
								<el-input id="x" v-model="ruleForm.num8" disabled placeholder="请输入医保编码" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item id="x" label="批准文号" prop="num9">
								<el-input id="x" v-model="ruleForm.num9" disabled placeholder="请输入批准文号" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item id="x" label="包装规格" prop="num10">
								<el-input id="x" v-model="ruleForm.num10" disabled placeholder="请输入包装规格" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item id="x" label="包装单位" prop="num11">
								<el-input id="x" v-model="ruleForm.num11" disabled placeholder="请输入包装单位" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item id="x" label="生产企业" prop="num12">
								<el-input id="x" v-model="ruleForm.num12" disabled placeholder="请输入生产企业" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="12">
							<el-form-item id="x" label="单价" prop="num13">
								<el-input id="x" v-model="ruleForm.num13" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item id="x" label="采购库存下限" prop="num14">
								<el-input id="x" v-model="ruleForm.num14" />
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<template #footer>
					<div class="z">
						<span class="dialog-footer">
							<el-button @click="resetForm(ruleFormRefs)">取消</el-button>
							<el-button type="primary" @click="dialogFormVisible = false">
								确定
							</el-button>
						</span>
					</div>
				</template>
			</el-dialog>
		</div>
		<el-table :data="tableData" style="width: 100%" row-style="{height: '40px'}" height="500">
			<el-table-column fixed prop="序号" label="序号" width="70" align="center" />
			<el-table-column prop="医疗机构" label="医疗机构" width="200" align="center" />
			<el-table-column prop="药库" label="药库" width="70" align="center" />
			<el-table-column prop="药品编码" label="药品编码" width="200" align="center" />
			<el-table-column prop="药品名称" label="药品名称" width="100" align="center" />
			<el-table-column prop="商品名" label="商品名" width="100" align="center" />
			<el-table-column prop="包装规格" label="包装规格" width="100" align="center" />
			<el-table-column prop="生产企业" label="生产企业" width="150" align="center" />
			<el-table-column prop="价格" label="价格" width="70" align="center" />
			<el-table-column prop="库存数量" label="库存数量" width="100" align="center" />
			<el-table-column prop="配送单位" label="配送单位" width="100" align="center" />
			<el-table-column prop="采购库存下限" label="采购库存下限" width="120" align="center" />
			<el-table-column prop="医保编码" label="医保编码" width="300" align="center" />
			<el-table-column fixed="right" label="操作" width="200" align="center">
				<template #default>
					<el-button type="primary" size="small" @click="handleClick">禁用</el-button>
					<el-button type="primary" size="small">编辑</el-button>
				</template>
			</el-table-column>

		</el-table>
		<div class="demo-pagination-block" style="float: right;">
			<el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
				:page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background"
				layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import {
		reactive,
		ref
	} from 'vue'
	import type {
		FormInstance
	} from 'element-plus'
	const currentPage4 = ref(4)
	const pageSize4 = ref(100)
	const small = ref(false)
	const background = ref(false)
	const disabled = ref(false)
	const formSize = ref('default')
	const ruleFormRef = ref < FormInstance > ()
	const ruleFormRefs = ref < FormInstance > ()
	const ruleForm = reactive({
		region1: '',
		region2: '',
		region3: '',
		region4: '',
		region5: '',
		num1: '',
		num2: '',
		num3: '',
		num4: '',
		type: [],
		resource: '',
		num5: '',
		num6: '',
		num7: '',
		num8: '',
		num9: '',
		num10: '',
		num11: '',
		num12: '',
		num13: '',
		num14: '',

	})
	const handleSizeChange = (val: number) => {
		console.log(`${val} items per page`)
	}
	const handleCurrentChange = (val: number) => {
		console.log(`current page: ${val}`)
	}

	const submitForm = async (formEl: FormInstance | undefined) => {
		if (!formEl) return
		await formEl.validate((valid, fields) => {
			if (valid) {
				console.log('submit!')
			} else {
				console.log('error submit!', fields)
			}
		})
	}
	const handleClick = () => {
		console.log('click')
	}
	const resetForm = (formEl: FormInstance | undefined) => {
		if (!formEl) return
		formEl.resetFields()
	}

	const dialogFormVisible = ref(false)

	const tableData = [{
			序号: '01',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '184420',
			药品名称: '血府诼瘀口服液',
			商品名: '血府诼瘀口服液',
			包装规格: '10ml*12',
			生产企业: '吉林敖东延边药厂',
			价格: '25.08',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'ZA12',

		},
		{
			序号: '02',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '100913',
			药品名称: '西洛他唑片',
			商品名: '培达',
			包装规格: '50mg*12',
			生产企业: '浙江大冢制药有限公司',
			价格: '46.14',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'XB01',

		},
		{
			序号: '03',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '184420',
			药品名称: '血府诼瘀口服液',
			商品名: '血府诼瘀口服液',
			包装规格: '10ml*12',
			生产企业: '吉林敖东延边药厂',
			价格: '25.08',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'ZA12',

		},
		{
			序号: '04',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '100913',
			药品名称: '西洛他唑片',
			商品名: '培达',
			包装规格: '50mg*12',
			生产企业: '浙江大冢制药有限公司',
			价格: '46.14',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'XB01',
		}, {
			序号: '05',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '184420',
			药品名称: '血府诼瘀口服液',
			商品名: '血府诼瘀口服液',
			包装规格: '10ml*12',
			生产企业: '吉林敖东延边药厂',
			价格: '25.08',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'ZA12',
		}, {
			序号: '06',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '100913',
			药品名称: '西洛他唑片',
			商品名: '培达',
			包装规格: '50mg*12',
			生产企业: '浙江大冢制药有限公司',
			价格: '46.14',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'XB01',

		}, {
			序号: '07',
			医疗机构: '苏州市姑苏区娄江卫生服务中心',
			药库: '西药房',
			药品编码: '184420',
			药品名称: '血府诼瘀口服液',
			商品名: '血府诼瘀口服液',
			包装规格: '10ml*12',
			生产企业: '吉林敖东延边药厂',
			价格: '25.08',
			库存数量: '0',
			配送单位: '华润江苏医药有限公司',
			采购库存下限: '100',
			医保编码: 'ZA12',

		},
	]
</script>
<style>
	.el-form {
		width: 100%;
		background-color: lightblue;
		border-radius: 10px;
	}

	.el-form-item {
		margin: 0;
	}

	.el-form-item#x {
		margin: 0;
		float: right;
		margin-bottom: 10px;
		margin-right: 10px;
	}

	.y {
		width: auto;
		height: 50px;
		float: left;
		margin-left: 15px;
	}

	.z {
		width: auto;
		height: 50px;
		float: right;
		margin-left: 200px;
	}

	.q {
		width: auto;
		height: 50px;
		float: right;
		margin-left: 15px;
	}

	.dialog-footer button:first-child {
		margin-right: 10px;
	}

	.el-dialog#x {
		width: 700px;
		height: 450px;
	}

	.el-input#x {
		width: 280px;
		height: 30px;
		float: right;

	}
</style>
