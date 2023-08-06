<template>
    <Card>
        <Form>
            <FormItem>
                <Button class="operate" type="primary" @click="editTableData('add')">新增</Button>
            </FormItem>
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
import editForm from './edit.vue';

export default {
    data() {
        return {
            tables: [],
            columns: [
                // { title: '学科编号', key: 'id', minWidth: 100, align: 'center' },
                { title: '学科名称', key: 'course_name', minWidth: 100, align: 'center' },
                { title: '学科教师', key: 'user_name', minWidth: 100, align: 'center' },
                { title: '操作', slot: 'operate', width: 140, align: 'center' }
            ],
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
    created() {
        this.getTableData();
    },
    methods: {
        ...mapActions('app', ['handleQueryData']),
        ...mapActions('user', ['handleEditCourse', 'handleDeleteCourse']),
        getTableData: async function() {
            let params = {
                page: this.page.current,
                page_size: this.page.size
            };

            const { user_id, access_id } = this.$cookies.get('user_info') || {};
            if (access_id != 1) {
                params.user_id = user_id;
            }

            const { list = [], total } = await this.handleQueryData({
                method: '/api/course/list',
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
                options.ref = 'course-edit';
                options.props = { id: item.course_id };
            } else {
                options.title = '新增';
                options.ref = 'course-add';
            }
            Object.assign(this.modal, options);
        },
        delTableData(item) {
            const that = this;
            this.$Modal.confirm({
                title: '删除提醒',
                content: `是否删除${item.name}`,
                onOk: async () => {
                    await that.handleDeleteTableData({
                        method: '/api/course/delete',
                        id: item.id
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
                if (this.modal.ref == 'course-edit') {
                    method = '/api/course/edit';
                } else {
                    method = '/api/course/add';
                }
                await this.handleEditTableData({ method, params: formData });

                this.modalCancel();
            }
        },
        
    }
}
</script>
