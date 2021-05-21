import app from "./app";
const port = 8000;
app.app.listen(port, () => {
    console.log("Server running in port " + port);
});
export default app;