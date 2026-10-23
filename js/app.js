const form = document.querySelector("#form-url");
const campoUrl = document.querySelector("#url");
const resultado = document.querySelector("#resultado");
const botao = form.querySelector("button");

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    resultado.textContent = "Encurtando...";
    botao.disabled = true;

    try {
        const resposta = await fetch("/api/encurtar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: campoUrl.value }),
        });
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Não foi possível encurtar a URL.");
        }

        resultado.replaceChildren("Link curto: ");
        const link = document.createElement("a");
        link.href = dados.urlCurta;
        link.textContent = dados.urlCurta;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        resultado.append(link);
    } catch (erro) {
        resultado.textContent = erro.message || "Ocorreu um erro ao encurtar a URL.";
    } finally {
        botao.disabled = false;
    }
});
