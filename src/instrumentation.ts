export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // @payloadcms/db-postgres rejects an internal `initializing` promise with no
    // argument when Postgres is down, which surfaces as unhandledRejection: undefined.
    if (process.env.NODE_ENV === 'development') {
      process.on('unhandledRejection', (reason) => {
        if (reason === undefined) return;
      });
    }

    if (!process.env.REDIS_URL) {
      console.warn('[instrumentation] REDIS_URL not set — SEO worker disabled')
      return
    }
    try {
      const { startSeoWorker } = await import('./lib/queue/seoWorker')
      startSeoWorker()
      console.log('[instrumentation] SEO Worker started')
    } catch (err) {
      console.warn('[instrumentation] SEO Worker failed to start (non-fatal):', err)
    }
  }
}
