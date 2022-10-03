# Node安装
官网：https://nvm.uihtm.com/
下载: http://nvm.uihtm.com/nvm1.1.9-setup.zip
```bash
# insatll
nvm install 16.17.1
# use
nvm use 16.17.1
# nvm常见问题
如果下载node过慢，请更换国内镜像源, 在 nvm 的安装路径下，找到 settings.txt，设置node_mirro与npm_mirror为国内镜像地址。下载就飞快了~~
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

# 项目依赖安装
```bash
# 前端: root
npm install

# 后端: root \ server
cd server
npm install
```

# 项目启动
```bash
# 项目: root
npm run start
```
