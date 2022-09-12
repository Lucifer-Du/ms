<template>
    <Form ref="user-group-form" :model="formData" :rules="rules" :label-width="100" :label-colon="true">
        <FormItem label="分组名称" prop="name">
            <Input v-model.trim="formData.name" placeholder="请填写" />
        </FormItem>
        <FormItem label="分组角色" prop="role">
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
                role: ''
            },
            rules: {
                name: [
                    { required: true, message: '请填写分组名称', trigger: 'blur change' }
                ],
                role: [
                    { required: true, message: '请选择分组角色', trigger: 'change' }
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
            get('/api/user_group/detail', {
                id: this.options.id
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { id, name, role } = data;
                    Object.assign(this.formData, { id, name, role });
                }
            });
        },
        beforeSubmit() {
            return new Promise((resolve) => {
                this.$refs['user-group-form'].validate((valid) => {
                    if (valid) {
                        resolve(this.formData);
                    }
                });
            });
        }
    }
}
</script>
