# SolidJS Mini App

> **Exploring SolidJS to understand fine-grained reactivity and high-performance UI rendering.**

## 🎯 Project Overview

Project ini adalah bagian dari **DAY 14 - Frontend Advanced Roadmap** yang fokus pada:
- Fine-grained reactivity
- High-performance UI rendering
- Reactivity tanpa Virtual DOM
- Modern frontend architecture

## 🚀 Quick Start

```bash
# 1. Setup project
npm create vite@latest solidjs-mini-app -- --template solid-ts
cd solidjs-mini-app

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
```

## 📁 Struktur Project

```
solidjs-mini-app/
├── src/
│   ├── components/
│   │   ├── Counter.tsx          # createSignal demo
│   │   ├── TodoList.tsx         # <For> component demo
│   │   └── ReactivityDemo.tsx   # Derived signals demo
│   ├── App.tsx                  # Main app
│   ├── main.tsx                 # Entry point
│   └── index.css                # Styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧩 Features

### 1. **Counter Component**
- ✅ Increment / Decrement
- ✅ Menggunakan `createSignal`
- ✅ Fine-grained DOM updates
- ✅ `createEffect` untuk logging

### 2. **Todo List Component**
- ✅ Add / Remove / Toggle todos
- ✅ Menggunakan `<For>` component
- ✅ Minimal re-rendering
- ✅ TypeScript support

### 3. **Reactivity Demo Component**
- ✅ Derived signals (computed)
- ✅ Auto-tracking dependencies
- ✅ Multiple signal composition
- ✅ Effect tracking demo

## 🧠 Core Concepts Explained

### 1. **createSignal - Reactive Primitive**

```typescript
const [count, setCount] = createSignal(0);

// Getter: count()
// Setter: setCount(value)
```

**Karakteristik:**
- Getter/Setter pattern (bukan destructuring seperti React)
- Fine-grained tracking
- Synchronous updates
- No component re-render

### 2. **createEffect - Side Effect Tracker**

```typescript
createEffect(() => {
  console.log('Count:', count());
  // Auto-track count() sebagai dependency
});
```

**Karakteristik:**
- Auto-tracking dependencies
- Run immediately saat dibuat
- Re-run saat dependency berubah
- Auto cleanup saat unmount

### 3. **Derived Signals (Computed Values)**

```typescript
const fullName = () => `${firstName()} ${lastName()}`;
```

**Karakteristik:**
- Lazy evaluation
- Memoized results
- Auto-update saat dependency berubah

### 4. **`<For>` Component - Efficient List Rendering**

```typescript
<For each={todos()}>
  {(todo) => <TodoItem todo={todo} />}
</For>
```

**Keuntungan:**
- Keyed by reference
- Minimal DOM updates
- No index-based re-rendering

## ⚡ Fine-Grained Reactivity Flow

```
User Action (onClick)
    ↓
setCount(c => c + 1)
    ↓
Signal Value Update
    ↓
Notify Subscribers
    ↓
Update DOM Directly (tanpa Virtual DOM)
```

**Perbedaan dengan React:**

| React | SolidJS |
|-------|---------|
| Update state → Re-render component | Update signal → Update DOM node |
| Virtual DOM diffing | Direct DOM manipulation |
| Component-level reactivity | Node-level reactivity |
| Batched updates | Synchronous updates |

## 📊 Performance Comparison

| Metric | React | SolidJS |
|--------|-------|---------|
| Bundle Size | ~42kb (minified) | ~6kb (minified) |
| Rendering | Virtual DOM | Real DOM |
| Reactivity | Component-level | Fine-grained |
| Update Overhead | Medium | Minimal |
| Memory Usage | Higher | Lower |

## 💡 Insights Setelah Mencoba SolidJS

### **1. Mental Model Shift**

**React Mental Model:**
```typescript
// Component re-run saat state berubah
function Counter() {
  const [count, setCount] = useState(0);
  console.log('Component re-rendered'); // Log setiap update
  return <div>{count}</div>;
}
```

**SolidJS Mental Model:**
```typescript
// Component run SEKALI, signal yang reaktif
function Counter() {
  const [count, setCount] = createSignal(0);
  console.log('Component init'); // Log HANYA SEKALI
  return <div>{count()}</div>; // Hanya text node yang update
}
```

### **2. Performance by Default**

Di React, butuh optimization manual:
- `useMemo` untuk computed values
- `useCallback` untuk function stability
- `React.memo` untuk prevent re-render

Di SolidJS, **semuanya sudah optimal by default**:
- Derived signals otomatis memoized
- No re-render overhead
- Fine-grained updates

### **3. TypeScript Experience**

SolidJS TypeScript support sangat bagus:
- Full type inference
- Generic components
- Type-safe signals
- No `as` casting needed

### **4. Developer Experience**

**Positif:**
- ✅ JSX syntax familiar (coming from React)
- ✅ Less boilerplate code
- ✅ Smaller bundle size
- ✅ Faster runtime performance
- ✅ Great DevTools

**Challenges:**
- ⚠️ Getter/Setter pattern butuh adaptasi
- ⚠️ Ecosystem lebih kecil dari React
- ⚠️ Less third-party libraries

### **5. Kapan Pakai SolidJS?**

**✅ Cocok untuk:**
- Data-intensive applications (dashboards, admin panels)
- Performance-critical apps (mobile, low-end devices)
- Real-time applications (live data, charts)
- Greenfield projects
- Bundle size critical

**❌ Kurang cocok untuk:**
- Large existing React codebase
- Heavy dependency on React ecosystem
- Team belum familiar reactive programming
- Simple static sites

## 🔑 Key Takeaways

1. **Fine-grained reactivity = Superior performance**
   - Update hanya yang berubah
   - No Virtual DOM overhead
   - Direct DOM manipulation

2. **Component run once paradigm**
   - Berbeda total dari React
   - Signal yang reaktif, bukan component
   - Less memory overhead

3. **Signals > Hooks**
   - Lebih simple mental model
   - Auto-tracking dependencies
   - No rules of hooks

4. **Compile-time optimization**
   - JSX compiled to optimized DOM creation
   - Smaller runtime
   - Faster initial load

## 🆚 React vs SolidJS - Architecture Comparison

### **React Architecture:**
```
State Change → Component Re-render → Virtual DOM Creation 
→ Diffing → Reconciliation → Real DOM Update
```

### **SolidJS Architecture:**
```
Signal Change → Notify Subscribers → Real DOM Update
```

**Kesimpulan:** SolidJS lebih direct dan efisien.

## 📚 Resources

- [SolidJS Official Docs](https://www.solidjs.com/)
- [SolidJS Tutorial](https://www.solidjs.com/tutorial)
- [Reactivity Deep Dive](https://www.solidjs.com/guides/reactivity)
- [SolidJS Playground](https://playground.solidjs.com/)

## 🎓 Advanced Topics (Next Steps)

1. **Stores** - State management kompleks
2. **Context API** - Sharing state across components
3. **Lazy Loading** - Code splitting
4. **SSR** - Server-side rendering with SolidStart
5. **Animations** - Solid Transition Group

## 🚀 Production Checklist

- [ ] TypeScript strict mode enabled
- [ ] Error boundaries implemented
- [ ] Lazy loading untuk code splitting
- [ ] Bundle size analysis
- [ ] Performance profiling
- [ ] Accessibility audit

## 🤝 Contributing

Ini adalah learning project. Feel free to fork dan experiment!

## 📝 License

MIT

---

**DAY 14 - Frontend Advanced Roadmap**  
Built with ❤️ using SolidJS, TypeScript, and Vite