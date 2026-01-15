import { createSignal, For, batch } from 'solid-js';

/**
 * Benchmark Suite Component
 * Performance testing untuk SolidJS reactivity
 * 
 * Tests:
 * 1. Batch updates (1000 signals)
 * 2. List rendering (10000 items)
 * 3. Deep reactivity (nested signals)
 * 4. Signal creation overhead
 */

interface BenchmarkResult {
  name: string;
  duration: number;
  status: 'pending' | 'running' | 'completed';
}

export default function BenchmarkSuite() {
  const [results, setResults] = createSignal<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = createSignal(false);
  
  // Benchmark 1: Batch Updates
  const benchmarkBatchUpdates = async (): Promise<number> => {
    const signals = Array.from({ length: 1000 }, () => createSignal(0));
    
    const start = performance.now();
    
    batch(() => {
      signals.forEach(([_, set]) => {
        for (let i = 0; i < 100; i++) {
          set(v => v + 1);
        }
      });
    });
    
    return performance.now() - start;
  };
  
  // Benchmark 2: List Rendering
  const benchmarkListRendering = async (): Promise<number> => {
    const [items, setItems] = createSignal(
      Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i }))
    );
    
    const start = performance.now();
    
    // Force re-render by updating all items
    setItems(prev => prev.map(item => ({ ...item, value: item.value + 1 })));
    
    // Wait for DOM update
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    return performance.now() - start;
  };
  
  // Benchmark 3: Deep Reactivity
  const benchmarkDeepReactivity = async (): Promise<number> => {
    const [level1, setLevel1] = createSignal(0);
    const level2 = () => level1() * 2;
    const level3 = () => level2() * 2;
    const level4 = () => level3() * 2;
    const level5 = () => level4() * 2;
    
    const start = performance.now();
    
    for (let i = 0; i < 10000; i++) {
      setLevel1(v => v + 1);
      // Access deep signal
      level5();
    }
    
    return performance.now() - start;
  };
  
  // Benchmark 4: Signal Creation
  const benchmarkSignalCreation = async (): Promise<number> => {
    const start = performance.now();
    
    for (let i = 0; i < 10000; i++) {
      createSignal(i);
    }
    
    return performance.now() - start;
  };
  
  const runBenchmark = async (
    name: string,
    fn: () => Promise<number>
  ) => {
    // Update status to running
    setResults(prev => [
      ...prev,
      { name, duration: 0, status: 'running' }
    ]);
    
    // Run benchmark
    const duration = await fn();
    
    // Update result
    setResults(prev =>
      prev.map(r =>
        r.name === name && r.status === 'running'
          ? { ...r, duration, status: 'completed' }
          : r
      )
    );
  };
  
  const runAllBenchmarks = async () => {
    setIsRunning(true);
    setResults([]);
    
    await runBenchmark('Batch Updates (1000 signals × 100 updates)', benchmarkBatchUpdates);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runBenchmark('List Rendering (10000 items)', benchmarkListRendering);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runBenchmark('Deep Reactivity (5 levels × 10000 updates)', benchmarkDeepReactivity);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await runBenchmark('Signal Creation (10000 signals)', benchmarkSignalCreation);
    
    setIsRunning(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '▶️';
      case 'completed': return '✅';
    }
  };
  
  const getPerformanceRating = (duration: number) => {
    if (duration < 10) return { rating: 'Excellent', color: 'text-green-600' };
    if (duration < 50) return { rating: 'Good', color: 'text-blue-600' };
    if (duration < 100) return { rating: 'Fair', color: 'text-yellow-600' };
    return { rating: 'Slow', color: 'text-red-600' };
  };
  
  return (
    <div class="bg-white p-6 rounded-lg shadow-md border-2 border-orange-500">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        🏎️ Benchmark Suite
      </h2>
      
      <p class="text-sm text-gray-600 mb-4">
        Test performa reactivity system SolidJS dengan berbagai skenario
      </p>
      
      <button
        onClick={runAllBenchmarks}
        disabled={isRunning()}
        class={`w-full px-4 py-2 rounded font-semibold transition ${
          isRunning()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        }`}
      >
        {isRunning() ? 'Running Benchmarks...' : 'Run All Benchmarks'}
      </button>
      
      {results().length > 0 && (
        <div class="mt-4 space-y-3">
          <For each={results()}>
            {(result) => {
              const perf = getPerformanceRating(result.duration);
              return (
                <div class="p-3 bg-gray-50 rounded border border-gray-200">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">{getStatusIcon(result.status)}</span>
                      <span class="text-sm font-semibold text-gray-700">
                        {result.name}
                      </span>
                    </div>
                  </div>
                  
                  {result.status === 'completed' && (
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-2xl font-bold text-orange-600">
                          {result.duration.toFixed(2)}ms
                        </span>
                        <span class={`text-sm font-semibold ${perf.color}`}>
                          {perf.rating}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {result.status === 'running' && (
                    <div class="flex items-center gap-2">
                      <div class="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full" />
                      <span class="text-sm text-gray-500">Running...</span>
                    </div>
                  )}
                </div>
              );
            }}
          </For>
          
          {results().every(r => r.status === 'completed') && (
            <div class="mt-4 p-4 bg-green-50 rounded">
              <p class="text-sm font-semibold text-green-800 mb-2">
                🎉 All benchmarks completed!
              </p>
              <p class="text-xs text-green-700">
                Average time: {(
                  results().reduce((acc, r) => acc + r.duration, 0) / results().length
                ).toFixed(2)}ms
              </p>
            </div>
          )}
        </div>
      )}
      
      <div class="mt-4 text-xs text-gray-500">
        💡 Benchmarks menunjukkan performa real-world SolidJS reactivity
      </div>
    </div>
  );
}