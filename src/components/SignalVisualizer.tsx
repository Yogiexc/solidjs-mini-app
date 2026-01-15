import { createSignal, createEffect, For } from 'solid-js';

/**
 * Signal Visualizer Component
 * Visual debugging tool untuk melihat signal updates real-time
 * 
 * Demonstrates:
 * - Advanced createEffect patterns
 * - Signal tracking visualization
 * - Developer tools integration
 */

interface SignalLog {
  id: number;
  name: string;
  value: any;
  timestamp: string;
}

export default function SignalVisualizer() {
  const [isVisible, setIsVisible] = createSignal(false);
  const [logs, setLogs] = createSignal<SignalLog[]>([]);
  const [maxLogs, setMaxLogs] = createSignal(50);
  
  // Example signals to visualize
  const [counter, setCounter] = createSignal(0);
  const [text, setText] = createSignal('Hello');
  const [toggle, setToggle] = createSignal(false);
  
  // Track counter signal
  createEffect(() => {
    const value = counter();
    addLog('counter', value);
  });
  
  // Track text signal
  createEffect(() => {
    const value = text();
    addLog('text', value);
  });
  
  // Track toggle signal
  createEffect(() => {
    const value = toggle();
    addLog('toggle', value);
  });
  
  const addLog = (name: string, value: any) => {
    const newLog: SignalLog = {
      id: Date.now(),
      name,
      value: JSON.stringify(value),
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setLogs(prev => {
      const updated = [newLog, ...prev];
      return updated.slice(0, maxLogs());
    });
  };
  
  const clearLogs = () => setLogs([]);
  
  const getSignalColor = (name: string) => {
    switch (name) {
      case 'counter': return 'bg-blue-100 text-blue-800';
      case 'text': return 'bg-green-100 text-green-800';
      case 'toggle': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(v => !v)}
        class="fixed bottom-20 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition z-40"
      >
        🔍 Signal Debugger
      </button>
      
      {/* Visualizer Panel */}
      {isVisible() && (
        <div class="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border-2 border-purple-500 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-gray-800">Signal Visualizer</h3>
              <button
                onClick={() => setIsVisible(false)}
                class="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Test Controls */}
            <div class="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCounter(c => c + 1)}
                class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Counter++
              </button>
              <button
                onClick={() => setText(t => t + '!')}
                class="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Text+
              </button>
              <button
                onClick={() => setToggle(t => !t)}
                class="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
              >
                Toggle
              </button>
            </div>
            
            <button
              onClick={clearLogs}
              class="mt-2 w-full px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Clear Logs
            </button>
          </div>
          
          {/* Logs */}
          <div class="flex-1 overflow-y-auto p-4">
            <div class="text-xs text-gray-500 mb-2">
              Total Updates: {logs().length}
            </div>
            
            <div class="space-y-2">
              <For each={logs()}>
                {(log) => (
                  <div class="p-2 bg-gray-50 rounded border border-gray-200">
                    <div class="flex items-center justify-between mb-1">
                      <span class={`px-2 py-1 rounded text-xs font-semibold ${getSignalColor(log.name)}`}>
                        {log.name}
                      </span>
                      <span class="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div class="text-sm font-mono text-gray-700 break-all">
                      {log.value}
                    </div>
                  </div>
                )}
              </For>
              
              {logs().length === 0 && (
                <div class="text-center text-gray-400 py-8">
                  No signal updates yet. Try the buttons above!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}