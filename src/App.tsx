import Counter from './components/Counter.tsx';
import TodoList from './components/TodoList';
import ReactivityDemo from './components/ReactivityDemo';

/**
 * Main App Component
 * 
 * Architecture Notes:
 * - Component di SolidJS run SEKALI
 * - JSX bukan Virtual DOM, tapi real DOM creation
 * - Reactivity terjadi di level signal, bukan component
 */
export default function App() {
  // Console log ini HANYA RUN SEKALI
  console.log('App component initialized');
  
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">
            SolidJS Mini App
          </h1>
          <p class="text-gray-600">
            Exploring Fine-Grained Reactivity & High-Performance UI
          </p>
          <div class="mt-2 text-sm text-gray-500">
            DAY 14 - Frontend Advanced Roadmap
          </div>
        </header>
        
        <div class="grid gap-6 md:grid-cols-2">
          <Counter />
          <ReactivityDemo />
        </div>
        
        <div class="mt-6">
          <TodoList />
        </div>
        
        <footer class="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 class="text-lg font-bold mb-3">🧠 SolidJS Key Concepts</h3>
          <div class="space-y-2 text-sm text-gray-700">
            <div class="flex gap-2">
              <span class="font-semibold">createSignal:</span>
              <span>Reactive primitive yang fine-grained</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">createEffect:</span>
              <span>Side effect yang auto-track dependencies</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">&lt;For&gt;:</span>
              <span>List rendering yang minimal update</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">No Virtual DOM:</span>
              <span>Direct DOM manipulation = performa tinggi</span>
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-blue-50 rounded">
            <p class="text-xs text-gray-600">
              💡 <strong>Pro Tip:</strong> Buka DevTools Console untuk melihat
              bagaimana createEffect bekerja dan perhatikan bahwa App component
              hanya log sekali, tidak re-run seperti React!
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}