var database = require("../database/config")

function criarGrupo(nome, codigo, idCriador) {
    var instrucaoSql = `
        INSERT INTO grupo (nome, codigo_convite, id_criador)
        VALUES ('${nome}', '${codigo}', ${idCriador});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function adicionarMembro(idGrupo, idUsuario, papel) {
    var instrucaoSql = `
        INSERT INTO grupo_membro (id_grupo, id_usuario, papel)
        VALUES (${idGrupo}, ${idUsuario}, '${papel}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPeloCodigo(codigo) {
    var instrucaoSql = `
        SELECT id_grupo, nome, codigo_convite
        FROM grupo
        WHERE codigo_convite = '${codigo}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarGruposDoUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT g.id_grupo, g.nome, g.codigo_convite, gm.papel,
            (SELECT COUNT(*) FROM grupo_membro gm2 WHERE gm2.id_grupo = g.id_grupo) AS total_membros
        FROM grupo_membro gm
        JOIN grupo g ON g.id_grupo = gm.id_grupo
        WHERE gm.id_usuario = ${idUsuario}
        ORDER BY g.dt_criacao DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contarMembros(idGrupo) {
    var instrucaoSql = `
        SELECT COUNT(*) AS total
        FROM grupo_membro
        WHERE id_grupo = ${idGrupo};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    criarGrupo,
    adicionarMembro,
    buscarPeloCodigo,
    listarGruposDoUsuario,
    contarMembros
};