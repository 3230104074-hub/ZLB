# 邹洛斌的个人记录

一个记录课程学习、体育训练、科研学习和日常生活的个人网站。

网站地址：<https://3230104074-hub.github.io/ZLB/>

## 网站内容

- 课程笔记
- 训练日志
- 科研札记
- 每日记录

## 常用文件

```text
assets/js/site-config.js       修改姓名、简介、邮箱和 GitHub
assets/js/records-data.js      添加、修改或删除文章
NEW-RECORD-TEMPLATE.txt        新文章模板
```

## 修改个人信息

打开 `assets/js/site-config.js`，修改 `owner` 中的内容：

```js
owner: {
  name: "邹洛斌",
  initials: "ZLB",
  intro: "这里填写个人简介。",
  email: "3230104074@zju.edu.cn",
  githubUrl: "",
}
```

## 添加新文章

1. 打开 `NEW-RECORD-TEMPLATE.txt`。
2. 复制完整模板。
3. 粘贴到 `assets/js/records-data.js` 的 `window.RECORDS = [` 后面。
4. 修改文章的日期、标题、摘要、标签和正文。
5. 保存文件并上传到 GitHub。

文章分类填写下面四种之一：

```text
course     课程笔记
training   训练日志
research   科研札记
daily      每日记录
```

每篇文章的 `id` 必须使用英文、数字或短横线，而且不能重复。

## 发布设置

GitHub Pages 保持下面的设置即可：

```text
Branch：main
Folder：/ (root)
```

仓库根目录需要直接看到 `index.html`、`assets` 和 `notes`。

每次修改并提交后，等待几分钟，网站会自动更新。

## 本地预览

双击 `start-preview.bat`，或者直接打开 `index.html`。

> 网站内容是公开的，请不要上传密码、验证码、身份证号或其他隐私信息。
