<template>
    <div style="margin-left: 10px;">
        <div style="padding: 10px 0">
            <el-button type="success" @click="exportToExcel">导出本页为 Excel</el-button>
            <el-button type="primary" @click="exportToExcelAll">导出所有为 Excel</el-button>
            <el-button type="info" @click="printTable">打印本页</el-button>
        </div>
        <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="actor" label="发起人" width="120"></el-table-column>
            <el-table-column prop="action" label="活动"></el-table-column>
            <el-table-column prop="date" label="时间" width="200"></el-table-column>
        </el-table>
        <div style="padding: 10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="pageNum"
                :page-sizes="[2, 5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<style></style>
<script>
import axios from 'axios';
import { ElLoading } from 'element-plus';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export default {
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 20,
            total: 0,
            multipleSelection: [],
            loadingInstance: null,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            axios.get('https://localhost:8443/api/log/sys_logs', {
                params: {
                    pageNum: this.pageNum - 1,
                    pageSize: this.pageSize
                }
            }).then(res => {
                const {
                    content,
                    totalPages,
                    totalElements,
                    number
                } = res.data.body;
                this.tableData = content;
                this.total = totalElements;
                this.pageNum = number + 1;
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        },
        handlePageChange(val) {
            this.pageNum = val;
            this.getData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        exportToExcelAll() {
            axios.get('https://localhost:8443/api/log/all_logs', {
            }).then(res => {
                const worksheet = XLSX.utils.json_to_sheet(res.data.body);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                XLSX.writeFile(workbook, 'tableData.xlsx');
            });
        },
        exportToExcel() {
            const worksheet = XLSX.utils.json_to_sheet(this.tableData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'tableData.xlsx');
        },
        printTable() {
            const printContent = document.querySelector('.el-table').outerHTML;
            const printWindow = window.open('', '', 'width=800,height=600');
            printWindow.document.write(`
                <html>
                <head>
                    <title>打印表格</title>
                    <style>
                        @page {
                            size: landscape;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

}

</script>
