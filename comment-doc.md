## 2020-03-25 vuese使用方法

``` bash
# 安装全局依赖 npm i -g @vuese/cli
# 安装成功后执行 vuese gen 后会发现多了website文件夹 里面的components与index.html 分别是文档以及文档显示页面
# 页面中若有props属性、events 可直接注释即可
# 要为页面中的methods进行文档编写 需要使用 //@vuese 注解主动告诉 vuese
# 若需要实现分组 只需要为你的组件定义添加 @group [groupName] 前导注释即可
# 添加注释后 在控制台输入vuese serve --open即可生成相关文档

```

## 2020-03-26 jsdoc使用方法(不推荐)
``` bash
# 当前项目安装依赖 npm install --save-dev jsdoc 
# 只允许生成js文件
# 以/** 开头注释
# 在指定js文件下写下注释 以@constructor为头方可
# 生成结束后需要执行命令 jsdoc js文件路径地址 即可
``` 

## 2020-03-26 jsdoc-vue使用方法
``` bash
# 安装依赖 $ npm install --save-dev jsdoc jsdoc-vuejs