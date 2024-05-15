<div align="center">
    <h1>joot</h1>
    <p>项目 joot 是一个 chrome based 浏览器插件</p>
    <p>请参考 <a href="https://developer.chrome.google.cn/docs/extensions/develop/concepts/native-messaging">chrome extension native messaging</a> 配置对应操作系统，原生消息传递主机位置</p>
</div>

## 特性

-   截取网页
    -   滚动截取网页全部内容，生成图片
-   监听系统剪贴板变化，并获取内容

### 安装

> 如果你还没有安装 `pnpm`：
>
> ```bash
> npm i -g pnpm@latest
> ```

## 快速启动
根目录执行(支持热更新)
```bash
pnpm i
pnpm i build:clipboard
pnpm run hr:crx
```

## 构建
根目录执行
```bash
pnpm run pack
```