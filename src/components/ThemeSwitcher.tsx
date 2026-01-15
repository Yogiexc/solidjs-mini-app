import { createSignal, createEffect } from 'solid-js';

/**
 * Theme Switcher Component
 * Supports: Light, Dark, System
 * Persists theme preference
 * 
 * Demonstrates: localStorage with signals, DOM manipulation
 */

type Theme = 'light' | 'dark' | 'system';

export default function ThemeSwitcher() {
  // Initialize from localStorage or default to system
  const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  };
  
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme());
  
  // Apply theme to document
  createEffect(() => {
    const currentTheme = theme();
    let effectiveTheme: 'light' | 'dark' = 'light';
    
    if (currentTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      effectiveTheme = currentTheme;
    }
    
    // Update document class
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem('theme', currentTheme);
  });
  
  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme());
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  
  const getThemeIcon = () => {
    switch (theme()) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '💻';
    }
  };
  
  const getThemeLabel = () => {
    switch (theme()) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  };
  
  return (
    <button
      onClick={cycleTheme}
      class="fixed top-4 right-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all z-40"
      title={`Theme: ${getThemeLabel()}`}
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl">{getThemeIcon()}</span>
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {getThemeLabel()}
        </span>
      </div>
    </button>
  );
}

/**
 * Add to index.css for dark mode support:
 * 
 * .dark {
 *   color-scheme: dark;
 * }
 * 
 * .dark body {
 *   background: #1a1a1a;
 *   color: #f0f0f0;
 * }
 * 
 * .dark .bg-white {
 *   background: #2a2a2a;
 * }
 * 
 * .dark .text-gray-800 {
 *   color: #f0f0f0;
 * }
 * 
 * .dark .text-gray-600 {
 *   color: #d0d0d0;
 * }
 * 
 * .dark .border-gray-300 {
 *   border-color: #4a4a4a;
 * }
 */