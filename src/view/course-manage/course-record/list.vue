<template>
    <Card>
        <Form :model="search" inline :label-width="80" label-colon>
            <FormItem label="学名">
                <Input class="form-input" v-model="search.account" placeholder="请填写" clearable />
            </FormItem>
            <FormItem label="姓名">
                <Input class="form-input" v-model="search.user_name" placeholder="请填写" clearable />
            </FormItem>
            <FormItem>
                <Button class="operate" type="primary" @click="getTableData">搜索</Button>
                <Button class="operate" type="primary" @click="toAdd">新增</Button>
            </FormItem>
        </Form>
        <Table :data="tables" :columns="columns" border>
            <template #operate="{ row }">
                <Button class="operate" type="primary" size="small" @click="toEdit(row)">编辑</Button>
                <Button class="operate" type="error" size="small" @click="toDelete(row)">删除</Button>
            </template>
        </Table>
        <Page class="pagination" v-model="page.current" :total="page.total" placement="top" show-elevator show-sizer
            transfer @on-change="changePage" @on-page-size-change="changePageSize" />
        <Modal v-model="modal.visible" :title="modal.title" :width="modal.width" @on-cancel="handleCancel">
            <component :ref="modal.ref" :is="modal.component" :options="modal.props" :visible="modal.visible" />
            <template #footer>
                <Button class="operate" type="text" @click="handleCancel">取消</Button>
                <Button class="operate" type="primary" @click="handleConfirm">{{ modal.okText }}</Button>
            </template>
        </Modal>
    </Card>
</template>

<script>
import { markRaw } from 'vue';
import { get, post } from '@/utils/http';
import editForm from "./edit.vue";

export default {
    data() {
        return {
            search: {
                account: '',
                user_name: ''
            },
            tables: [],
            course_list: [],
            page: {
                current: 1,
                total: 0,
                size: 10,
            },
            modal: {
                visible: false,
                title: '',
                okText: '确定',
                width: 520,
                ref: null,
                component: null,
                props: {},
            }
        }
    },
    computed: {
        columns() {
            const list = [
                { title: '学号', key: 'account', align: 'center', minWidth: 100 },
                { title: '姓名', key: 'user_name', align: 'center', minWidth: 100 },
                { title: '总分', key: 'total', align: 'center', minWidth: 100 },
                { title: '平均分', key: 'average', align: 'center', minWidth: 100 },
                { title: '排名', key: 'rank', align: 'center', minWidth: 100 },
                { title: '操作', slot: 'operate', align: 'center', width: 140, fixed: 'right' }
            ];
            this.course_list.forEach(item => {
                list.splice(2, 0, { title: item.course_name, key: `course_${item.course_id}`, align: 'center', minWidth: 100 });
            });
            return list;
        }
    },
    async created() {
        await this.getCourseList();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        async getCourseList() {
            await get('/api/course/list', {}).then(res => {
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
        getTableData() {
            let params = {
                page: this.page.current,
                page_size: this.page.size
            };
            Object.keys(this.search).forEach(key => {
                if (this.search[key] !== '') {
                    params[key] = this.search[key];
                }
            });

            get('/api/record/list', params).then(res => {
                const { code, data = {} } = res;
                if (code === 1) {
                    const { list = [], total } = data;
                    this.tables = list;
                    this.page.total = total;
                } else {
                    this.$Notice.error({
                        title: '错误信息',
                        desc: res.msg
                    });
                }
            });
        },
        changePage(page) {
            Object.assign(this.page, { current: page });
            this.getTableData();
        },
        changePageSize(pageSize) {
            Object.assign(this.page, { size: pageSize });
            this.getTableData();
        },
        toAdd() {
            Object.assign(this.modal, {
                visible: true,
                title: '新增',
                okText: '提交',
                ref: 'user-record-add',
                component: markRaw(editForm)
            });
        },
        toEdit(item) {
            Object.assign(this.modal, {
                visible: true,
                title: `编辑`,
                okText: '提交',
                ref: 'user-record-edit',
                component: markRaw(editForm),
                props: {
                    id: item.user_id
                }
            });
        },
        handleCancel() {
            this.modal = {
                visible: false,
                title: '',
                okText: '确定',
                width: 520,
                ref: null,
                component: null,
                props: {},
            };
            this.getTableData();
        },
        async handleConfirm() {
            if (typeof this.$refs[this.modal.ref].beforeSubmit === 'function') {
                const formData = await this.$refs[this.modal.ref].beforeSubmit();
                let method = ''
                if (this.modal.ref === 'user-record-add') {
                    method = '/api/record/add';
                } else {
                    method = '/api/record/edit';
                }

                post(method, formData).then(res => {
                    const { code } = res;
                    if (code === 1) {
                        this.handleCancel();
                    } else {
                        this.$Notice.error({
                            title: '错误信息',
                            desc: res.msg
                        });
                    }
                });
            }
        },
        toDelete(item) {
            this.$Modal.confirm({
                title: '删除提醒',
                content: `是否删除${item.user_name}`,
                onOk: () => {
                    post('/api/record/delete', {
                        id: item.user_id
                    }).then(res => {
                        const { code } = res;
                        if (code === 1) {
                            this.$Notice.success({
                                title: '操作信息',
                                desc: '删除成功'
                            });
                            this.getTableData();
                        } else {
                            this.$Notice.error({
                                title: '错误信息',
                                desc: res.msg
                            });
                        }
                    });
                },
            });
        },
    }
}
</script>
