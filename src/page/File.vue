<template>
	<div>
		<div style="margin: 10px 0">
			<el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
			<el-button class="ml-5" type="primary" @click="loadData">搜索</el-button>
			<el-button type="warning" @click="reset">重置</el-button>
		</div>
		<div style="margin: 10px 0">
			<el-button type="primary" slot="reference" @click="handleUpload">上传文件 <i
					class="el-icon-remove-outline"></i></el-button>
			<el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
				icon-color="#626AEF" title="Are you sure to delete this?" @confirm="delBatch">
				<template #reference>
					<el-button type="danger" slot="reference">上传文件 <i class="el-icon-remove-outline"></i></el-button>
				</template>
			</el-popconfirm>

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
					<el-button type="primary" @click="download(scope.row.name)"><i class="el-icon-download"></i>
						下载</el-button>
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
			uploadParams: null,

			md5Value: '',
			encryptedFile: null,
			fileName: '',
			progressColor: '',
			encryptedAESKey: '',
		}
	},

	created() {
		this.loadData();
	},
	methods: {
		handleUpload() {
			// 用户选择文件
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
							console.log('encryptedAESKey', this.encryptedAESKey);
							const data = await this.sendVerifyInfo();
							this.Upload();
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
			} catch (error) {
				console.error('发送验证信息失败:', error);
				//弹出提示
				this.$message.error('非法登录');
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
