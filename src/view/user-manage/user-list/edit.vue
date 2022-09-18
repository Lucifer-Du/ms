<template>
    <Form ref="user-form" :model="formData" :rules="rules" :label-width="100" :label-colon="true">
        <FormItem label="用户名" prop="user_name">
            <Input v-model.trim="formData.user_name" placeholder="请填写" />
        </FormItem>
        <FormItem label="用户账号" prop="account">
            <Input v-model.trim="formData.account" placeholder="请填写" />
        </FormItem>
        <FormItem label="用户密码" prop="password">
            <Input type="password" v-model.trim="formData.password" placeholder="请填写" password />
        </FormItem>
        <FormItem label="用户身份" prop="access_id">
            <RadioGroup v-model="formData.access_id">
                <Radio v-for="item in user_access" :key="item.access_id" :label="item.access_id">{{ item.access_name }}</Radio>
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
                user_name: '',
                account: '',
                password: '',
                access_id: ''
            },
            rules: {
                user_name: [
                    { required: true, message: '请填写用户名', trigger: 'blur change' }
                ],
                account: [
                    { required: true, message: '请填写用户账号', trigger: 'blur change' }
                ],
                password: [
                    { required: true, message: '请填写用户密码', trigger: 'blur change' }
                ],
                access_id: [
                    { required: true, type: 'number', message: '请选择用户身份', trigger: 'change' }
                ],
            },
            user_access: []
        }
    },
    created() {
        this.getUserAccess();
    },
    mounted() {
        const { id } = this.options;
        if (id) {
            this.getDetail();
        }
    },
    methods: {
        getDetail() {
            get('/api/user/detail', {
                id: this.options.id
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { user_id, user_name, account, password, access_id } = data;
                    Object.assign(this.formData, { id: user_id, user_name, account, password, access_id });
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
        },
        getUserAccess() {
            get('/api/access/list', {}).then(res => {
                const { code, data } = res;
                if (code === 1) {
                    const { list = [] } = data;
                    this.user_access = list;
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
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
