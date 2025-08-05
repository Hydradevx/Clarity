import express from "express";
export function startWebService() {
    const app = express();
    const PORT = process.env.PORT || 8080;
    app.get("/", (_req, res) => {
        res.send("✅ Clarity bot web service is running");
    });
    setInterval(() => {
        console.log(`[Web Service] Still alive at ${new Date().toISOString()}`);
    }, 60_000);
    app.listen(PORT, () => {
        console.log(`🌐 Web service listening on port ${PORT}`);
    });
}
