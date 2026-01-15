import { createSignal, createEffect } from 'solid-js';

/**
 * Counter Component
 * Demonstrates: createSignal, fine-grained updates
 * 
 * Key Concepts:
 * - createSignal() mengembalikan [getter, setter]
 * - Hanya DOM node yang subscribe ke signal yang update
 * - Tidak ada re-render component
 */
export default function Counter() {
  const [count, setCount] = createSignal(0);
  
  // Effect untuk logging (side effect)
  // Auto-track count() dan re-run saat berubah
  createEffect(() => {
    console.log('Counter changed:', count());
  });
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(0);
  
  return (
    <div class="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        🔢 Counter - createSignal Demo
      </h2>
      
      <div class="bg-blue-50 p-4 rounded mb-4">
        <p class="text-sm text-gray-600 mb-2">
          Fine-grained update: Hanya angka yang re-render
        </p>
        <div class="text-5xl font-bold text-blue-600 text-center">
          {count()}
        </div>
      </div>
      
      <div class="flex gap-2 justify-center">
        <button
          onClick={decrement}
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          -1
        </button>
        <button
          onClick={reset}
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={increment}
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          +1
        </button>
      </div>
      
      <div class="mt-4 text-xs text-gray-500">
        💡 Buka console untuk lihat createEffect
      </div>
    </div>
  );
}