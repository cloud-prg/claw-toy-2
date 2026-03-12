# 🏎️ 极速赛车 (Racing Game)

一个基于 Three.js 的 3D 赛车躲避游戏。

![Game Screenshot](./screenshot.png)

## 🎮 游戏玩法

- **目标**：控制赛车躲避障碍物，坚持 60 秒
- **操作**：
  - `←` `→` 方向键 或 `A` `D` 键控制左右移动
  - 躲避红色路障
  - 收集金色金币 (+50 分)
  - 成功躲避障碍物 (+10 分)

## 🚀 在线试玩

👉 [点击开始游戏](https://cloud-prg.github.io/claw-toy-2/)

## 🛠️ 本地运行

```bash
# 克隆项目
git clone https://github.com/cloud-prg/claw-toy-2.git
cd claw-toy-2

# 启动本地服务器
python3 -m http.server 8080

# 浏览器打开
open http://localhost:8080
```

## 📁 项目结构

```
claw-toy-2/
├── index.html          # 主游戏文件
├── game.html           # 完整版游戏
├── README.md           # 项目说明
├── package.json        # 项目配置
└── src/                # 源代码目录
    ├── App.tsx         # React 组件
    ├── App.css         # 样式文件
    └── index.js        # 入口文件
```

## 🎯 游戏特性

- ✅ 3D 场景渲染 (Three.js)
- ✅ 程序化生成的沥青路面纹理
- ✅ 动态光照与阴影
- ✅ 后期处理效果 (泛光)
- ✅ 流畅的键盘控制
- ✅ 计分系统
- ✅ 倒计时机制

## 📝 版本历史

### v0.0.1 (2026-03-12)
- 初始版本发布
- 基础 3D 赛车游戏实现
- 支持障碍物躲避和金币收集

## 🔧 技术栈

- [Three.js](https://threejs.org/) - 3D 图形库
- [Vite](https://vitejs.dev/) - 构建工具
- [React](https://react.dev/) - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 📄 许可证

MIT License

---

*Created with ❤️ by [cloud-prg](https://github.com/cloud-prg)*