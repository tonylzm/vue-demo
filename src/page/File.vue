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
				<el-form ref="form" :model="form" label-width="120px">
					<el-form-item label="考试名称">
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
					<el-form-item label="考试班级">
						<el-input v-model="form.class"></el-input>
					</el-form-item>
					<el-form-item label="考试方式">
						<el-select v-model="form.region" placeholder="请选择考试方式">
							<el-option label="开卷考试" value="开卷考试"></el-option>
							<el-option label="闭卷考试" value="闭卷考试"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属院系">
						<el-select v-model="form.college" placeholder="请选择院系">
							<el-option label="电子与信息工程学院" value="电子与信息工程学院"></el-option>
							<el-option label="马克思主义学院" value="马克思主义学院"></el-option>
							<el-option label="环境工程学院" value="环境工程学院"></el-option>
							<el-option label="天平学院" value="天平学院"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="考试开始时间">
						<el-col :span="11">
							<el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
								style="width: 100%;"></el-date-picker>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
							<el-time-picker placeholder="选择时间" v-model="form.date2"
								style="width: 100%;"></el-time-picker>
						</el-col>
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
						<el-button type="primary" @click="onSubmit">信息上传<el-icon>
								<Upload />
							</el-icon></el-button>
						<el-button @click="handleClose">取消<el-icon>
								<Close />
							</el-icon></el-button>
					</el-form-item>
				</el-form>
			</el-drawer>
			<!-- <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
				icon-color="#626AEF" title="Are you sure to delete this?" @confirm="delBatch">
				<template #reference>
					<el-button type="danger" slot="reference">上传文件 <i class="el-icon-remove-outline"></i></el-button>
				</template>
			</el-popconfirm> -->

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
			<el-table-column prop="produced" label="出卷人"></el-table-column>
			<el-table-column prop="size" label="文件大小(kb)"></el-table-column>
			<el-table-column label="下载">
				<template v-slot="scope">
					<el-button type="primary" @click="download(scope.row.name)"><el-icon>
							<Download />
						</el-icon>
						下载</el-button>
				</template>
			</el-table-column>
			<el-table-column label="加载预览">
				<template v-slot="scope">
					<el-button type="primary" @click="preview(scope.row.name)">加载预览<el-icon>
							<Monitor />
						</el-icon></el-button>
				</template>
			</el-table-column>
			<el-table-column label="启用">
				<template v-slot="scope">
					<el-switch v-model="scope.row.enable"
						style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
						@change="changeEnable(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template v-slot="scope">
					<el-popconfirm width="220" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
						icon-color="red" title="开启后密码解开" @confirm="decrpyt(scope.row.name)">
						<template #reference>
							<el-button type="danger" slot="reference" :disabled="scope.row.decrypt">解密该试卷<el-icon>
									<Checked />
								</el-icon>
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
					<el-icon class="el-icon--left">
						<CircleCloseFilled />
					</el-icon>
					关闭
				</el-button>
				<div>
					<el-button @click="innerDrawer = true">Click me!</el-button>
					<el-drawer v-model="innerDrawer" title="I'm inner Drawer" :append-to-body="true"
						:before-close="handleClose">
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
import md5 from 'js-md5';
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
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
			username: 'your_username_value',
			uploadProgress: 0,
			showProgress: false, // 是否显示进度条 
			innerDrawer: false,
			drawer: false,
			uploadParams: null,
			form: {
				name: '',
				class: '',
				region: '',
				college: '',
				date1: '',
				date2: '',
				delivery: false,
				desc: ''
			},
			md5Value: '',
			encryptedFile: null,
			fileName: '',
			progressColor: '',
			encryptedAESKey: '',
			countdown: 120, // 初始化倒计时为120秒
			timer: null,
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
							date1: '',
							date2: '',
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
			this.Upload();
			console.log('submit!');
		},
		async handleUpload() {
			// 用户选择文件
			const data = await this.sendVerifyInfo();
			console.log(data);
			//如果非法登录，文件删除
			if (data == '非法登录') {
				this.$message.error('请检查你的IP地址');
				return;
			}
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.addEventListener('change', async () => {
				const file = fileInput.files[0];
				this.fileName = file.name;
				console.log('fileName', this.fileName);
				return new Promise(async (resolve, reject) => {
					const reader = new FileReader();
					reader.onload = async (event) => {
						const arrayBuffer = event.target.result;
						const hash = md5.arrayBuffer(arrayBuffer);
						// 将 ArrayBuffer 转换为字符串  
						const hashString = Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join('');
						this.md5Value = hashString;
						console.log('md5Value', this.md5Value);
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
							console.log('keyString', keyString);
							//console.log(12)
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
							console.error(error);
						}
					};
					reader.onerror = (error) => {
						console.log(2)
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
			formData.append('username', "usts");
			formData.append('from', "usts");
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
				} else {
					that.progressColor = 'OrangeRed';
					that.$message.error('上传失败');
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
			try {
				// 生成随机字符串和其他信息
				const hashedPassword = this.encryptedAESKey;
				const username = "usts";
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
				// 处理后端的响应
				console.log(response.data);
				this.$message.success('验证成功');

				return response.data;
			} catch (error) {
				this.$message.error('非法登录');

				return '非法登录';
			}
		},

		async getIPAddress() {
			try {
				const response = await axios.get('https://api.ipify.org?format=json');
				return response.data.ip;
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
		encryptAESKeyWithPublicKey(publicKey, aesKeyBase64) {
			const encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			const encryptedAESKey = encrypt.encrypt(aesKeyBase64);
			return encryptedAESKey;
		},
		loadData() {
			axios.get('https://localhost:8443/api/files/page', {
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
		download(name) {
			axios.get('https://localhost:8443/api/download/download', {
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
		decrpyt(name) {
			axios.post('https://localhost:8443/api/files/decrypt', null, {
				params: {
					fileName: name
				}
			})
				.then(response => {
					if (response.status === 200) {
						this.$message.success('验证成功');
						//将该行的解密该试卷按钮变成不可点击
						this.tableData.forEach((item) => {
							if (item.name === name) {
								item.decrypt = true;
							}
						});
					}
				})
				.catch(error => {
					// Handle errors here
					console.error('Error decrypting file:', error);
					this.$message.error('验证失败');
				});
		},
		preview(fileName) {
			axios.get(`https://localhost:8443/api/files/preview?fileName=${fileName}`, { responseType: 'blob' })
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
