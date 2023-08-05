<template>
    <div class="login">
        <div class="login-con">
            <Card title="欢迎登录">
                <Form ref="login-form" :model="formData" :rules="rules" @keydown.enter.native="login">
                    <FormItem prop="account">
                        <Input v-model="formData.account" placeholder="请填写用户名" prefix="ios-person" />
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="formData.password" placeholder="请填写密码" password prefix="md-lock" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long @click="login">登录</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            formData: {
                account: '',
                password: ''
            },
            rules: {
                account: [
                    { required: true, message: '账号不能为空', trigger: 'blur change' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur change' }
                ]
            }

        }
    },
    methods: {
        ...mapActions('user', ['handleLogin']),
        beforeSubmit() {
            return new Promise((resolve) => {
                this.$refs['login-form'].validate((valid) => {
                    if (valid) {
                        resolve(this.formData);
                    }
                });
            });
        },
        login: async function() {
            const formData = await this.beforeSubmit();
            this.handleLogin(formData);
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    width: 100vw;
    height: 100vh;
    background: url("https://file.iviewui.com/admin-dist/img/login-bg.0899ffa6.jpg") no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;

    &-con {
        width: 300px;
        position: absolute;
        top: 50%;
        right: 160px;
        transform: translateY(-60%);
    }
}
</style>