<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="form" :rules="rules" ref="infoForm">
            <el-form-item label="行政区域" label-width="100px">
                <el-input v-model="form.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="网格编号" label-width="100px">
                <el-input v-model="form.num" readonly></el-input>
            </el-form-item>
            <el-form-item label="异常原因" prop="fdAbnormalreason" label-width="100px">
                <el-input v-model="form.fdAbnormalreason" placeholder="异常原因(必填项)"></el-input>
            </el-form-item>
            <el-form-item label="整治措施" prop="fdRegulmeasures" label-width="100px">
                <el-input v-model="form.fdRegulmeasures" placeholder="整治措施(必填项)"></el-input>
            </el-form-item>
            <el-form-item label="预计完成时间" label-width="100px">
                <el-date-picker style="width: 100%"
                                v-model="form.feedbackDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="图片上传" label-width="100px">
                <div class="upload-wrap">
                    <el-upload action="#"
                               :file-list="fileList"
                               list-type="picture"
                               :auto-upload="false"
                               :multiple="true"
                               accept="image/jpeg,image/png,image/jpg"
                               :on-remove="handleRemove"
                               :http-request="uploadImage"
                               ref="upload">
                        <el-button size="small" type="primary">选择图片</el-button>
                    </el-upload>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="infoCheckSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {feedBack} from "@/api/businessSys/monitoringSystem/spaceDisplay";
    import {removeImage} from "@/api/system/menu";

    export default {
        name: "checkDialog",
        data() {
            return {
                title: '',
                dialogFormVisible: false,
                form: {
                    hotpointid: '',
                    fdType: 'A',
                    name: '',
                    num: '',
                    fdAbnormalreason: '',
                    fdRegulmeasures: '',
                    feedbackDate: '',
                    files: []
                },
                fileList: [],
                rules: {
                    fdAbnormalreason: [
                        {required: true, message: '请输入异常原因', trigger: 'blur'}
                    ],
                    fdRegulmeasures: [
                        {required: true, message: '请输入整治措施', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initDate();
            })
        },
        methods: {
            //初始化日期
            initDate() {
                let myDate = new Date(); //获取今天日期
                let day = myDate.getDate();
                let mon = myDate.getMonth() + 1;
                let year = myDate.getFullYear();
                let dateTemp = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
                this.form.feedbackDate = dateTemp;
            },
            infoCheckSubmit() {
                this.$refs.infoForm.validate((valid) => {
                    if (valid) {
                        this.$refs.upload.submit();  // 会循环调用uploadImage方法，多个文件调用多次
                        this.form.files = this.form.files+'';
                        //提交信息
                        feedBack(this.form).then(res => {
                            if(res.code === 200){
                                this.msgSuccess("核查信息反馈添加成功");
                                this.dialogFormVisible = false;//关闭窗口
                            }
                        }).catch(error => {
                        })
                    }else {
                        this.msgError("请输入必填项");
                    }
                })
            },

            //图片上传
            uploadImage(param) {
                this.form.files.push(param.file);
            },
            //移除图片列表中图片
            handleRemove(file, fileList) {
                let p = {
                    path: file.url
                }
                removeImage(p).then(response => {
                })
            }
        }
    }
</script>
