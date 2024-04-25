<template>
    <div class="not-found">
        <h1>404 - 页面未找到</h1>
        <p>抱歉，您访问的页面不存在。</p>
        <router-link to="/4">返回登录</router-link>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 50px;
}

.not-found h1 {
    font-size: 4rem;
    color: #333;
}

.not-found p {
    font-size: 1.5rem;
    color: #666;
    margin-top: 20px;
}

.not-found router-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #007bff;
    text-decoration: none;
    margin-top: 20px;
}

.not-found router-link:hover {
    text-decoration: underline;
}
</style>