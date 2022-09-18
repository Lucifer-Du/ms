<template>
    <Layout class="layout">
        <Sider>
            <Menu :active-name="active_name" theme="dark" width="auto" :open-names="open_names">
                <template v-for="menu in menu_list" :key="menu.name">
                    <template v-if="!menu.meta.hideInMenu && menu.meta.access.includes(user.access)">
                        <template v-if="menu.children">
                            <Submenu :name="menu.name">
                                <template #title>
                                    <Icon type="ios-navigate"></Icon>
                                    {{ menu.meta.title }}
                                </template>
                                <template v-for="menuItem in menu.children" :key="menuItem.name">
                                    <MenuItem v-if="menuItem.meta.access.includes(user.access)" :name="menuItem.name" :to="menuItem.path">
                                        {{ menuItem.meta.title }}
                                    </MenuItem>
                                </template>
                            </Submenu>
                        </template>
                        <template v-else>
                            <MenuItem v-if="menu.meta.access.includes(user.access)" :key="menu.name" :name="menu.name" :to="menu.path">
                                {{ menu.meta.title }}
                            </MenuItem>
                        </template>
                    </template>
                </template>
            </Menu>
        </Sider>
        <Layout>
            <Header class="layout-header">
                <Dropdown class="user-box" @on-click="handleClick">
                    <Badge>
                        <span class="user-name">{{ user.user_name }}</span>
                        <Avatar src="https://file.iviewui.com/view-design-dist/img/avatar1.a6b8575f.png"/>
                    </Badge>
                    <Icon :size="18" type="md-arrow-dropdown"></Icon>
                    <template #list>
                        <DropdownMenu>
                            <DropdownItem name="logout">退出登录</DropdownItem>
                        </DropdownMenu>
                    </template>
                </Dropdown>
            </Header>
            <Content class="layout-content">
                <router-view/>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import { routes } from '@/router';

export default {
    data() {
        return {
            menu_list: routes
        }
    },
    computed: {
        open_names() {
            const { matched } = this.$route;
            const { name } = matched[0];
            return [name];
        },
        active_name() {
            const { name } = this.$route;
            return name;
        },
        user() {
            return this.$cookies.get('user');
        }
    },
    created() {

    },
    methods: {
        handleClick(name) {
            switch(name) {
                case 'logout':
                    this.$cookies.remove('user');
                    this.$router.push({
                        name: 'login'
                    });
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.layout {
    height: 100vh;
}

.user-box {
    display: flex;
    align-items: center;
}

.user-name {
    margin-right: 8px;
}

:deep(.ivu-layout-header){
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

:deep(.layout-content) {
    margin: 16px;
}

:deep(.operate) {
    margin-left: 8px;

    &:first-child {
        margin-left: 0;
    }
}

:deep(.pagination) {
    margin-top: 16px;
}
</style>
