<template>
    <div class="login">
        <div class="login-con">
            <Card title="欢迎登录">
                <Form ref="login" :model="formData" :rules="rules" @keydown.enter.native="handleSubmit">
                    <FormItem prop="account">
                        <Input v-model="formData.account" placeholder="请填写用户名" prefix="ios-person" />
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="formData.password" placeholder="请填写密码" password prefix="md-lock" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long @click="handleLogin">登录</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
import { post } from '@/utils/http';

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
        beforeSubmit() {
            return new Promise((resolve) => {
                this.$refs['login'].validate((valid) => {
                    if (valid) {
                        resolve(this.formData);
                    }
                });
            });
        },
        async handleLogin() {
            const formData = await this.beforeSubmit();
            const { account } = formData;
            post('/api/user/query_account', {
                account
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    if (Object.keys(data).length > 0) {
                        const { user_id, user_name, password, access } = data;
                        if (formData.password === password) {
                            this.$cookies.set('user', {
                                user_id,
                                user_name,
                                access,
                                account
                            });

                            this.$router.push({
                                name: 'home'
                            });
                        } else {
                            this.$Notice.error({
                                title: '错误信息',
                                desc: '密码不正确'
                            });
                        }
                    } else {
                        this.$Notice.error({
                            title: '错误信息',
                            desc: '用户名不存在'
                        });
                    }
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
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