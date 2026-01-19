/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gas Temple 主题色 - 双模式
        // 高端模式 (Goldman Sachs风)
        goldman: {
          bg: '#0a0a0a',
          gold: '#c9a962',
          text: '#e5e5e5',
          muted: '#737373',
          border: '#262626',
        },
        // 土狗模式 (Pepe/Meme风)
        degen: {
          bg: '#1a1a2e',
          green: '#39ff14',
          pink: '#ff1493',
          yellow: '#ffd700',
          purple: '#9945ff',
          cyan: '#00ffff',
        },
        // 稀有度颜色
        rarity: {
          trash: '#6b7280',      // 电子垃圾
          plate: '#3b82f6',      // 精装盘子
          schrodinger: '#8b5cf6', // 薛定谔的价值
          casino: '#f59e0b',     // 赌场庄家
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['Share Tech Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        pixel: ['"ZCOOL KuaiLe"', '"Press Start 2P"', 'cursive'],
        retro: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
        'rainbow': 'rainbow 2s linear infinite',
        'flicker': 'flicker 0.1s infinite',
        'marquee': 'marquee 15s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 169, 98, 0.6)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scanline: {
          '0%': { top: '-100%' },
          '100%': { top: '100%' },
        },
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 20, 147, 0.5)',
        'neon-gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'casino': '0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(245, 158, 11, 0.3)',
      },
    },
  },
  plugins: [],
}
