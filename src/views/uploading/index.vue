<template>
    <div class="app-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="磁盘路径:">
                <el-input
                    v-model="formInline.path"
                    placeholder="磁盘路径"
                    style="width: 400px"
                ></el-input>
            </el-form-item>
            <label
                for=""
                style="
                    text-align: right;
                    vertical-align: middle;
                    font-size: 14px;
                    color: #606266;
                    line-height: 40px;
                    padding: 0 12px 0 0;
                    box-sizing: border-box;
                "
                >裸地时间:</label
            >
            <el-date-picker
                v-model="formInline.value1"
                type="datetime"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间"
            >
            </el-date-picker>
        </el-form>

        <div class="upload-file">
            <el-upload
                accept=".dbf, .prj, .sbn, .sbx, .shp,.shp.xml,.shx,.pdf"
                ref="upload"
                multiple
                :action="url"
                :on-preview="handlePreview"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :on-progress="handleProgress"
                :file-list="fileList"
                :http-request="uploadFile"
                :auto-upload="false"
            >
                <el-button slot="trigger" size="small" type="primary"
                    >选取文件</el-button
                >
                <el-button
                    style="margin-left: 133px"
                    size="small"
                    type="success"
                    @click="submitUpload"
                    >上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">
                    裸地数据所需必要文件:.dbf,.prj,.sbx,.shp;裸地季报所需必要文件:.pdf，
                    且不超过100m
                </div>
            </el-upload>
        </div>
    </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { editEviCard } from "@/api/upload";
import axios from "axios";
export default {
    data() {
        return {
            url: process.env.VUE_APP_BASE_API + "/map/analyticalShp",
            fileData: "", // 文件上传数据（多文件合一）
            fileList: [], // upload多文件数组
            typelist: [],
            typelistnew: ["dbf", "prj", "sbx", "shp", "pdf"],
            uploadData: {
                fieldData: {
                    id: "", // 机构id,
                },
            },
            formInline: {
                path: "F:/HTHT/Product/130000/product_data/130100/BREALAND",
                value1: "",
            },
        };
    },
    methods: {
        handlePreview() {},
        // 上传文件
        uploadFile(file) {
            this.fileData.append("file[]", file.file); // append增加数据
        },

        // 上传到服务器
        submitUpload() {
            let fieldData = this.uploadData.fieldData; // 缓存，注意，fieldData不要与fileData看混
            if (this.formInline.value1 === "") {
                this.$message({
                    message: "请选择上传时间",
                    type: "warning",
                });
            } else {
                const isLt100M = this.fileList.every(
                    (file) => file.size / 1024 / 1024 < 100
                );
                if (!isLt100M) {
                    this.$message.error("请检查，上传文件大小不能超过100MB!");
                } else {
                    let val = this.formInline.value1.replace(/-/g, "");
                    this.fileData = new FormData(); // new formData对象
                    this.$refs.upload.submit(); // 提交调用uploadFile函数
                    this.fileData.append("datatime", val); // 添加机构id
                    this.fileData.append("path", this.formInline.path); // 添加token
                    axios
                        .post(
                            process.env.VUE_APP_BASE_API + "map/analyticalShp",
                            this.fileData
                        )
                        .then((response) => {
                            if (response.data.success == true || response.data.msg=='上传成功') {
                                this.$message({
                                    message: "上传成功",
                                    type: "success",
                                });
                                this.fileList = [];
                            } else {
                                this.$message({
                                    message: response.data.desc,
                                    type: "error",
                                });
                            }
                        });
                }
            }
        },
        //移除
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        isContainArr(parent, child) {
            return child.every((item) => {
                return parent.some((v) => {
                    return item == v;
                });
            });
        },
        //监控上传文件列表
        handleChange(file, fileList) {
            this.typelist = [];
            let lastfileneme = "";
            if (fileList.length > 0) {
                fileList.forEach((element) => {
                    let fileName = element.name.substring(
                        element.name.lastIndexOf(".") + 1
                    );
                    if (lastfileneme == fileName) {
                        return;
                    } else {
                        lastfileneme = fileName;
                        this.typelist.push(fileName);
                    }
                });
                if (this.isContainArr(this.typelist, this.typelistnew)) {
                    let existFile = fileList
                        .slice(0, fileList.length - 1)
                        .find((f) => f.name === file.name);
                    if (existFile) {
                        this.$message.warning("当前文件已经存在!");
                        fileList.pop();
                    }
                    this.fileList = fileList;
                } else {
                    // this.$message({
                    //     message: "请先选择对应的文件",
                    //     type: "warning",
                    // });
                }
            } else {
                this.$message.warning(
                    "裸地数据所需必要文件:.dbf,.prj,.sbx,.shp;裸地季报所需必要文件:.pdf"
                );
            }
        },
        handleProgress(event, file, fileList) {
        },
    },
};
</script>

<style scoped>
.app-container {
    min-width: 1366px;
    overflow-x: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 1366px;
    overflow-x: auto;
}
</style>