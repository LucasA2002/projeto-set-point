var database = require("../database/config")

// verifica se existe torneio ativo
function verificarTorneio(id_grupo) {
    var instrucaoSql = `
        SELECT *
        FROM torneio
        WHERE id_grupo = ${id_grupo} AND status = 'ativo'
        LIMIT 1
        ;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarTorneio (id_grupo, nome) {
    var instrucaoSql = `
        INSERT INTO torneio (id_grupo, nome)
        VALUES (${id_grupo}, '${nome}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    verificarTorneio,
    criarTorneio
};