<template>
    <div id="app">
        <el-select v-model="value" filterable :filter-method="filterMethod" placeholder="请选择">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label">
            </el-option>
        </el-select>
    </div>
</template>
<script>
//let options = []; for (let i = 1; i < 5000; i++)options.push({ label: 'Test' + i });        //模拟大数据下拉列表
import axios from 'axios';
export default {
    data() {
        return {
            //options: options.slice(0, 10),                                //默认为options的前10个
            alloptions: [],
            options: [],
            value: ''
        }
    },
    created() {
        axios.get('https://localhost:8443/api/users/get_teacher')
            .then(res => {
                const { userName, realName } = res.data.body;
                this.alloptions = userName.map((name, index) => ({
                    value: name,
                    label: realName[index] + '(' + name + ')'
                }));
            })
            .catch(err => {
                console.log(err);
            })
    },
    methods: {
        filterMethod(query) {
            if (query == '') {
                this.options = this.alloptions.slice(0, 10); // 使用 this.options 而不是 options
            } else {
                let result = [];
                this.alloptions.forEach(val => { // 使用 this.options 而不是 options
                    if (val.label.indexOf(query) != -1) result.push(val);
                });
                this.options = result.slice(0, 10); // 只取前10个
            }
        }
    }
}
</script>