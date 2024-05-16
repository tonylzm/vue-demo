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
		<div style="margin: 10px 0">
			<el-button type="primary" @click="drawer = true">试卷信息填写<el-icon>
					<Promotion />
				</el-icon></el-button>
			<el-drawer v-model="drawer" title="试卷信息登记表格" :append-to-body="true" :before-close="handleClose" size="40%">
				<div style="margin-top: -20px;">
					<el-progress v-if="showProgress" :text-inside="true" :stroke-width="26"
						:percentage="uploadProgress"></el-progress>
				</div>
				<div style="margin-bottom: 20px;">
					<el-tag type="primary"><span v-if="countdown > 0">请在{{ countdown }}秒内完成操作</span>
						<span v-else>倒计时结束</span></el-tag>
					<el-tooltip class="box-item" effect="light" content="当倒计时开始后，你需要在120秒内完成上传操作，否则将会取消上传"
						placement="bottom">
						<el-icon color="#1E90FF">
							<InfoFilled />
						</el-icon>
					</el-tooltip>
				</div>
				<el-form ref="form" :model="form" :rules="rules" label-width="120px">
					<el-form-item label="考试名称" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="试卷上传">
						<el-button type="primary" slot="reference" @click="handleUpload">上传文件 <el-icon>
								<Document />
							</el-icon></el-button>
						<template v-if="this.encryptedFile !== null">
							<el-icon color="green">
								<SuccessFilled />
							</el-icon>
						</template>
						<template v-else>
							<el-icon color="red">
								<CircleCloseFilled />
							</el-icon>
						</template>
					</el-form-item>
					<el-form-item label="考试班级" prop="class">
						<el-input v-model="form.class"></el-input>
					</el-form-item>
					<el-form-item label="考试方式" prop="region">
						<el-select v-model="form.region" placeholder="请选择考试方式">
							<el-option label="开卷考试" value="开卷考试"></el-option>
							<el-option label="闭卷考试" value="闭卷考试"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属院系" prop="college">
						<el-select v-model="form.college" placeholder="请选择院系" @change="getcheckuser">
							<el-option label="电子与信息工程学院" value="电子与信息工程学院"></el-option>
							<el-option label="马克思主义学院" value="马克思主义学院"></el-option>
							<el-option label="环境工程学院" value="环境工程学院"></el-option>
							<el-option label="天平学院" value="天平学院"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择审核主任" prop="classCheck">
						<el-select v-model="form.classCheck" placeholder="选择审核系主任">
							<el-option v-for="(option, index) in classOptions" :key="index" :label="option"
								:value="option"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择审核院长" prop="collegeCheck">
						<el-select v-model="form.collegeCheck" placeholder="选择审核院长">
							<el-option v-for="(option, index) in collegeOptions" :key="index" :label="option"
								:value="option"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="考试开始时间" prop="date">
						<el-row>
							<el-col :span="10">
								<el-date-picker v-model="form.date" type="date" placeholder="选择日期"
									style="width: 100%;"></el-date-picker>
							</el-col>
							<el-col :span="6">
								<el-time-picker v-model="form.startTime" format="HH:mm" placeholder="选择开始时间"
									style="width: 100%;"></el-time-picker>
							</el-col>
							<el-col :span="6">
								<el-time-picker v-model="form.endTime" format="HH:mm" placeholder="选择结束时间"
									style="width: 100%;"></el-time-picker>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="信息保存">
						<el-switch v-model="form.delivery"
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
						<el-tooltip class="box-item" effect="light" content="开启此按钮后,你输入的信息将会得到保存直至下次登录"
							placement="bottom">
							<el-icon color="#1E90FF">
								<InfoFilled />
							</el-icon>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="备注">
						<el-input type="textarea" v-model="form.desc"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit('form')">信息上传<el-icon>
								<UploadFilled />
							</el-icon></el-button>
						<el-button @click="handleClose">取消<el-icon>
								<Close />
							</el-icon></el-button>
					</el-form-item>
				</el-form>
			</el-drawer>
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
			<el-table-column prop="testname" label="考试名称"></el-table-column>
			<el-table-column prop="produced" label="出卷人"></el-table-column>
			<el-table-column prop="classes" label="考试班级"></el-table-column>
			<el-table-column prop="testtype" label="考试类型"></el-table-column>
			<el-table-column prop="testtime" label="考试时间"></el-table-column>
			<el-table-column prop="checkStatus" label="审核状态"></el-table-column>
			<el-table-column label="重新上传">
				<template v-slot="scope">
					<el-button type="primary" :disabled="!scope.row.checkStatus.includes('不通过')"
						@click="toreload(scope.row.testname, scope.row.name)">
						<el-icon>
							<Refresh />
						</el-icon>
						重新上传
					</el-button>
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
import router from '../../router'; // 导入Vue Router实例
import axios from 'axios';
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
			previewModalVisible: false, // 控制模态框的显示/隐藏
			previewData: '', // 存储预览数据
			visible: false,
			username: JSON.parse(localStorage.getItem('user')).username,
			college: JSON.parse(localStorage.getItem('user')).college,
			realName: JSON.parse(localStorage.getItem('user')).realName,
			uploadProgress: 0,
			showProgress: false, // 是否显示进度条 
			innerDrawer: false,
			drawer: false,
			reload: false,
			uploadParams: null,
			form: {
				name: '',
				class: '',
				region: '',
				college: '',
				delivery: false,
				desc: '',
				date: '', // 选择的日期  
				startTime: '', // 开始时间  
				endTime: '',// 结束时间 
				classCheck: '',
				collegeCheck: '',
				realName: JSON.parse(localStorage.getItem('user')).realName,
			},
			rules: {
				name: [
					{ required: true, message: '请输入考试名称', trigger: 'blur' }
				],
				class: [
					{ required: true, message: '请输入考试班级', trigger: 'blur' }
				],
				region: [
					{ required: true, message: '请选择考试方式', trigger: 'change' }
				],
				college: [
					{ required: true, message: '请选择所属院系', trigger: 'change' }
				],
				classCheck: [
					{ required: true, message: '请选择审核系主任', trigger: 'change' }
				],
				collegeCheck: [
					{ required: true, message: '请选择审核院长', trigger: 'change' }
				],
				date: [
					{ required: true, message: '请选择考试日期', trigger: 'change' }
				],
				startTime: [
					{ required: true, message: '请选择开始时间', trigger: 'change' }
				],
				endTime: [
					{ required: true, message: '请选择结束时间', trigger: 'change' }
				]
			},
			md5Value: '',
			encryptedFile: null,
			fileName: '',
			progressColor: '',
			encryptedAESKey: '',
			countdown: 120, // 初始化倒计时为120秒
			timer: null,
			fullscreenLoading: false,
			canclick: false,
			ipAddress: '',
			selectedOption: '',// 对账号选择的值
			reloadname: '',//重新上传的文件名,用于检验是否符合规范
			classOptions: [],
			collegeOptions: []
		}
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
					if (this.form.delivery === false) {
						this.form = {
							name: '',
							class: '',
							region: '',
							college: '',
							date: '', // 选择的日期  
							startTime: '', // 开始时间  
							endTime: '', // 结束时间 
							delivery: false,
							desc: ''
						};
					}
					this.reloadname = '';
					this.encryptedFile = null;
					this.countdown = 120;
					clearInterval(this.timer);;
					done();
				})
				.catch(_ => { });
		},
		onSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					alert('确定提交吗？');
					this.Upload();
				} else {
					alert('尚有未填写字段');
					return false;
				}
			});
			//console.log('submit!');
		},
		async handleUpload() {
			// 用户选择文件
			const data = await this.sendVerifyInfo();
			//console.log(data);
			//如果非法登录，文件删除
			if (data == '非法登录') {
				this.$message.error('请检查你的IP地址');
				return;
			}
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.addEventListener('change', async () => {
				const file = fileInput.files[0];
				this.fileName = this.realName + '_' + file.name;
				if (this.reloadname !== '' && this.reloadname !== this.fileName) {
					this.$message.error('文件与原文件不符，请重新上传');
					return;
				}
				//console.log('fileName', this.fileName);
				return new Promise(async (resolve, reject) => {
					const reader = new FileReader();
					reader.onload = async (event) => {
						const arrayBuffer = event.target.result;
						const hash = md5.arrayBuffer(arrayBuffer);
						// 将 ArrayBuffer 转换为字符串  
						const hashString = Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join('');
						this.md5Value = hashString;
						//console.log('md5Value', this.md5Value);
						try {
							// 生成加密密钥
							const key = await window.crypto.subtle.generateKey(
								{ name: 'AES-GCM', length: 256 },
								true,
								['encrypt', 'decrypt']
							);
							// 导出密钥为字符串格式
							const exportedKey = await window.crypto.subtle.exportKey('raw', key);
							const keyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)));
							const fileBuffer = arrayBuffer;
							//console.log('keyString', keyString);
							const encryptedData = await window.crypto.subtle.encrypt(
								{ name: 'AES-GCM', iv: new Uint8Array(12) },
								key,
								fileBuffer
							);
							this.encryptedFile = new Blob([encryptedData], { type: 'application/pdf' });
							// 从后端API获取RSA公钥  
							const publicKey = await this.getPublicKeyFromServer();
							// 使用公钥加密AES密钥  
							this.encryptedAESKey = this.encryptAESKeyWithPublicKey(publicKey.toString(CryptoJS.enc.Base64), keyString);
							const data = await this.sendVerifyInfo();
							//如果非法登录，文件删除
							if (data === '非法登录') {
								this.$message.error('验证失败，已取消上传');
								this.encryptedFile = null;
								return;
							}
							if (this.encryptedFile) {
								this.$message.warning('倒计时开始，请在120秒内完成上传操作');
								this.timer = setInterval(() => {
									if (this.countdown > 0) {
										this.countdown--;
									} else {
										clearInterval(this.timer);
									}
								}, 1000);
							}
						} catch (error) {
							this.$message.error('加密失败');
						}
					};
					reader.onerror = (error) => {
						this.$message.error('文件读取失败');
					};
					reader.readAsArrayBuffer(file);
				});
			});
			fileInput.click();
		},
		Upload() {
			// 构建 FormData 对象，用于发送文件
			const formData = new FormData();
			this.uploadProgress = 0;
			// 将需要加密的文件或文件信息放入 FormData 对象
			formData.append('encryptedFile', this.encryptedFile);
			formData.append('md5', this.md5Value);
			formData.append('fileName', this.fileName);
			formData.append('aesKey', this.encryptedAESKey);
			formData.append('username', this.username);
			formData.append('from', this.college);
			formData.append('info', JSON.stringify(this.form));
			var that = this;
			var xhr = new XMLHttpRequest();
			this.showProgress = true;
			xhr.open('POST', 'https://localhost:8443/api/upload/upload');
			// 上传完成后的回调函数
			xhr.onload = function () {
				if (xhr.status === 200) {
					//弹出上传成功
					that.$message.success('上传成功');
					setTimeout(() => {
						that.showProgress = false;
					}, 1000);
					that.loadData();
					that.encryptedFile = null;
					clearInterval(that.timer); // 上传成功后暂停计时
					that.countdown = 120; // 重置倒计时
					that.drawer = false;
				} else {
					that.progressColor = 'OrangeRed';
					that.$message.error('上传失败！' + xhr.responseText);
					setTimeout(() => {
						that.showProgress = false;
					}, 2000);
					console.log('上传出错');
				}
			};
			// 获取上传进度
			xhr.upload.onprogress = function (event) {
				if (event.lengthComputable) {
					var percent = Math.floor(event.loaded / event.total * 100);
					that.uploadProgress = parseInt(percent);
				}
			};
			xhr.send(formData);
		},

		formatText(percentage) {
			// 自定义格式化文本
			if (percentage < 100) {
				return '正在校验 ' + percentage + '%';
			} else {
				this.progressColor = 'LimeGreen';
				return '正在上传,请稍后...';
			}
		},
		// 从后端API获取公钥的新方法  
		async getPublicKeyFromServer() {
			try {
				const response = await fetch('https://localhost:8443/api/upload/public');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const publicKeyData = await response.text();
				// 如果后端返回的是Base64编码的公钥字符串，你可能需要进行解码
				// 使用 CryptoJS.enc.Base64.parse() 来解码
				const publicKey = CryptoJS.enc.Base64.parse(publicKeyData);
				// 返回解码后的公钥
				return publicKey;
			} catch (error) {
				// 捕获并处理任何异常
				console.error('Failed to fetch public key from server', error);
				// 返回一个空的值或者一个默认值，具体根据你的需求来决定
				return null;
			}
		},
		//向后端发送验证信息，信息为随机生成的字符串，包含用户名时间，ip地址等信息
		async sendVerifyInfo() {
			// 生成随机字符串和其他信息
			const loading = ElLoading.service({
				lock: true,
				text: '正在对你进行身份认证，请稍等...',
				background: 'rgba(0, 0, 0, 0.7)',
			});
			let timerId;
			// 定时器 ID
			try {
				// 处理后端的响应
				timerId = setTimeout(() => {
					// 如果请求没有完成，更改加载文本  
					loading.setText('网络开小差了，正在拼命加载...');
				}, 3000); // 2秒后触发
				const hashedPassword = this.encryptedAESKey;
				const username = this.username;
				const time = this.getCurrentTime();
				const ipAddress = await this.getIPAddress(); // 这里假设你有一个获取 IP 地址的方法
				console.log(hashedPassword)
				// 构建发送给后端的数据
				const data = {
					hashedPassword,
					username,
					time,
					ipAddress
					// 可以根据需要添加其他信息
				};

				// 发送 POST 请求给后端
				const response = await axios.post('https://localhost:8443/api/users/test', data);

				// 清除定时器
				clearTimeout(timerId);
				loading.close();
				this.countdown = 120;
				this.$message.success('验证成功');
				return response.data;

			} catch (error) {
				clearTimeout(timerId);
				loading.close();
				this.$message.error('非法登录');
				return '非法登录';
			}
		},

		async getIPAddress() {
			try {
				const response = await axios.get('http://ip-api.com/json/');
				//https://api.ipify.org/?format=json 也可以获取ip地址
				return response.data.query;
			} catch (error) {
				console.error('获取 IP 地址失败:', error);
				return null;
			}
		},
		getCurrentTime() {
			const currentTime = new Date();
			// 将时间格式化为字符串，你可以根据需要进行调整
			const formattedTime = currentTime.toISOString(); // 返回 ISO 格式的字符串，例如："2024-04-12T12:30:00.000Z"
			return formattedTime;
		},
		// 使用 RSA 公钥加密 AES 密钥的方法
		encryptAESKeyWithPublicKey(publicKey, aesKeyBase64) {
			const encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			const encryptedAESKey = encrypt.encrypt(aesKeyBase64);
			return encryptedAESKey;
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
				this.tableData = content;
				this.tableData.forEach((item) => {
					item.checkStatus = item.check.checkStatus;
				});
				this.total = totalElements;
				this.pageNum = number + 1;
			}).catch(error => {
				console.error('Error loading data:', error);
			});
		},
		hideProgressAfterDelay() {
			// 延迟2秒后隐藏进度条  
			this.$nextTick(() => {
				setTimeout(() => {
					this.showProgress = false;
				}, 2000);
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
		toreload(name, filename) {
			this.drawer = true;
			this.form.name = name;
			this.reloadname = filename;
		},
		getcheckuser(value) {
			this.form.classCheck = '';
			this.form.collegeCheck = '';
			axios.post('https://localhost:8443/api/users/findCheckUser', {
				college: value
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(response => {
				console.log(response.data.body)
				sessionStorage.setItem('checkuser', JSON.stringify(response.data.body));
				const storedData = sessionStorage.getItem('checkuser');
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					const myName = JSON.parse(localStorage.getItem('user')).realName; // 替换为你的名字
					this.classOptions = parsedData.class_check.filter(name => name !== myName);
					this.collegeOptions = parsedData.college_check.filter(name => name !== myName);
				}
			}).catch(error => {
				console.error('Error loading data:', error);
			});
		}
	}
}
</script>
<style></style>
