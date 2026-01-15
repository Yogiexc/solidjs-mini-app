import { createSignal, createEffect, onCleanup } from 'solid-js';

/**
 * Performance Monitor Component
 * Real-time monitoring untuk:
 * - FPS (Frames Per Second)
 * - Memory usage
 * - Render count
 * 
 * Demonstrates: Advanced reactive patterns
 */

export default function PerformanceMonitor() {
  const [fps, setFps] = createSignal(0);
  const [memory, setMemory] = createSignal(0);
  const [renderCount, setRenderCount] = createSignal(0);
  const [isVisible, setIsVisible] = createSignal(false);
  
  // FPS Counter
  createEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    
    const updateFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
      }
      
      if (isVisible()) {
        requestAnimationFrame(updateFPS);
      }
    };
    
    if (isVisible()) {
      requestAnimationFrame(updateFPS);
    }
  });
  
  // Memory Monitor (if available)
  createEffect(() => {
    const updateMemory = () => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        const usedMB = mem.usedJSHeapSize / 1048576;
        setMemory(Math.round(usedMB * 10) / 10);
      }
    };
    
    if (isVisible()) {
      const interval = setInterval(updateMemory, 1000);
      onCleanup(() => clearInterval(interval));
    }
  });
  
  // Render Counter
  createEffect(() => {
    setRenderCount(c => c + 1);
  });
  
  const toggleVisibility = () => setIsVisible(v => !v);
  
  return (
    <div class="fixed bottom-4 right-4 z-50">
      {!isVisible() ? (
        <button
          onClick={toggleVisibility}
          class="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          📊 Performance
        </button>
      ) : (
        <div class="bg-white rounded-lg shadow-2xl border-2 border-blue-500 p-4 w-64">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-800">Performance Monitor</h3>
            <button
              onClick={toggleVisibility}
              class="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* FPS */}
          <div class="mb-3 p-3 bg-green-50 rounded">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">FPS</span>
              <span class="text-2xl font-bold text-green-600">{fps()}</span>
            </div>
            <div class="mt-1 bg-green-200 rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((fps() / 60) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Memory */}
          {'memory' in performance && (
            <div class="mb-3 p-3 bg-purple-50 rounded">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Memory</span>
                <span class="text-lg font-bold text-purple-600">
                  {memory()} MB
                </span>
              </div>
            </div>
          )}
          
          {/* Render Count */}
          <div class="p-3 bg-blue-50 rounded">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Signal Updates</span>
              <span class="text-lg font-bold text-blue-600">
                {renderCount()}
              </span>
            </div>
          </div>
          
          <div class="mt-3 text-xs text-gray-500 text-center">
            Real-time performance metrics
          </div>
        </div>
      )}
    </div>
  );
}