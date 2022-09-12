<template>
    <Form ref="user-form" :model="formData" :rules="rules" :label-width="100" :label-colon="true">
        <FormItem label="用户名" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写" />
        </FormItem>
        <FormItem label="用户账号" prop="account">
            <Input v-model.trim="formData.account" placeholder="请填写" />
        </FormItem>
        <FormItem label="用户密码" prop="password">
            <Input v-model.trim="formData.password" placeholder="请填写" />
        </FormItem>
        <FormItem label="用户身份" prop="role">
            <RadioGroup v-model="formData.role">
                <Radio label="teacher">教师</Radio>
                <Radio label="student">学生</Radio>
            </RadioGroup>
        </FormItem>
    </Form>
</template>

<script>
import { get } from '@/utils/http';

export default {
    props: {
        options: {
            type: Object
        }
    },
    data() {
        return {
            formData: {
                name: '',
                account: '',
                password: '',
                role: ''
            },
            rules: {
                name: [
                    { required: true, message: '请填写用户名', trigger: 'blur change' }
                ],
                account: [
                    { required: true, message: '请填写用户账号', trigger: 'blur change' }
                ],
                password: [
                    { required: true, type:'number', message: '请填写用户密码', trigger: 'blur change' }
                ],
                role: [
                    { required: true, message: '请选择用户身份', trigger: 'change' }
                ],
            }
        }
    },
    created() {
        const { id } = this.options;
        if (id) {
            this.getDetail();
        }
    },
    methods: {
        getDetail() {
            get('/api/user_list/detail', {
                id: this.options.id
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { id, name, account, password, role } = data;
                    Object.assign(this.formData, { id, name, account, password, role });
                }
            });
        },
        beforeSubmit() {
            return new Promise((resolve) => {
                this.$refs['user-form'].validate((valid) => {
                    if (valid) {
                        resolve(this.formData);
                    }
                });
            });
        }
    }
}
</script>
