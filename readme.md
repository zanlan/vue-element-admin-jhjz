# 金海九州后台官网系统

## 安装依赖

```bash
# 安装依赖
npm install
```

## 启动开发服务

```sh
npm run dev
```

## 发布
```sh
# 开发环境
npm run build:dev
# 测试环境
npm run build:stage
# 产线环境
npm run build:prod
```
执行完成后，在项目目录下将生成 jhjzfund-oms-website-pc 文件夹，使用 nginx 部署。

添加 nginx 配置：

```nginx
location / {
    root   jhjzfund-oms-website-pc;
    # static下的文件设置缓存1年，其他的协商缓存
    add_header Cache-Control 'no-cache';
    if ($request_uri ~* ^/static) {
        add_header Cache-Control 'max-age=31536000';
    }
}
```