<template>
    <Card>
        <Card class="section" title="个人信息">
            <!-- <Form ref="user-edit-username" :model="username" :rules="username_rules" :label-width="100" :label-colon="true">
                <FormItem label="当前用户名" prop="user_name">
                    <Input class="form-input" v-model="username.user_name" :disabled="disabled.user_name"/>
                    <template v-if="disabled.user_name">
                        <Button class="operate" type="primary" @click="disabled.user_name = false">修改</Button>
                    </template>
                    <template v-else>
                        <Button class="operate" type="primary" @click="handleEdit">提交</Button>
                    </template>
                </FormItem>
            </Form> -->
            <Form ref="user-edit-password" :model="password" :rules="password_rules" :label-width="100" :label-colon="true">
                <FormItem label="当前密码" prop="current">
                    <Input class="form-input" type="password" v-model="password.current" password :disabled="disabled.password"/>
                    <template v-if="disabled.password">
                        <Button class="operate" type="primary" @click="disabled.password = false">修改</Button>
                    </template>
                    <template v-else>
                        <Button class="operate" type="primary" @click="handleEdit">提交</Button>
                        <Button class="operate" type="default" @click="disabled.password = true">取消</Button>
                    </template>
                </FormItem>
                <template v-if="!disabled.password">
                    <FormItem label="新密码" prop="newone">
                        <Input class="form-input" v-model="password.newone" placeholder="请填写"></Input>
                    </FormItem>
                    <FormItem label="确认密码" prop="confirm">
                        <Input class="form-input" v-model="password.confirm" placeholder="请填写"></Input>
                    </FormItem>
                </template>
            </Form>
        </Card>
        <Card class="section" :title="card_title">
            <template v-if="list.length > 0">
                <template v-if="user.access === 'student'">
                    <template v-for="(item, index) in list" :key="index">
                        <div>{{ item.course_name }}: {{ item.course_record }}</div>
                    </template>
                    <div>总分: {{ total }}</div>
                </template>
                <template v-else>
                    <template v-for="(item, ii) in list" :key="ii">
                        <div class="item">
                            <div class="item-lable">学科: {{ item.course_name }}</div>
                            <template v-for="(sub, si) in item.data" :key="si">
                                <div class="sub-item">学生：{{ sub.user_name }}, 成绩：{{ sub.course_record }}</div>
                            </template>
                        </div>
                    </template>
                </template>
            </template>
            <template v-else>
                <div>
                    暂无数据
                </div>
            </template>
        </Card>
    </Card>
</template>

<script>
import { post, get } from '@/utils/http';

export default {
    data() {
        return {
            user_info: {
                user_name: '',
                password: ''
            },
            username: {
                user_name: ''
            },
            username_rules: {
                user_name: [
                    { required: true, message: '请填写用户名', trigger: 'blur change' }
                ]
            },
            password: {
                current: '',
                newone: '',
                confirm: ''
            },
            password_rules: {
                current: [
                    { required: true, message: '请填写当前密码', trigger: 'blur change' }
                ],
                newone: [
                    { required: true, message: '请填写新密码', trigger: 'blur change' },
                    { validator: (rule, value, callback) => {
                        if (value === this.password.current) {
                            callback(new Error('新密码与当前密码一样'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur change' }
                ],
                confirm: [
                    { required: true, message: '请填写确认密码', trigger: 'blur change' },
                    { validator: (rule, value, callback) => {
                        if (value !== this.password.newone) {
                            callback(new Error('确认密码与新密码不一样'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur change' }
                ]
            },
            disabled: {
                user_name: true,
                password: true
            },
            list: [],
            total: 0
        }
    },
    computed: {
        user() {
            return this.$cookies.get('user');
        },
        card_title() {
            const { access } = this.user;
            let title = '';
            switch(access) {
                case 'student':
                    title = '学科成绩';
                    break;
                case 'teacher':
                    title = '教授学科';
                    break;
            }
            return title;
        },
    },
    created() {
        this.query_userinfo();
        this.queryData();
    },
    mounted() {

    },
    methods: {
        query_userinfo() {
            post('/api/user/query_account', {
                account: this.user.account
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { user_id, ...user_info } = data;
                    this.user_info = {
                        ...user_info,
                        id: user_id
                    };
                    this.username.user_name = user_info.user_name;
                    this.password.current = user_info.password;
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
        },
        handleEdit() {
            let ref = null;
            if (!this.disabled.user_name) {
                ref = 'user-edit-username';
                this.user_info.user_name = this.username.user_name;
            } else if (!this.disabled.password) {
                ref = 'user-edit-password';
                this.user_info.password = this.password.confirm;
            }

            this.$refs[ref].validate((valid) => {
                if (valid) {
                    post('/api/user/edit', this.user_info).then(res => {
                        const { code } = res;
                        if (code === 1) {
                            this.disabled = {
                                user_name: true,
                                password: true
                            };
                        } else {
                            this.$Notice.error({
                                title: '错误信息',
                                desc: res.msg
                            });
                        }
                    });
                }
            });
        },
        queryCourse() {
            return new Promise((resolve, reject) => {
                get('/api/course/list', {}).then(res => {
                    const { code, data = {} } = res;
                    if (code === 1) {
                        const { list = [], total = 0 } = data;
                        resolve(list);
                    } else {
                        this.$Notice.error({
                            title: '错误信息',
                            desc: res.msg
                        });
                    }
                });
            })
        },
        queryData() {
            const { user_id, access } = this.user;
            post('/api/user/query_userinfo', {
                user_id,
                access
            }).then(res => {
                const { code, data = [] } = res;
                if (code === 1) {
                    if (data.length <= 0) return false;
                    switch(access) {
                        case 'student':
                            this.list = data;
                            const student = data.map(item => item.course_record).map(Number);
                            this.total = student.reduce((pre, cur) => {
                                pre += cur;
                                return pre;
                            }, 0);
                            break;
                        case 'teacher':
                            let names = [];
                            let teacher = [];
                            data.forEach(item => {
                                const { course_name = null, user_name = null, course_record = null } = item;
                                if (names.includes(item.course_name)) {
                                    const index = names.indexOf(course_name);
                                    teacher[index].data.push({user_name, course_record});
                                } else {
                                    names.push(course_name)
                                    teacher.push(
                                        { course_name, data: [{ user_name, course_record }]}
                                    );
                                }
                            })
                            this.list = teacher;
                            break;
                    }
                    // this.list = list
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
.form-input {
    width: 180px;
}
.section {
    margin-top: 16px;

    &:first-child {
        margin-top: 0;
    }
}
</style>