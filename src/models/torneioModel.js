var database = require("../database/config")

// verifica se existe torneio ativo
function verificarTorneio(id_grupo) {
    var instrucaoSql = `
        SELECT * FROM torneio
        WHERE id_grupo = ${id_grupo} AND status = 'ativo'
        LIMIT 1
        ;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarTorneio(id_grupo, nome) {
    var instrucaoSql = `
        INSERT INTO torneio (id_grupo, nome)
        VALUES (${id_grupo}, '${nome}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMembrosDoGrupo(id_grupo) {
    var instrucaoSql = `
        SELECT 
        usuario.id_usuario,
        usuario.nome
        FROM grupo_membro
        JOIN usuario 
        ON usuario.id_usuario = grupo_membro.id_usuario
        WHERE grupo_membro.id_grupo = ${id_grupo};
  `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function gerarChaveamento(id_torneio, membros) {
    var valoresParticipantes = "";

    for (let i = 0; i < membros.length; i++) {
        valoresParticipantes += `(${id_torneio}, ${membros[i].id_usuario})`;

        if (i < membros.length - 1) {
            valoresParticipantes += ", ";
        }
    }

    var instrucaoParticipantes = `
        INSERT INTO torneio_participante (id_torneio, id_usuario)
        VALUES ${valoresParticipantes};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoParticipantes);

    return database.executar(instrucaoParticipantes)
        .then(function () {
            var instrucaoPartidas = `
                INSERT INTO partida 
                    (id_torneio, rodada, numero_partida, id_jogador1, id_jogador2, status)
                VALUES
                    (${id_torneio}, 1, 1, ${membros[0].id_usuario}, ${membros[1].id_usuario}, 'pendente'),
                    (${id_torneio}, 1, 2, ${membros[2].id_usuario}, ${membros[3].id_usuario}, 'pendente');
            `;

            console.log("Executando a instrução SQL: \n" + instrucaoPartidas);
            return database.executar(instrucaoPartidas);
        });
}

function listarPartidas(id_torneio) {
    var instrucaoSql = `
        SELECT 
        partida.id_partida,
        partida.rodada,
        partida.numero_partida,
        partida.status,
        jogador1.nome AS nome_jogador1,
        jogador2.nome AS nome_jogador2,
        vencedor.nome AS nome_vencedor
        FROM partida
        JOIN usuario AS jogador1
        ON jogador1.id_usuario = partida.id_jogador1
        JOIN usuario AS jogador2
        ON jogador2.id_usuario = partida.id_jogador2
        LEFT JOIN usuario AS vencedor
        ON vencedor.id_usuario = partida.id_vencedor
        WHERE partida.id_torneio = ${id_torneio}
        ORDER BY partida.rodada, partida.numero_partida;
  `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function registrarVencedor(id_partida, id_vencedor) {
    var instrucaoSql = `
        UPDATE partida
        SET 
        id_vencedor = ${id_vencedor},
        status = 'finalizada'
        WHERE id_partida = ${id_partida};

        UPDATE torneio
        JOIN partida 
        ON partida.id_torneio = torneio.id_torneio
        SET 
        torneio.status = 'finalizado',
        torneio.id_campeao = ${id_vencedor},
        torneio.dt_finalizacao = NOW()
        WHERE partida.id_partida = ${id_partida}
        AND partida.rodada = 2;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function gerarFinal(id_torneio) {
    var instrucaoSql = `
        INSERT INTO partida 
        (id_torneio, rodada, numero_partida, id_jogador1, id_jogador2, status)
        SELECT
        ${id_torneio},
        2,
        1,
        MIN(id_vencedor),
        MAX(id_vencedor),
        'pendente'
        FROM partida
        WHERE id_torneio = ${id_torneio}
        AND rodada = 1
        AND status = 'finalizada'
        HAVING COUNT(*) = 2;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    verificarTorneio,
    criarTorneio,
    buscarMembrosDoGrupo,
    gerarChaveamento,
    listarPartidas,
    registrarVencedor,
    gerarFinal
};