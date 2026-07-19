# 邹洛斌的个人记录网站

这是一个可以直接发布到 GitHub Pages 的纯静态网站，不需要安装 npm，也不需要数据库。

页面采用经典个人博客结构：全屏蓝色首屏、文章列表与个人侧栏、文章归档、分类筛选，以及带目录的文章详情页。发布后会得到一个公开网址，任何人都可以直接访问。

网站目前包含四类内容：

- 课程笔记：课程重点、作业思路、知识框架和复盘
- 训练日志：训练项目、强度、身体感受和恢复情况
- 科研札记：论文阅读、实验过程、问题分析和研究想法
- 每日记录：当天的学习、生活、感受和明日计划

已经填写：

- 姓名：邹洛斌
- 邮箱：3230104074@zju.edu.cn
- GitHub：暂时留空，填写后按钮会自动生效

---

## 一、怎样在电脑上预览

最简单的方法：双击网站文件夹中的：

```text
start-preview.bat
```

浏览器会打开：

```text
http://localhost:8000
```

预览期间不要关闭黑色命令窗口。完成预览后，在窗口中按 `Ctrl + C` 停止。

如果电脑提示找不到 Python，也可以直接双击 `index.html` 查看。这个网站的数据通过普通 JavaScript 文件加载，所以直接双击也能显示文章。

推荐使用 VS Code 编辑文件，保存后刷新浏览器即可看到变化。

---

## 二、怎样修改姓名、简介、邮箱和 GitHub

打开：

```text
assets/js/site-config.js
```

个人资料集中在这里：

```js
owner: {
  name: "邹洛斌",
  initials: "ZLB",
  intro: "我在这里记录课程学习、体育训练、科研探索，以及平凡但重要的每一天。",
  email: "3230104074@zju.edu.cn",
  githubUrl: "",
},
```

### 以后添加 GitHub

把空的 `githubUrl` 改成你的 GitHub 主页地址：

```js
githubUrl: "https://github.com/你的用户名",
```

保存后，首页右侧个人资料卡中的 GitHub 按钮就可以打开你的主页。

姓名、简介和站点标题修改后，浏览器标签页会自动同步。`site.webmanifest` 使用通用名称“个人学习与生活记录”，通常不需要跟着修改。

### 修改板块名称

同一个文件中还有 `categories`。例如：

```js
{
  id: "course",
  number: "01",
  name: "课程笔记",
  shortName: "课程",
  description: "整理课堂重点、作业思路、知识框架与阶段复盘。",
},
```

可以修改 `name`、`shortName` 和 `description` 的中文文字。

不要修改 `id`，否则原来的文章会找不到分类。

---

## 三、怎样新增一篇文章

所有文章都集中在：

```text
assets/js/records-data.js
```

你不需要新建 HTML 页面。新增一条数据后，网站会自动完成下面这些事情：

- 首页“最新文章”列表出现文章，并显示正确分类
- “全部记录”页面出现文章
- 搜索和分类筛选可以找到文章
- 自动生成文章详情页
- 自动计算阅读时间
- 自动按日期从新到旧排列

### 第 1 步：复制模板

打开网站根目录中的：

```text
NEW-RECORD-TEMPLATE.txt
```

复制从 `{` 到 `},` 的全部内容。

### 第 2 步：粘贴到文章数据文件顶部

打开：

```text
assets/js/records-data.js
```

找到：

```js
window.RECORDS = [
```

把模板粘贴到这一行的下面。最新文章建议放在最上面。

### 第 3 步：修改文章信息

一篇文章的基本格式如下：

```js
{
  id: "2026-07-15-my-new-record",
  category: "daily",
  title: "今天的学习与生活",
  date: "2026-07-15",
  summary: "用一两句话概括今天最重要的事情。",
  tags: ["日常", "学习"],
  sections: [
    {
      title: "今天完成",
      list: [
        "完成的第一件事",
        "完成的第二件事",
      ],
    },
    {
      title: "今天的思考",
      paragraphs: [
        "在这里写一段自己的感受或思考。",
      ],
    },
  ],
},
```

各字段的含义：

| 字段 | 怎样填写 |
| --- | --- |
| `id` | 文章唯一编号，只用英文、数字和短横线，不能重复 |
| `category` | 文章属于哪个板块，只能从下面四个英文值中选择 |
| `title` | 文章标题 |
| `date` | 日期，必须使用 `YYYY-MM-DD` |
| `summary` | 一两句话的摘要，会显示在列表中 |
| `tags` | 标签，可以填写 1～4 个 |
| `sections` | 正文，由多个小节组成 |

分类对应关系：

```text
course    课程笔记
training  训练日志
research  科研札记
daily     每日记录
```

### 第 4 步：保存并检查

保存文件，然后刷新本地预览页面。

依次检查：

1. 首页“最新文章”列表是否出现新文章；
2. “全部记录”中能否搜索到；
3. 点击文章后正文是否正常；
4. 标题、日期、分类和标签是否正确。

---

## 四、怎样写正文

正文放在 `sections` 中。一篇文章可以有任意多个小节。

### 1. 普通段落

```js
{
  title: "今天的思考",
  paragraphs: [
    "第一段文字。",
    "第二段文字。",
  ],
},
```

### 2. 无序列表

```js
{
  title: "今天完成",
  list: [
    "复习第一章",
    "完成训练",
    "阅读一篇论文",
  ],
},
```

### 3. 有序列表

```js
{
  title: "明日安排",
  ordered: true,
  list: [
    "先完成最重要的任务",
    "整理课程笔记",
    "睡前做简短复盘",
  ],
},
```

### 4. 引用或提醒

```js
{
  title: "本次复盘",
  paragraphs: ["这里写复盘内容。"],
  quote: "每天留下一点记录，长期就会形成清晰的成长轨迹。",
},
```

同一个小节可以同时包含 `paragraphs`、`list` 和 `quote`。

---

## 五、每天记录学习生活的最快方法

每天只需要花几分钟：

1. 打开 `assets/js/records-data.js`；
2. 复制上一篇 `category: "daily"` 的完整内容；
3. 粘贴到 `window.RECORDS = [` 下一行；
4. 修改 `id` 和 `date` 为今天日期；
5. 修改标题、摘要、今天完成、今天的思考和明日计划；
6. 保存并预览；
7. 上传或提交到 GitHub。

推荐的每日记录结构：

```text
今天完成
- 学习
- 训练
- 科研或其他重要事情

今天的思考
- 一段真实、具体的感受

明日计划
- 最重要的一件事
- 可以顺手完成的一件事
```

不需要每天都写很长。持续比篇幅更重要。

---

## 六、怎样修改或删除已有文章

### 修改

在 `assets/js/records-data.js` 中搜索文章的 `id` 或标题，直接修改对应文字，保存即可。

### 删除

删除该文章对应的整个对象，也就是从开头的 `{` 一直删除到结尾的 `},`。

删除时注意不要误删前后文章的括号。

---

## 七、发布到 GitHub Pages

等你确定 GitHub 用户名后，建立一个公开仓库。

假设用户名是：

```text
yourname
```

仓库名必须是：

```text
yourname.github.io
```

### 方法 A：使用 GitHub 网页上传

1. 在 GitHub 新建仓库 `你的用户名.github.io`；
2. 设置为 `Public`；
3. 进入仓库，点击 `Add file` → `Upload files`；
4. 把本网站文件夹里的所有文件和文件夹上传；
5. 提交后打开仓库的 `Settings`；
6. 左侧选择 `Pages`；
7. 在 `Build and deployment` 的 `Source` 中选择 `GitHub Actions`；
8. 打开仓库顶部的 `Actions`，等待部署任务变成绿色。

网站地址会是：

```text
https://你的用户名.github.io
```

### 方法 B：使用 Git 命令

在网站文件夹中打开 PowerShell：

```powershell
git init
git add .
git commit -m "Create personal record website"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

然后在仓库的 `Settings` → `Pages` 中把 `Source` 设为 `GitHub Actions`。

---

## 八、发布以后怎样直接在 GitHub 上写日记

不在自己电脑旁边时，也可以使用 GitHub 网页编辑：

1. 打开网站仓库；
2. 进入 `assets/js/records-data.js`；
3. 点击右上角铅笔按钮；
4. 在 `window.RECORDS = [` 下面粘贴一条新的每日记录；
5. 修改日期和正文；
6. 点击 `Commit changes`；
7. 等待 GitHub Actions 自动发布。

通常几分钟后网站会更新。刷新时可按 `Ctrl + F5` 强制刷新缓存。

---

## 九、在电脑上更新网站后怎样重新发布

如果已经连接过 GitHub 仓库，每次修改后执行：

```powershell
git add .
git commit -m "Add daily record"
git push
```

GitHub 会自动重新发布，不需要再次配置 Pages。

---

## 十、最常见的问题

### 1. 新增文章后所有文章都消失

一般是 `records-data.js` 中少了英文逗号、引号或括号。

检查：

- 每一项文字前后是否都有英文双引号；
- 数组中的每一项后面是否有英文逗号；
- 每个 `{` 是否都有对应的 `}`；
- 每个 `[` 是否都有对应的 `]`；
- 是否误用了中文引号 `“ ”`。

可以先撤销刚才的修改，再重新复制 `NEW-RECORD-TEMPLATE.txt`。

### 2. 点击文章后提示“没有找到这篇记录”

检查该文章的 `id`：

- 是否为空；
- 是否和其他文章重复；
- 是否包含空格或中文；
- 是否不小心修改了网址中的 `id`。

### 3. 文章没有出现在想要的板块

检查 `category` 是否拼写正确：

```text
course / training / research / daily
```

### 4. 网站线上没有立即更新

打开 GitHub 仓库的 `Actions` 页面，确认最新部署任务已经变成绿色。完成后等待一两分钟，再按 `Ctrl + F5`。

### 5. 双击 start-preview.bat 后窗口马上关闭

一般是电脑没有安装 Python，或者 8000 端口正在被其他程序占用。可以先直接双击 `index.html`；也可以在 VS Code 中使用 Live Server 预览。

---

## 十一、主要文件说明

```text
.
├─ index.html                         首页
├─ 404.html                           页面不存在时显示
├─ NEW-RECORD-TEMPLATE.txt            新增文章的复制模板
├─ start-preview.bat                  Windows 本地预览
├─ site.webmanifest                   网站名称和主题色
├─ assets/
│  ├─ css/
│  │  ├─ styles.css                   首页和通用样式
│  │  └─ articles.css                 归档页和文章页样式
│  └─ js/
│     ├─ site-config.js               姓名、简介、邮箱、GitHub、分类
│     ├─ records-data.js              所有文章和每日记录（最常修改）
│     ├─ common.js                    通用页面功能
│     ├─ main.js                      首页内容
│     ├─ notes.js                     全部记录、搜索和筛选
│     └─ article.js                   文章详情页
├─ notes/
│  ├─ index.html                      全部记录页
│  └─ article.html                    通用文章详情页
└─ .github/workflows/pages.yml        GitHub Pages 自动发布
```

日常使用时，通常只需要修改两个文件：

```text
assets/js/site-config.js      修改个人资料
assets/js/records-data.js     新增、修改或删除文章
```

---

## 十二、隐私提醒

GitHub Pages 是公开网站。不要在每日记录中发布以下内容：

- 密码、验证码、API 密钥
- 身份证号、银行卡号
- 详细家庭住址和实时位置
- 未公开的实验数据或保密项目内容
- 未经他人同意的个人信息和照片

代码使用 MIT License，可以自由修改。
