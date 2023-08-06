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
                <template v-for="item in access_list" :key="item.access_id">
                    <Radio v-if="item.access_id > $cookies.get('user_info').access_id" :label="item.access_id">{{ item.access_name }}</Radio>
                </template>
            </RadioGroup>
        </FormItem>
    </Form>
</template>

<script>
import { mapActions } from 'vuex';

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
            access_list: []
        }
    },
    created() {
        this.getUserAccess();
    },
    mounted() {
        this.getUserDetail();
    },
    methods: {
        ...mapActions('app', ['handleQueryData']),
        getUserAccess: async function() {
            const { list = [] } = await this.handleQueryData({
                method: '/api/access/list'
            });
            this.access_list = list;
        },
        getUserDetail: async function() {
            const { id } = this.options;
            if (!id) return false;
            const { user_id, user_name, account, password, access_id } = await this.handleQueryData({
                method: '/api/user/detail',
                params: { id }
            });
            Object.assign(this.formData, { id: user_id, user_name, account, password, access_id });
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
