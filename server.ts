import fs from "fs";
import Express from "express";

const app = Express();

const tranpiler = new Bun.Transpiler({
    loader: "ts",
});
app.get("/script.js", async (req, res) => {
    const tscode = fs.readFileSync(`${__dirname}/index.ts`, "utf-8");
    const jscode = await tranpiler.transform(tscode);
    res.setHeader("Content-Type", "application/javascript");
    res.send(jscode);
});

app.use(Express.static(`${__dirname}/template`));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
