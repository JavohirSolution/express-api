
const app = require("./app")

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    try {
        console.log(`[server]: Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.log(error);
    }
});