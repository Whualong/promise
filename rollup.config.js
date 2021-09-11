import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
 
export default {
  input: 'src/promise.js', // 打包入口
  output: [
    { // 打包出口
        name:"promise-umd",
        file: pkg.browser, // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
        format: 'umd', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    },
    { // 打包出口
        name:"promise-cjs",
        file: pkg.node, // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
        format: 'cjs', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    },
  ],
  plugins: [ // 打包插件
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
  ]
};