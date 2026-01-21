import { serveStatic } from "./static";
import { app, httpServer, log } from "./app";

(async () => {
  try {
    log("Starting server initialization...");

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
      log("Static files configured for production");
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
      log("Vite dev server configured");
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`serving on port ${port}`);
      },
    );
  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
})();
