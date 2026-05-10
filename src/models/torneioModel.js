var database = require("../database/config")

// verifica se existe torneio ativo
function verificarTorneio(id_grupo) {
    var instrucaoSql = `
        SELECT id_torneio, status
        FROM torneio
        WHERE id_grupo = ${id_grupo} AND status = 'ativo'
        LIMIT 1
        ;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    verificarTorneio,
};