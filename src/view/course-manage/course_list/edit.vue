<template>
    <Form ref="course-form" :model="formData" :rules="rules" :label-width="100" :label-colon="true">
        <FormItem label="学科名称" prop="course_name">
            <Input v-model.trim="formData.course_name" placeholder="请填写" />
        </FormItem>
        <FormItem label="学科教师" prop="user_id">
            <Select v-model="formData.user_id">
                <Option v-for="user in user_list" :key="user.user_id" :value="user.user_id">{{ user.user_name }}</Option>
            </Select>
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
                course_name: '',
                user_id: 0
                
            },
            rules: {
                course_name: [
                    { required: true, message: '请填写学科名称', trigger: 'blur change' }
                ],
                user_id: [
                    { required: true, type: 'number', message: '请选择学科教师', trigger: 'blur change' }
                ]
            },
            user_list: []
        }
    },
    async created() {
        await this.getUserList();
        const { id = null } = this.options;
        if (id) {
            this.getDetail();
        }
    },
    mounted() {
        
    },
    methods: {
        async getUserList() {
            await get('/api/user/list', {
                access_id: 1
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { list = [] } = data;
                    this.user_list = [...list];
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
        },
        getDetail() {
            get('/api/course/detail', {
                id: this.options.id
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { course_id, course_name, user_id } = data;
                    Object.assign(this.formData, { id: course_id, course_name, user_id });
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
                this.$refs['course-form'].validate((valid) => {
                    if (valid) {
                        resolve(this.formData);
                    }
                });
            });
        }
    }
}
</script>
