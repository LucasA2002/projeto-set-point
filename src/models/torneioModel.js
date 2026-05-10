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

function buscarTorneioPorId(id_torneio) {
  var instrucaoSql = `
    SELECT id_torneio, id_grupo, nome, status
    FROM torneio
    WHERE id_torneio = ${id_torneio} AND status = 'ativo';
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function contarPartidas(id_torneio) {
  var instrucaoSql = `
    SELECT COUNT(*) AS total
    FROM partida
    WHERE id_torneio = ${id_torneio};
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

function inserirParticipantes(id_torneio, membros) {
  var valores = "";

  for (let i = 0; i < membros.length; i++) {
    valores += `(${id_torneio}, ${membros[i].id_usuario})`;

    if (i < membros.length - 1) {
      valores += ", ";
    }
  }

  var instrucaoSql = `
    INSERT IGNORE INTO torneio_participante (id_torneio, id_usuario)
    VALUES ${valores};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function inserirPartidas(id_torneio, partidas) {
  var valores = "";

  for (let i = 0; i < partidas.length; i++) {
    valores += `(
      ${id_torneio},
      ${partidas[i].rodada},
      ${partidas[i].numero_partida},
      ${partidas[i].id_jogador1},
      ${partidas[i].id_jogador2},
      'pendente'
    )`;

    if (i < partidas.length - 1) {
      valores += ", ";
    }
  }

  var instrucaoSql = `
    INSERT INTO partida 
      (id_torneio, rodada, numero_partida, id_jogador1, id_jogador2, status)
    VALUES ${valores};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
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


module.exports = {
    verificarTorneio,
    criarTorneio,
    buscarTorneioPorId,
    contarPartidas,
    buscarMembrosDoGrupo,
    inserirParticipantes,
    inserirPartidas,
    listarPartidas
};