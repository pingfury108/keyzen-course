// 声明 .ron 文件可以作为字符串导入
declare module '*.ron' {
  const content: string;
  export default content;
}

// 声明 .json 文件可以作为对象导入
declare module '*.json' {
  const value: any;
  export default value;
}
