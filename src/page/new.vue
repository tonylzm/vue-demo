<template>
  <el-upload action="http://localhost:9090/api/upload/test" :show-file-list="false" :before-upload="beforeUpload"
    :data="formData" :on-success="handleFileUploadSuccess" :on-progress="handleFileUploadProgress" accept=".pdf"
    style="display: inline-block">
    <el-button type="primary" class="ml-5">上传文件 <i class="el-icon-upload"></i></el-button>
  </el-upload>

  <el-button type="primary" @click="downloadFile">下载文件</el-button>
</template>

<script>
import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import JSEncrypt from 'jsencrypt'; // 引入jsencrypt库用于RSA加密 
import { Base64 } from 'js-base64';
import AES from "@/common/AES.js";
export default {
  data() {
    return {
      formData: null,
      uploadProgress: 0,
      // 其他必要的数据...  
    };
  },
  methods: {
    downloadFile() {
      // var keys = AES.generatekey(16);
      // var iv = AES.generatekey(16);    
      //如果是对象/数组的话，需要先JSON.stringify转换成字符串
      // 不传key值，就默认使用上述定义好的key值

      // var encrypts = AES.encrypt(JSON.stringify(cars));
      // var dess = JSON.parse(AES.decrypt(encrypts));

      var encrypts = AES.encrypt('1234asdasd');
      var dess = AES.decrypt(encrypts);

      console.log(encrypts)
      console.log(encrypts.length)
      console.log(dess)
    },
    async beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const fileData = CryptoJS.lib.WordArray.create(e.target.result);
            const fileBase64 = "zasirxWYErcFGI5Rsk0/iRGfZ5Qka5H3";
            console.log('fileBase64', fileBase64);
            const fileMD5 = CryptoJS.MD5(fileData).toString();
            const aeskey = "zasirxWYErcFGI5Rsk0/iRGfZ5Qka5H3";
            const keyBase64 = Base64.encode(aeskey);
            // 加密文件  
            //将文件转化位Base64编码

            const encryptedFile = CryptoJS.AES.encrypt(fileBase64, keyBase64, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            const encryptedFileBase64 = encryptedFile.ciphertext.toString(CryptoJS.enc.Base64);


            // 从后端API获取RSA公钥  
            const publicKey = await this.getPublicKeyFromServer();
            // 使用公钥加密AES密钥  
            const encryptedAESKey = this.encryptAESKeyWithPublicKey(publicKey.toString(CryptoJS.enc.Base64), keyBase64);
            // 构建数据结构  
            this.formData = {
              encroptfile: encryptedFileBase64,
              md5: fileMD5,
              aesKey: encryptedAESKey
            };

            resolve(file);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },

    // 从后端API获取公钥的新方法  
    async getPublicKeyFromServer() {
      try {
        const response = await fetch('http://localhost:9090/api/upload/public'); // 假设后端API的URL是'/api/keys/public'  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const publicKeyData = await response.text(); // 假设后端返回的是Base64编码的公钥字符串  
        // 根据实际情况，你可能需要将Base64编码的公钥字符串转换为适当的格式以供CryptoJS使用  
        const publicKey = CryptoJS.enc.Base64.parse(publicKeyData);
        return publicKey;
      } catch (error) {
        throw new Error('Failed to fetch public key from server', error);
      }
    },
    encryptAESKeyWithPublicKey(publicKey, aesKeyBase64) {

      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);
      const encryptedAESKey = encrypt.encrypt(aesKeyBase64);
      return encryptedAESKey;

    },
    readPublicKeyFromFile(filePath) {
      const publicKeyFilePath = path.resolve(__dirname, filePath);

      try {
        // 读取公钥文件内容  
        const publicKeyData = fs.readFileSync(publicKeyFilePath, 'utf8');

        // 清理公钥字符串中的换行符和其他不需要的字符  
        const publicKeyString = publicKeyData.replace(/\n|\r/g, '').replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, '');

        // 返回清理后的公钥字符串  
        return publicKeyString;
      } catch (error) {
        // 如果读取文件时发生错误，抛出异常  
        throw error;
      }
    },
    handleFileUploadProgress(event, file) {
      this.uploadProgress = parseInt((event.percent || 0), 10);
    },
    handleFileUploadSuccess(response, file) {
      this.$message.success('上传成功');
      this.hideProgressAfterDelay();
      this.loadData();
    },
    hideProgressAfterDelay() {
      // 隐藏上传进度条的逻辑  
      // 使用setTimeout或其他方法实现延迟隐藏  
    },
    loadData() {
      // 加载数据的逻辑  
    }
  }
};
</script>
