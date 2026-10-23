const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;
const urls = new Map();

app.use(express.json());
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"));
});

app.get("/:codigo", (req, res, next) => {
    if (!/^[A-Za-z0-9_-]+$/.test(req.params.codigo)) return next();
    const destino = urls.get(req.params.codigo);
    if (!destino) return next();
    return res.redirect(destino);
});

app.post("/api/encurtar", async (req, res) => {
    const { url } = req.body || {};

    if (typeof url !== "string" || !url.trim()) {
        return res.status(400).json({ erro: "Envie uma URL." });
    }

    let endereco;
    try {
        endereco = new URL(url.trim());
    } catch {
        return res.status(400).json({ erro: "Informe uma URL válida." });
    }

    if (!["http:", "https:"].includes(endereco.protocol)) {
        return res.status(400).json({ erro: "A URL deve começar com http:// ou https://." });
    }

    const codigo = require("crypto").randomBytes(4).toString("hex");
    urls.set(codigo, endereco.toString());

    return res.json({ urlCurta: `${req.protocol}://${req.get("host")}/${codigo}` });
});

app.listen(port, () => {
    console.log(`Servidor disponível em http://localhost:${port}`);
});
