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
    created() {
        this.getUserList();
    },
    mounted() {
        this.getDetail();
    },
    methods: {
        ...mapActions('app', ['handleQueryData']),
        getUserList: async function() {
            const { list = [] } = await this.handleQueryData({
                method: '/api/user/list',
                params: { access_id: this.$cookies.get('user_info').access_id }
            });
            this.user_list = list;
        },
        getDetail: async function() {
            const { id = null } = this.options;
            if (!id) return false;
            const { course_id, course_name, user_id } = await this.handleQueryData({
                method: '/api/course/detail',
                params: { id }
            });
            Object.assign(this.formData, { id: course_id, course_name, user_id });
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
