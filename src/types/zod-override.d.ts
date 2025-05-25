// Override Zod types to fix compilation issues
declare module 'zod' {
  export * from 'zod/lib/index';
}
