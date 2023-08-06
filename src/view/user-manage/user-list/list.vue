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
                    <template v-if="$cookies.get('user_info').access_id == 1">
                        <Option :value="0">全部</Option>
                    </template>                   
                    <template v-for="access in access_list" :key="access.access_id">
                        <Option v-if="access.access_id > $cookies.get('user_info').access_id" :value="access.access_id">{{ access.access_name }}</Option>
                    </template>
                </Select>
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
            access_list: []
        }
    },
    created() {
        this.getAccessList();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        ...mapActions('app', ['handleQueryData']),
        ...mapActions('user', ['handleEditTableData', 'handleDeleteTableData']),
        getAccessList: async function() {
            const { list = [] } = await this.handleQueryData({
                method: '/api/access/list'
            });
            this.access_list = list;
        },
        getTableData: async function() {
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

            const { list = [], total = 0 } = await this.handleQueryData({
                method: '/api/user/list',
                params
            });
            const { access_id } = this.$cookies.get('user_info') || {};
            this.tables = list.filter(item => item.access_id !== access_id);
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
                options.ref = 'user-edit';
                options.props = { id: item.user_id };
            } else {
                options.title = '新增';
                options.ref = 'user-add';
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
                        method: '/api/user/delete',
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
                if (this.modal.ref === 'user-edit') {
                    method = '/api/user/edit';
                } else {
                    method = '/api/user/add';
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
