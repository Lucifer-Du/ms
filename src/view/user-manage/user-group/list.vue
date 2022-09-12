<template>
    <Card>
        <Form>
            <FormItem>
                <Button type="primary" @click="toAdd">新增</Button>
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
import { get, post } from '@/utils/http';
import editForm from './edit.vue';

export default {
    data() {
        return {
            tables: [],
            columns: [
                { title: '分组名称', key: 'name', align: 'center' },
                { title: '分组角色', key: 'role', align: 'center' },
                { title: '操作', slot: 'operate', align: 'center' }
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
        getTableData() {
            get('/api/user_group/list', {}).then(res => {
                const { code, data } = res;
                if (code === 1) {
                    this.tables = data;
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
                ref: 'user-group-add',
                component: editForm
            });
        },
        toEdit(item) {
            Object.assign(this.modal, {
                visible: true,
                title: `编辑`,
                okText: '提交',
                ref: 'user-group-edit',
                component: editForm,
                props: {
                    id: item.id
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
                if (formData.id) {
                    method = '/api/user_group/edit';
                } else {
                    method = '/api/user_group/add';
                }

                post(method, formData).then(res => {
                    const { code } = res;
                    if (code === 1) {
                        this.handleCancel();
                    }
                });
            }
        },
        toDelete(item) {
            this.$Modal.confirm({
                title: '删除提醒',
                content: `是否删除${item.name}`,
                onOk: () => {
                    post('/api/user_group/delete', {
                        id: item.id
                    }).then(res => {
                        const { code } = res;
                        if (code === 1) {
                            this.$Notice.success({
                                title: '操作信息',
                                desc: '删除成功'
                            });
                            this.getTableData();
                        } else {
                            // this.codeApi.getMsg(res);
                        }
                    });
                },
            });
        },
    }
}
</script>
