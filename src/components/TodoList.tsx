import { createSignal, For } from 'solid-js';

/**
 * Todo List Component
 * Demonstrates: <For> component, list rendering
 * 
 * Key Concepts:
 * - <For> lebih efisien daripada map() untuk list
 * - Setiap item di-render sekali, update minimal
 * - Keyed by reference, bukan index
 */

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = createSignal<Todo[]>([
    { id: 1, text: 'Pelajari SolidJS', completed: true },
    { id: 2, text: 'Pahami fine-grained reactivity', completed: false },
  ]);
  const [input, setInput] = createSignal('');
  
  const addTodo = () => {
    const text = input().trim();
    if (!text) return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    
    setTodos(prev => [...prev, newTodo]);
    setInput('');
  };
  
  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
  };
  
  return (
    <div class="bg-white p-6 rounded-lg shadow-md border-2 border-purple-500">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        ✅ Todo List - &lt;For&gt; Component
      </h2>
      
      <div class="flex gap-2 mb-4">
        <input
          type="text"
          value={input()}
          onInput={(e) => setInput(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tambah todo..."
          class="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={addTodo}
          class="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          Add
        </button>
      </div>
      
      <div class="space-y-2">
        <For each={todos()}>
          {(todo) => (
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                class="w-5 h-5 cursor-pointer"
              />
              <span
                class={`flex-1 ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          )}
        </For>
      </div>
      
      <div class="mt-4 text-xs text-gray-500">
        💡 Setiap item di-render sekali, update minimal
      </div>
    </div>
  );
}