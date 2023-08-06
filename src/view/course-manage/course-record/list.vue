<template>
    <Card>
        <Form :model="search" inline :label-width="80" label-colon>
            <FormItem label="学号">
                <Input class="form-input" v-model="search.account" placeholder="请填写" clearable />
            </FormItem>
            <FormItem label="姓名">
                <Input class="form-input" v-model="search.user_name" placeholder="请填写" clearable />
            </FormItem>
            <Button class="operate" type="primary" @click="getTableData">搜索</Button>
            <Button class="operate" type="primary" @click="editTableData('add')">新增</Button>
        </Form>
        <Table :data="tables" :columns="columns" border>
            <template #operate="{ row }">
                <Button class="operate" type="primary" size="small" @click="editTableData('edit', row)">编辑</Button>
                <Button class="operate" type="error" size="small" @click="delTableData(row)">删除</Button>
            </template>
        </Table>
        <Page class="pagination" v-model="page.current" :total="page.total" placement="top" show-elevator show-sizer
            transfer @on-change="changePage" @on-page-size-change="changePageSize" />
        <Modal v-model="modal.visible" :title="modal.title" :width="modal.width" @on-cancel="modalCancel">
            <component :ref="modal.ref" :is="modal.component" :options="modal.props" :visible="modal.visible" />
            <template #footer>
                <Button class="operate" type="text" @click="modalCancel">取消</Button>
                <Button class="operate" type="primary" @click="modalConfirm">{{ modal.okText }}</Button>
            </template>
        </Modal>
    </Card>
</template>

<script>
import { markRaw } from 'vue';
import { mapActions } from 'vuex';
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
                { title: '学号', key: 'account', minWidth: 100, align: 'center' },
                { title: '姓名', key: 'user_name', minWidth: 100, align: 'center' },
                { title: '总分', key: 'total', minWidth: 100, align: 'center' },
                {
                    title: '平均分',
                    key: 'average',
                    minWidth: 100,
                    align: 'center',
                    render: (h, params) => {
                        return Math.round(params.row.total / this.course_list.length * 100) / 100
                    }
                },
                { title: '名次', key: 'rank', minWidth: 100, align: 'center' },
                { title: '操作', slot: 'operate', align: 'center', width: 140, fixed: 'right' }
            ];
            this.course_list.forEach(item => {
                const row = {
                    title: item.course_name,
                    key: `course_${item.course_id}`,
                    minWidth: 100,
                    align: 'center',
                    render: (h, params) => {
                        const value = params.row[`course_${item.course_id}`];
                        let style = {};
                        if (value >= 60) {
                            style.color = '#19be6b';
                        } else {
                            style.color = '#ed4014';
                        }
                        return h('div', {
                            style
                        }, value);
                    }
                };
                list.splice(2, 0, row);
            });
            return list;
        }
    },
    created() {
        this.getCourseList();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        ...mapActions('app', ['handleQueryData']),
        ...mapActions('user', ['handleEditTableData', 'handleDeleteTableData']),
        getCourseList: async function() {
            const { list = [] } = await this.handleQueryData({
                method: '/api/course/list'
            });
            this.course_list = list;
        },
        getTableData: async function() {
            let params = {
                page: this.page.current,
                page_size: this.page.size
            };
            Object.keys(this.search).forEach(key => {
                if (this.search[key] !== '') {
                    params[key] = this.search[key];
                }
            });

            const { list = [], total } = await this.handleQueryData({
                method: '/api/record/list',
                params
            });
            this.tables = list;
            this.page.total = total;
        },
        changePage(page) {
            Object.assign(this.page, { current: page });
            this.getTableData();
        },
        changePageSize(pageSize) {
            Object.assign(this.page, { size: pageSize });
            this.getTableData();
        },
        editTableData(type, item) {
            let options = {
                visible: true,
                okText: '提交',
                component: markRaw(editForm)
            };
            if (type === 'edit') {
                options.title = '编辑';
                options.ref = 'record-edit';
                options.props = { id: item.user_id };
            } else {
                options.title = '新增';
                options.ref = 'record-add';
            }
            Object.assign(this.modal, options);
        },
        delTableData(item) {
            const that = this;
            this.$Modal.confirm({
                title: '删除提醒',
                content: `是否删除${item.user_name}`,
                onOk: async () => {
                    await that.handleDeleteTableData({
                        method: '/api/record/delete',
                        id: item.user_id
                    });
                    this.$Notice.success({
                        title: '操作信息',
                        desc: '删除成功'
                    });
                    this.getTableData();
                },
            });
        },
        modalCancel() {
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
        modalConfirm: async function() {
            if (typeof this.$refs[this.modal.ref].beforeSubmit === 'function') {
                const formData = await this.$refs[this.modal.ref].beforeSubmit();

                let method = ''
                if (this.modal.ref === 'record-edit') {
                    method = '/api/record/edit';
                } else {
                    method = '/api/record/add';
                }

                await this.handleEditTableData({ method, params: formData });

                this.modalCancel();
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.form-input {
    width: 180px;
}
</style>
