# Advanced SolidJS Documentation

## 📚 Table of Contents

1. [Fine-Grained Reactivity Deep Dive](#fine-grained-reactivity-deep-dive)
2. [Signal Performance Optimization](#signal-performance-optimization)
3. [Advanced Patterns](#advanced-patterns)
4. [Comparison with Other Frameworks](#comparison-with-other-frameworks)
5. [Production Best Practices](#production-best-practices)
6. [Debugging Techniques](#debugging-techniques)

---

## 🔬 Fine-Grained Reactivity Deep Dive

### What is Fine-Grained Reactivity?

Fine-grained reactivity berarti sistem reactive yang bisa track dan update **individual nodes** dalam dependency graph, bukan re-run seluruh component.

```typescript
// React (Coarse-grained)
function App() {
  const [count, setCount] = useState(0);
  console.log('Component re-rendered'); // Runs every update
  return <div>{count}</div>;
}

// SolidJS (Fine-grained)
function App() {
  const [count, setCount] = createSignal(0);
  console.log('Component initialized'); // Runs ONCE
  return <div>{count()}</div>; // Only text node updates
}
```

### Reactivity Graph

```
Signal (Source)
    ↓
Derivation (Computed)
    ↓
Effect (Side Effect)
    ↓
DOM Node (Subscriber)
```

**Key Points:**
- Setiap node hanya update ketika dependency-nya berubah
- Tidak ada "re-render" concept
- Update propagation synchronous dan predictable

---

## ⚡ Signal Performance Optimization

### 1. Batch Updates

Gunakan `batch()` untuk menggabungkan multiple signal updates:

```typescript
import { batch } from 'solid-js';

// ❌ Bad: 3 separate updates
setFirstName('John');
setLastName('Doe');
setAge(30);

// ✅ Good: 1 batched update
batch(() => {
  setFirstName('John');
  setLastName('Doe');
  setAge(30);
});
```

### 2. Untrack untuk Skip Dependencies

Gunakan `untrack()` untuk read signal tanpa creating dependency:

```typescript
import { untrack } from 'solid-js';

createEffect(() => {
  console.log('Count:', count());
  
  // Read name tanpa track sebagai dependency
  const nameValue = untrack(name);
  console.log('Name:', nameValue);
});
```

### 3. Lazy Evaluation dengan `createMemo`

```typescript
// ❌ Re-compute every access
const expensiveValue = () => {
  return items()
    .filter(i => i.active)
    .map(i => i.value * 2)
    .reduce((a, b) => a + b, 0);
};

// ✅ Memoized, only re-compute when items() changes
const expensiveValue = createMemo(() => {
  return items()
    .filter(i => i.active)
    .map(i => i.value * 2)
    .reduce((a, b) => a + b, 0);
});
```

### 4. On untuk Explicit Dependencies

```typescript
import { on } from 'solid-js';

// Run effect hanya ketika userId berubah, ignore name
createEffect(
  on(userId, (id) => {
    fetchUserData(id);
    console.log('Current name:', name()); // Doesn't trigger re-run
  })
);
```

---

## 🎯 Advanced Patterns

### 1. Signal as Store (Nested Reactivity)

```typescript
import { createStore } from 'solid-js/store';

const [state, setState] = createStore({
  user: {
    name: 'John',
    profile: {
      age: 30,
      email: 'john@example.com'
    }
  }
});

// Fine-grained updates
setState('user', 'profile', 'age', 31);
// Hanya component yang access age yang update
```

### 2. Resource Pattern (Async Data)

```typescript
import { createResource } from 'solid-js';

const fetchUser = async (id: number) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

const [userId, setUserId] = createSignal(1);
const [user] = createResource(userId, fetchUser);

// Usage
<Show when={user()} fallback={<p>Loading...</p>}>
  {(u) => <div>{u().name}</div>}
</Show>
```

### 3. Context Pattern (Shared State)

```typescript
import { createContext, useContext } from 'solid-js';

const CounterContext = createContext<[
  Accessor<number>,
  Setter<number>
]>();

function CounterProvider(props: ParentProps) {
  const [count, setCount] = createSignal(0);
  
  return (
    <CounterContext.Provider value={[count, setCount]}>
      {props.children}
    </CounterContext.Provider>
  );
}

function useCounter() {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error('useCounter must be used within CounterProvider');
  return ctx;
}
```

### 4. Custom Hooks Pattern

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = createSignal<T>(
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );
  
  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(value()));
  });
  
  return [value, setValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

---

## 🆚 Comparison with Other Frameworks

### SolidJS vs React

| Feature | React | SolidJS |
|---------|-------|---------|
| **Reactivity Model** | Virtual DOM | Fine-grained |
| **Component Re-execution** | Yes | No (once only) |
| **Bundle Size** | ~42kb | ~6kb |
| **Runtime Overhead** | Higher | Lower |
| **JSX Compilation** | Runtime | Compile-time |
| **Optimization Needed** | Yes (memo, callback) | No (default optimal) |

### SolidJS vs Svelte

| Feature | Svelte | SolidJS |
|---------|--------|---------|
| **Compilation** | Full compile | Partial |
| **Runtime** | Minimal | Small (~6kb) |
| **Reactivity** | Compiler-based | Signal-based |
| **TypeScript** | Good | Excellent |
| **JSX Support** | No | Yes |

### SolidJS vs Vue 3

| Feature | Vue 3 | SolidJS |
|---------|-------|---------|
| **Reactivity** | Proxy-based | Signal-based |
| **Template Syntax** | Custom | JSX |
| **Learning Curve** | Medium | Medium |
| **Performance** | Good | Excellent |
| **Ecosystem** | Large | Growing |

---

## 🚀 Production Best Practices

### 1. Code Splitting

```typescript
import { lazy } from 'solid-js';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Router>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/settings" component={Settings} />
    </Router>
  );
}
```

### 2. Error Boundaries

```typescript
import { ErrorBoundary } from 'solid-js';

<ErrorBoundary fallback={(err) => <ErrorPage error={err} />}>
  <App />
</ErrorBoundary>
```

### 3. Suspense untuk Loading States

```typescript
import { Suspense } from 'solid-js';

<Suspense fallback={<Spinner />}>
  <AsyncComponent />
</Suspense>
```

### 4. Environment Variables

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
}

// Usage
const API_URL = import.meta.env.VITE_API_URL;
```

### 5. Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

---

## 🐛 Debugging Techniques

### 1. createEffect untuk Logging

```typescript
createEffect(() => {
  console.log('Signal changed:', {
    count: count(),
    name: name(),
    items: items()
  });
});
```

### 2. DEV Mode Warnings

```typescript
if (import.meta.env.DEV) {
  createEffect(() => {
    if (count() < 0) {
      console.warn('Count should not be negative!');
    }
  });
}
```

### 3. Performance Profiling

```typescript
const start = performance.now();

batch(() => {
  // Multiple updates
});

console.log('Duration:', performance.now() - start);
```

### 4. SolidJS DevTools

Install browser extension:
- [Chrome DevTools](https://chrome.google.com/webstore/detail/solid-devtools)
- [Firefox DevTools](https://addons.mozilla.org/en-US/firefox/addon/solid-devtools/)

Features:
- Signal inspection
- Component tree
- Performance monitoring

---

## 📊 Performance Metrics

### Real-world Benchmarks

```
Initial Render:     React: 16ms  →  SolidJS: 3ms   (5x faster)
Update 1000 items:  React: 45ms  →  SolidJS: 8ms   (5.6x faster)
Memory usage:       React: 12MB  →  SolidJS: 7MB   (40% less)
Bundle size:        React: 42kb  →  SolidJS: 6kb   (85% smaller)
```

---

## 🎓 Learning Resources

### Official Documentation
- [SolidJS Docs](https://www.solidjs.com/)
- [SolidJS Tutorial](https://www.solidjs.com/tutorial)
- [API Reference](https://www.solidjs.com/docs/latest/api)

### Community
- [Discord Server](https://discord.com/invite/solidjs)
- [GitHub Discussions](https://github.com/solidjs/solid/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/solid-js)

### Video Tutorials
- [SolidJS Crash Course](https://www.youtube.com/watch?v=hw3Bx5vxKl0)
- [Ryan Carniato's Channel](https://www.youtube.com/@ryansolid)

---

## 🔮 Future of SolidJS

### Upcoming Features
- Improved SSR performance
- Better TypeScript inference
- Enhanced DevTools
- More built-in components

### Ecosystem Growth
- SolidStart (meta-framework)
- Solid UI libraries
- More third-party integrations

---

**Last Updated:** January 2025  
**Version:** SolidJS 1.8+

---

Made with ❤️ for the SolidJS community