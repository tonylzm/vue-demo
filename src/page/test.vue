<template>
    <div>
        <input type="file" @change="onFileChange" />
        <p v-if="md5Value">文件的MD5值：{{ md5Value }}</p>
    </div>
</template>

<script>
import md5 from 'js-md5';

export default {
    data() {
        return {
            md5Value: '',
        };
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const hash = md5.arrayBuffer(arrayBuffer);
                // 将 ArrayBuffer 转换为字符串
                const hashString = Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join('');
                this.md5Value = hashString;
            };
            reader.readAsArrayBuffer(file);
        },
    },
};
</script>