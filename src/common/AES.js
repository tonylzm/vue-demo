async function encryptFile(file) {
    if (!file) {
        alert('请选择要加密的文件');
        return null;
    }

    // 生成加密密钥
    const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // 导出密钥为字符串格式
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const keyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)));
    console.log('加密密钥:', keyString);

    const fileBuffer = await file.arrayBuffer();
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: new Uint8Array(12) },
        key,
        fileBuffer
    );

    const encryptedFile = new Blob([encryptedData], { type: 'application/pdf' });

    return { encryptedFile, key: keyString };
}
