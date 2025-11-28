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
& 与运算符，极少用
&& 左边True才看右边
|   位运算 或把两个数字的二进制位“或”一下
|| 逻辑或（短路或）“左边是假就用右边，否则用左边”
? 三元运算符（条件运算符）“问？真：假”
?? 空值合并运算符“左边是 null 或 undefined 才用右边”
?. “可选链”安全读属性，防止报错 如果左边为真则继续，如果为假则停止

...: ( 三元运算的那一大坨 ),这个 ... 叫 展开运算符（Spread operator）,

typeof: TypeScripttypeof betterAuth类型世界：获取 betterAuth 这个值的类型

{}:1.对象  2.解构赋值
(): 执行
<>: 泛型
[]: 数列
<> </> : 这个语法糖是 React Fragments 的简写写法。它的作用是：在不额外生成 DOM 节点的情况下，包裹多个子元素。

# 英文解析
NonNullable： 非空
satisfies： 满足
social Providers： 社会服务提供者
Parameters： 参数
Clarity: 这里的 Clarity 指的是 Microsoft Clarity ——微软推出的一款免费的用户行为分析工具。
process: 过程
env: 环境
event: 事件
panel: 认证控制板