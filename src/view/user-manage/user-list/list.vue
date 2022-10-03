<template>
    <Card>
        <Form :model="search" inline :label-width="80" label-colon>
            <FormItem label="用户名">
                <Input class="form-input" v-model="search.user_name" placeholder="请填写" clearable />
            </FormItem>
            <FormItem label="用户账号">
                <Input class="form-input" v-model="search.account" placeholder="请填写" clearable />
            </FormItem>
            <FormItem label="用户身份">
                <Select class="form-input" v-model="search.access_id">
                    <Option :value="0">全部</Option>
                    <Option v-for="access in user_access" :key="access.access_id" :value="access.access_id">{{ access.access_name }}</Option>
                </Select>
            </FormItem>
            <Button class="operate" type="primary" @click="getTableData">搜索</Button>
            <Button class="operate" type="primary" @click="toAdd">新增</Button>
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
import editForm from './edit.vue';

export default {
    data() {
        return {
            search: {
                user_name: '',
                account: '',
                access_id: 0
            },
            tables: [],
            columns: [
                { title: '用户名', key: 'user_name', minWidth: 100, align: 'center' },
                { title: '用户账号', key: 'account', minWidth: 100, align: 'center' },
                { title: '用户身份', key: 'access_name', minWidth: 100, align: 'center' },
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
            },
            user_access: []
        }
    },
    created() {
        this.getUserAccess();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        getUserAccess() {
            get('/api/access/list', {}).then(res => {
                const { code, data } = res;
                if (code === 1) {
                    const { list = [] } = data;
                    this.user_access = list;
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
                if (key === 'access_id') {
                    if (Number(this.search[key]) !== 0) {
                        params[key] = this.search[key];
                    }
                } else {
                    if (this.search[key] !== '') {
                        params[key] = this.search[key];
                    }
                }
            });

            get('/api/user/list', params).then(res => {
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
                ref: 'user-group-add',
                component: markRaw(editForm)
            });
        },
        toEdit(item) {
            Object.assign(this.modal, {
                visible: true,
                title: `编辑`,
                okText: '提交',
                ref: 'user-group-edit',
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
                if (this.modal.type === 'user-group-edit') {
                    method = '/api/user/edit';
                } else {
                    method = '/api/user/add';
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
                    post('/api/user/delete', {
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

<style lang="scss" scoped>
.form-input {
    width: 180px;
}
</style>
