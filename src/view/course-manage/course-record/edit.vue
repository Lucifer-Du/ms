<template>
    <Form ref="record-form" :model="formData" :label-width="100" :label-colon="true">
        <FormItem
            label="学生姓名"
            prop="user_id"
            :rules="{ required: true, type: 'number', message: '请选择学生', trigger: 'change' }"
        >
            <Select v-model="formData.user_id">
                <Option v-for="user in user_list" :key="user.user_id" :value="user.user_id">{{ user.user_name }}</Option>
            </Select>
        </FormItem>
        <FormItem 
            label="学科名称" 
            prop="course_id"
            :rules="{ required: true, type: 'array', min: 1, message: '请选择学科', trigger: 'change' }"
        >
            <template v-if="course_list.length > 0">
                <CheckboxGroup v-model="formData.course_id">
                    <Checkbox v-for="course in course_list" :key="course.course_id" :label="course.course_id">{{ course.course_name }}</Checkbox>
                </CheckboxGroup>
            </template>
            <template v-else>
                暂无数据
            </template>
        </FormItem>
        <template v-if="course_list.length > 0 && formData.course_id.length > 0">
            <template v-for="(item, index) in formData.course_id" :key="index">
                <FormItem
                    :label="`${course_list.filter(it => it.course_id === item)[0].course_name} 成绩`"
                    :prop="`course_record.course_${item}`"
                    :rules="{ required: true, message: '请填写成绩', trigger: 'blur change' }"    
                >
                    <Input v-model="formData.course_record[`course_${item}`]" placeholder="请填写"/>
                </FormItem>
            </template>
        </template>
    </Form>
</template>

<script>
import { get, post } from '@/utils/http';

export default {
    props: {
        options: {
            type: Object
        }
    },
    data() {
        return {
            formData: {
                user_id: '',
                course_id: [],
                course_record: {}
            },
            user_list: [],
            course_list: []
        }
    },
    async created() {
        await this.getUserList();
        await this.getCourseList();
        const { id } = this.options;
        if (id) {
            this.getDetail();
        }
    },
    methods: {
        getUserList() {
            get('/api/user/list', {
                access_id: 2
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { list = [] } = data;
                    this.user_list = list;
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
        },
        getCourseList() {
            get('/api/course/list', {}).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { list = [] } = data;
                    this.course_list = list;
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
        },
        getDetail() {
            get('/api/record/detail', {
                id: this.options.id
            }).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    let { user_id, user_name, ...record } = data;

                    const course_id = [], course_record = [];
                    for (let key in record) {
                        if(record[key] !== '') {
                            course_id.push(key);
                            course_record.push(record[key]);
                        }
                    }
                    Object.assign(this.formData, {
                        user_id,
                        user_name,
                        course_id: course_id.map(item => item.split('_')[1]).map(Number),
                        course_record: record
                    });
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
                this.$refs['record-form'].validate((valid) => {
                    if (valid) {
                        let { course_id, course_record, ...formData } = this.formData;
                        const ids = course_id.map(item => `course_${item}`);
                        course_record = ids.map(item => course_record[item]);
  
                        const params = {
                            ...formData,
                            course_id: course_id.join(','),
                            course_record: course_record.join(',')
                        };
                        resolve(params);
                    }
                });
            });
        },
    }
}
</script>