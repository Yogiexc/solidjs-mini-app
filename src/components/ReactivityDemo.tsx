import { createSignal, createEffect } from 'solid-js';

/**
 * Reactivity Demo Component
 * Demonstrates: Derived signals, createEffect, auto-tracking
 * 
 * Key Concepts:
 * - Derived signal = computed value dari signal lain
 * - createEffect auto-track dependencies
 * - Effect re-run otomatis saat dependency berubah
 */
export default function ReactivityDemo() {
  const [firstName, setFirstName] = createSignal('John');
  const [lastName, setLastName] = createSignal('Doe');
  
  // Derived signal (computed)
  // Ini adalah function yang memanggil signal lain
  // Auto-update saat firstName atau lastName berubah
  const fullName = () => `${firstName()} ${lastName()}`;
  
  // Effect yang track multiple signals
  createEffect(() => {
    console.log('Name changed:', fullName());
  });
  
  const [renderCount, setRenderCount] = createSignal(0);
  
  // Effect ini akan run setiap kali firstName atau lastName berubah
  createEffect(() => {
    // Reading firstName() dan lastName() membuat effect ini subscribe
    firstName();
    lastName();
    setRenderCount(c => c + 1);
  });
  
  return (
    <div class="bg-white p-6 rounded-lg shadow-md border-2 border-green-500">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        ⚡ Reactivity Demo
      </h2>
      
      <div class="space-y-3 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={firstName()}
            onInput={(e) => setFirstName(e.currentTarget.value)}
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={lastName()}
            onInput={(e) => setLastName(e.currentTarget.value)}
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div class="bg-green-50 p-4 rounded mb-3">
        <div class="text-sm text-gray-600 mb-1">Derived Signal:</div>
        <div class="text-2xl font-bold text-green-600">
          Hello, {fullName()}!
        </div>
      </div>
      
      <div class="bg-yellow-50 p-3 rounded">
        <div class="text-sm text-gray-600">
          Effect Run Count: <span class="font-bold">{renderCount()}</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Effect otomatis track dependencies
        </div>
      </div>
    </div>
  );
}