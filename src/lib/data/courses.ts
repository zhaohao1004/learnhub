import type { Course, Lesson } from '@/types'

// 示例课程数据：JavaScript 基础教程
export const courses: Course[] = [
  {
    id: 'js-basics',
    title: 'JavaScript 基础入门',
    description: '从零开始学习 JavaScript，掌握编程基础和核心概念',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    author: 'LearnHub 团队',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    chapters: [
      {
        id: 'chapter-1',
        title: 'JavaScript 入门',
        order: 1,
        lessonIds: ['lesson-1', 'lesson-2', 'lesson-3'],
      },
      {
        id: 'chapter-2',
        title: '基础语法',
        order: 2,
        lessonIds: ['lesson-4', 'lesson-5', 'lesson-6'],
      },
    ],
    lessons: [
      {
        id: 'lesson-1',
        courseId: 'js-basics',
        title: '什么是 JavaScript',
        description: '了解 JavaScript 是什么，以及它在 Web 开发中的重要作用',
        order: 1,
        duration: 600,
        nextLessonId: 'lesson-2',
        video: {
          id: 'video-lesson-1',
          title: '什么是 JavaScript',
          description: '本节介绍 JavaScript 的历史和应用场景',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: 600,
          thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
        },
        document: {
          id: 'doc-lesson-1',
          title: '什么是 JavaScript',
          content: `# 什么是 JavaScript

JavaScript 是一种轻量级的解释型编程语言，主要用于网页开发。

## 主要特点

- **动态类型**: 变量不需要预先声明类型
- **弱类型**: 可以进行隐式类型转换
- **面向对象**: 支持基于原型的面向对象编程
- **函数式**: 函数是一等公民

## 应用场景

1. 前端 Web 开发
2. 后端服务 (Node.js)
3. 移动应用 (React Native)
4. 桌面应用 (Electron)

\`\`\`javascript
// 一个简单的 JavaScript 示例
console.log('Hello, World!')
\`\`\`

## 练习

尝试在右侧的代码编辑器中运行你的第一行 JavaScript 代码！
`,
        },
        codeTemplate: {
          id: 'code-lesson-1',
          language: 'javascript',
          initialCode: `// 在这里写下你的第一行 JavaScript 代码
console.log('Hello, JavaScript!');

// 尝试声明一些变量
let name = '学习者';
console.log('你好, ' + name + '!');`,
          expectedOutput: `Hello, JavaScript!
你好, 学习者!`,
          testCases: [
            {
              id: 'test-1-1',
              name: '输出 Hello, JavaScript!',
              input: '',
              expectedOutput: 'Hello, JavaScript!\n你好, 学习者!',
            },
          ],
        },
      },
      {
        id: 'lesson-2',
        courseId: 'js-basics',
        title: '环境搭建',
        description: '学习如何搭建 JavaScript 开发环境',
        order: 2,
        duration: 900,
        prevLessonId: 'lesson-1',
        nextLessonId: 'lesson-3',
        video: {
          id: 'video-lesson-2',
          title: '环境搭建',
          description: '本章介绍如何搭建 JavaScript 开发环境',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: 900,
          thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        },
        document: {
          id: 'doc-lesson-2',
          title: '环境搭建',
          content: `# 环境搭建

本章介绍如何搭建 JavaScript 开发环境。

## 浏览器开发者工具

所有现代浏览器都内置了 JavaScript 控制台：

- Chrome: F12 或 Cmd+Option+I
- Firefox: F12 或 Cmd+Option+K
- Safari: Cmd+Option+C (需要先启用开发菜单)

## Node.js

Node.js 让你可以在服务器端运行 JavaScript。

\`\`\`bash
# 检查是否安装了 Node.js
node -v

# 运行 JavaScript 文件
node script.js
\`\`\`
`,
        },
        codeTemplate: {
          id: 'code-lesson-2',
          language: 'javascript',
          initialCode: `// 练习：使用 console.log 输出信息
console.log('环境配置完成！');
`,
          expectedOutput: `环境配置完成！`,
          testCases: [
            {
              id: 'test-2-1',
              name: '输出环境配置完成',
              input: '',
              expectedOutput: '环境配置完成！',
            },
          ],
        },
      },
      {
        id: 'lesson-3',
        courseId: 'js-basics',
        title: '基本语法',
        description: '学习 JavaScript 的基本语法结构',
        order: 3,
        duration: 900,
        prevLessonId: 'lesson-2',
        nextLessonId: 'lesson-4',
        video: {
          id: 'video-lesson-3',
          title: '基本语法',
          description: '学习 JavaScript 的基本语法',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: 900,
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        document: {
          id: 'doc-lesson-3',
          title: '基本语法',
          content: `# 基本语法

## 语句

JavaScript 程序由语句组成，每条语句以分号结尾。

\`\`\`javascript
let x = 10;
console.log(x);
\`\`\`

## 注释

\`\`\`javascript
// 单行注释

/*
  多行注释
  可以跨越多行
*/
\`\`\`

## 标识符

变量名、函数名等标识符的命名规则：
- 可以包含字母、数字、下划线和美元符号
- 必须以字母、下划线或美元符号开头
- 区分大小写
`,
        },
        codeTemplate: {
          id: 'code-lesson-3',
          language: 'javascript',
          initialCode: `// 练习基本语法

// 这是单行注释

/*
  这是多行注释
*/

let message = 'Hello';
console.log(message);
`,
          expectedOutput: `Hello`,
          testCases: [
            {
              id: 'test-3-1',
              name: '输出 Hello',
              input: '',
              expectedOutput: 'Hello',
            },
          ],
        },
      },
      {
        id: 'lesson-4',
        courseId: 'js-basics',
        title: '变量声明',
        description: '学习 var、let 和 const 的区别',
        order: 4,
        duration: 1080,
        prevLessonId: 'lesson-3',
        nextLessonId: 'lesson-5',
        video: {
          id: 'video-lesson-4',
          title: '变量声明',
          description: '学习 var、let 和 const 的区别',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: 1080,
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        document: {
          id: 'doc-lesson-4',
          title: '变量声明',
          content: `# 变量声明

JavaScript 有三种声明变量的方式：\`var\`、\`let\` 和 \`const\`。

## var

\`var\` 是 ES5 的声明方式，存在变量提升。

\`\`\`javascript
var name = 'John';
\`\`\`

## let

\`let\` 是 ES6 新增的，具有块级作用域。

\`\`\`javascript
let age = 25;
age = 26; // 可以重新赋值
\`\`\`

## const

\`const\` 声明常量，一旦赋值不能更改。

\`\`\`javascript
const PI = 3.14159;
// PI = 3.14; // 错误！不能重新赋值
\`\`\`

## 最佳实践

- 默认使用 \`const\`
- 需要重新赋值时使用 \`let\`
- 避免使用 \`var\`
`,
        },
        codeTemplate: {
          id: 'code-lesson-4',
          language: 'javascript',
          initialCode: `// 练习变量声明

// 使用 const 声明一个常量
const greeting = 'Hello';

// 使用 let 声明一个可以改变的变量
let count = 0;
count = count + 1;

console.log(greeting);
console.log('Count:', count);`,
          expectedOutput: `Hello
Count: 1`,
          testCases: [
            {
              id: 'test-4-1',
              name: '输出 greeting 和 count',
              input: '',
              expectedOutput: 'Hello\nCount: 1',
            },
          ],
        },
      },
      {
        id: 'lesson-5',
        courseId: 'js-basics',
        title: '数据类型',
        description: '学习 JavaScript 的基本数据类型',
        order: 5,
        duration: 1200,
        prevLessonId: 'lesson-4',
        nextLessonId: 'lesson-6',
        video: {
          id: 'video-lesson-5',
          title: '数据类型',
          description: '学习 JavaScript 的基本数据类型',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: 1200,
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        document: {
          id: 'doc-lesson-5',
          title: '数据类型',
          content: `# 数据类型

JavaScript 有以下基本数据类型：

## Number（数字）

\`\`\`javascript
let integer = 42;
let decimal = 3.14;
\`\`\`

## String（字符串）

\`\`\`javascript
let single = '单引号';
let double = "双引号";
let template = \`模板字符串\`;
\`\`\`

## Boolean（布尔值）

\`\`\`javascript
let isTrue = true;
let isFalse = false;
\`\`\`

## undefined 和 null

\`\`\`javascript
let notDefined;          // undefined
let empty = null;        // null
\`\`\`
`,
        },
        codeTemplate: {
          id: 'code-lesson-5',
          language: 'javascript',
          initialCode: `// 练习数据类型

// 数字
let num = 42;
console.log('数字:', num);

// 字符串
let str = 'Hello';
console.log('字符串:', str);

// 布尔值
let bool = true;
console.log('布尔值:', bool);

// 检查类型
console.log('num 的类型:', typeof num);
console.log('str 的类型:', typeof str);
`,
          expectedOutput: `数字: 42
字符串: Hello
布尔值: true
num 的类型: number
str 的类型: string`,
          testCases: [
            {
              id: 'test-5-1',
              name: '输出数字和类型',
              input: '',
              expectedOutput: '数字: 42\n字符串: Hello\n布尔值: true\nnum 的类型: number\nstr 的类型: string',
            },
          ],
        },
      },
      {
        id: 'lesson-6',
        courseId: 'js-basics',
        title: '运算符',
        description: '学习 JavaScript 的运算符',
        order: 6,
        duration: 900,
        prevLessonId: 'lesson-5',
        video: {
          id: 'video-lesson-6',
          title: '运算符',
          description: '学习 JavaScript 的运算符',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: 900,
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        document: {
          id: 'doc-lesson-6',
          title: '运算符',
          content: `# 运算符

## 算术运算符

\`\`\`javascript
+   // 加法
-   // 减法
*   // 乘法
/   // 除法
%   // 取模
\`\`\`

## 比较运算符

\`\`\`javascript
===  // 严格相等
!==  // 严格不等
>    // 大于
<    // 小于
>=   // 大于等于
<=   // 小于等于
\`\`\`

## 逻辑运算符

\`\`\`javascript
&&  // 与
||  // 或
!   // 非
\`\`\`
`,
        },
        codeTemplate: {
          id: 'code-lesson-6',
          language: 'javascript',
          initialCode: `// 练习运算符

// 算术运算符
let a = 10;
let b = 3;
console.log('a + b =', a + b);
console.log('a - b =', a - b);
console.log('a * b =', a * b);
console.log('a / b =', a / b);
console.log('a % b =', a % b);

// 比较运算符
console.log('a > b:', a > b);
console.log('a === b:', a === b);
`,
          expectedOutput: `a + b = 13
a - b = 7
a * b = 30
a / b = 3.333...
a % b = 1
a > b: true
a === b: false`,
          testCases: [
            {
              id: 'test-6-1',
              name: '算术运算 - 加法',
              input: `let a = 10;
let b = 3;
console.log(a + b);`,
              expectedOutput: '13',
            },
            {
              id: 'test-6-2',
              name: '比较运算 - 大于',
              input: `let a = 10;
let b = 3;
console.log(a > b);`,
              expectedOutput: 'true',
            },
          ],
        },
      },
    ],
  },
]

// 获取所有课程
export function getCourses(): Course[] {
  return courses
}

// 根据 ID 获取课程
export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

// 获取特定课程的特定课时
export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourse(courseId)
  if (!course) return undefined
  return course.lessons.find((lesson) => lesson.id === lessonId)
}
