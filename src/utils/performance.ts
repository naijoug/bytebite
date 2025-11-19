/**
 * Performance monitoring utilities
 * Tracks Web Vitals and provides performance insights
 */

// Report Web Vitals to console in development
export function reportWebVitals() {
  if (import.meta.env.DEV && 'performance' in window) {
    // Log basic performance metrics
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.log('[Performance] Page Load Metrics:', {
          'DNS Lookup': `${perfData.domainLookupEnd - perfData.domainLookupStart}ms`,
          'TCP Connection': `${perfData.connectEnd - perfData.connectStart}ms`,
          'Request Time': `${perfData.responseStart - perfData.requestStart}ms`,
          'Response Time': `${perfData.responseEnd - perfData.responseStart}ms`,
          'DOM Processing': `${perfData.domComplete - perfData.domInteractive}ms`,
          'Total Load Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`,
        });
      }
    });
  }
}

// Measure component render time
export function measureRender(componentName: string, callback: () => void) {
  if (import.meta.env.DEV) {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(
      `[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`
    );
  } else {
    callback();
  }
}

// Log performance marks
export function markPerformance(name: string) {
  if (import.meta.env.DEV && 'performance' in window) {
    performance.mark(name);
  }
}

// Measure between two marks
export function measurePerformance(
  name: string,
  startMark: string,
  endMark: string
) {
  if (import.meta.env.DEV && 'performance' in window) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
    } catch {
      // Marks don't exist, skip
    }
  }
}
