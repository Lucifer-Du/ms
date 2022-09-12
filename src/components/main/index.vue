<template>
    <Layout class="layout">
        <Sider>
            <Menu :active-name="active_name" theme="dark" width="auto" :open-names="open_names">
                <template v-for="menu in menu_list" :key="menu.name">
                    <template v-if="!menu.meta.hideInMenu">
                        <Submenu :name="menu.name">
                            <template #title>
                                <Icon type="ios-navigate"></Icon>
                                {{ menu.meta.title }}
                            </template>
                            <MenuItem v-for="menuItem in menu.children" :key="menuItem.name" :name="menuItem.name"
                                :to="menuItem.name">
                            {{ menuItem.meta.title }}
                            </MenuItem>
                        </Submenu>
                    </template>
                </template>
            </Menu>
        </Sider>
        <Content>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </Content>
    </Layout>
</template>

<script>
import { routes } from '@/router';

export default {
    data() {
        return {
            // active_name: '',
            // open_names: [],
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
        }
    },
    methods: {

    }
}
</script>

<style lang="scss">
.layout {
    height: 100vh;
}

.operate {
    margin-left: 8px;

    &:first-child {
        margin-left: 0;
    }
}

.pagination {
    margin-top: 16px;
}
</style>
