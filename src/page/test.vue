<template>
  <el-button type="danger" slot="reference" @click="handleUpload">上传文件 <i
      class="el-icon-remove-outline"></i></el-button>
  <div>
    <el-progress v-if="showProgress" :text-inside="true" :stroke-width="26" :percentage="uploadProgress"></el-progress>
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
      md5Value: '',
      encryptedFile: null,
      keyString: '',
      fileName: '',
      showProgress: false, // 是否显示进度条 
      uploadProgress: 0,
      encryptedAESKey: '',
    };
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
              this.keyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)));
              console.log('加密密钥:', this.keyString);

              const fileBuffer = arrayBuffer;
              console.log(12)
              const encryptedData = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: new Uint8Array(12) },
                key,
                fileBuffer
              );
              this.encryptedFile = new Blob([encryptedData], { type: 'application/pdf' });
              // 从后端API获取RSA公钥  
              const publicKey = await this.getPublicKeyFromServer();
              // 使用公钥加密AES密钥  
              this.encryptedAESKey = this.encryptAESKeyWithPublicKey(publicKey.toString(CryptoJS.enc.Base64), this.keyString);
              console.log('encryptedAESKey', this.encryptedAESKey);
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
      formData.append('key', this.keyString);
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
          console.log('上传成功');
          that.showProgress = false;
        } else {
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
    encryptAESKeyWithPublicKey(publicKey, aesKeyBase64) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      const encryptedAESKey = encrypt.encrypt(aesKeyBase64);
      return encryptedAESKey;
    },

  }
}
</script>