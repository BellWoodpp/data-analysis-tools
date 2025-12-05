# 查看Next.js版本
pnpm list next


# Next.js更新代码
pnpm add next@latest

# 升级 next + react + react-dom（官方常规建议）
pnpm add next@latest react@latest react-dom@latest

# 查看 React 版本
pnpm list react

# 查看 React DOM 版本
pnpm list react-dom


# Github推送代码,第一次创建
…or create a new repository on the command line
echo "# try" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:BellWoodpp/try.git
git push -u origin main

# 之后推送
git add .
git status
git commit -m "commit name"
git push

# 运算符
& 通常出现在 类型（Type） 定义里,在TS中它只用于类型合并，交叉类型（把多个类型合并成一个）
&& 左边True才看右边  交集
|   位运算 或把两个数字的二进制位“或”一下
|| 逻辑或（短路或）“左边是假就用右边，否则用左边”  并集
? 三元运算符（条件运算符）“问？真：假”
?:  可选属性（optional property）,可能有也可能没有,因为:后面大部分是属性的意思。
?? 空值合并运算符“左边是 null 或 undefined 才用右边”
?. “可选链”安全读属性，防止报错 如果左边为真则继续，如果为假则停止
: { 如果在函数的参数里则是“类型注解”
:{} 这个属性是一个对象，在前面应该是个属性名
:{}[] 这个属性是很多个这种对象，简称对象数组
:[{}] 同上面，就是展开了。

...: ( 三元运算的那一大坨 ),这个 ... 叫 展开运算符（Spread operator）,

typeof: TypeScripttypeof betterAuth类型世界：获取 betterAuth 这个值的类型

{}:1.对象  2.解构赋值
(): 执行
<>: 泛型
[]: 数列
<> </> : 这个语法糖是 React Fragments 的简写写法。它的作用是：在不额外生成 DOM 节点的情况下，包裹多个子元素。

!!: !! 的作用：把一个值强制转换成布尔值（true/false）,第一个 !：把值取反，变成布尔类型,第二个 !：再取反回来 → 得到 纯布尔值

# 英文解析
NonNullable： 非空，其中Nullable可空。
satisfies： 满足
social Providers： 社会服务提供者
Parameters： 参数
Clarity: 这里的 Clarity 指的是 Microsoft Clarity ——微软推出的一款免费的用户行为分析工具。
process: 过程
env: 环境
event: 事件
panel: 认证控制板
props: 道具
term: search term（搜索词）
onChange： React 里所有原生 DOM 事件，都是 on + 事件名 而且名字大小写敏感！
replace: 替换
prevState: 上一次 action 执行后的状态,其中prev是上一个，State是状态
formData： 表单数据
formAction： 表单操作
isPending： 待处理
token: token 是 AI 计算和计费的最小单位。
openspec: openspec = open specification（开放规范 / 开放标准）:公开、开放给所有人查看与使用的技术规范或标准。
useActionState: 使用操作状态
disable: 禁用
Record: 记录
initialState: 初始状态
reset: 重置
void: 空白
useEffect： 使用效果
digest: 摘要 / 指纹 / 哈希值 / 唯一标识码。 Next.js 中的 error.digest 就是一个“错误指纹”或“错误 ID”，
throw Error： 抛出错误
pnpm dlx next lint：临时执行lint
peer: 
Breadcrumbs: 面包屑导航
clsx: clsx 是现代 React + Tailwind 项目里最常用、最好用的一个工具函数，专门用来有条件地拼接 className，让你的代码既干净又安全。
redirect(): 重定向
validatedFields： 已验证字段
safeParse： 安全解析
suspense: 因为它表示组件处于 “被挂起”（suspended） 状态，而不是“悬念”。
callbacks: 回调函数配置
authorized: 被授权的 / 有权限的
providers: 供应商
sidenav: 侧边导航
session: 当前登录会话对象
Boolean: 布尔值
useSession()： createAuthClient() 返回的对象里自带的一个方法。
menu: 菜单
cts: ctx 是一个对象，通常长这样：
TypeScriptctx: {
  req: Request;      // 当前的 HTTP 请求对象（可以读 headers、cookie 等）
  res?: Response;    // 可选的响应对象（可以手动 set header/cookie）
  user?: User;       // 当前用户（如果已登录）
  session?: Session; // 当前会话
}
NODE_ENV： 它就是 Next.js 用来判断「现在是本地开发还是上线」的官方开关！
role: 用户的角色（权限等级）
RSC:  通常指 React Server Components
useEffect: useEffect 就是让你在“函数组件里执行副作用操作”的地方。
x! :   “我（开发者）向 TypeScript 发誓：x 绝对不是 null 也不是 undefined！”
bigint: 一个庞大的数据库
POST: HTTP 请求方法 POST,邮政，定义一个处理 POST 请求的路由处理函数
429: 稍等下
Retry-After： “请等一会儿再来试”
prompt = 就是你丢给 AI 的一句话 / 一段话
中文最最最贴切的翻译就是：“提示词” 或 “你给我干活的指令”
fetch(): 发一个 HTTP 请求
method: 方法