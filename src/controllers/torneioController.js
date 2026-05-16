var torneioModel = require("../models/torneioModel");

function verificar(req, res) {
    var idGrupo = req.params.idGrupo;

    if (idGrupo == undefined) {
        res.status(400).send("idGrupo está indefinido!");
    } else {
        torneioModel.verificarTorneio(idGrupo)
            .then(
                function (resultadoVerificar) {
                    console.log(`\nResultados encontrados: ${resultadoVerificar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoVerificar)}`);

                    if (resultadoVerificar.length == 1) {
                        var t = resultadoVerificar[0];
                        console.log(resultadoVerificar);

                        res.status(200).json({
                            id_torneio: t.id_torneio,
                            id_grupo: t.id_grupo,
                            nome: t.nome,
                            status: t.status,
                            id_campeao: t.id_campeao,
                            dt_criacao: t.dt_criacao,
                            dt_finalizacao: t.dt_finalizacao
                        });
                    } else if (resultadoVerificar.length == 0) {
                        res.status(204).send();
                    } else {
                        res.status(500).send("Erro na lógica do backend");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao verificar o torneio! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function criar(req, res) {
    var idGrupo = req.body.idGrupoAtualServer;
    var nomeTorneio = req.body.nomeTorneioServer;

    if (idGrupo == undefined) {
        res.status(400).send("idGrupo está indefinido!");
    } else if (nomeTorneio == undefined) {
        res.status(400).send("nomeTorneio está indefinido!");
    } else {
        torneioModel.verificarTorneio(idGrupo)
            .then(
                function (resultado) {
                    if (resultado.length == 1) {
                        res.status(400).send("Já existe um torneio ativo!");
                    } else {
                        torneioModel.criarTorneio(idGrupo, nomeTorneio)
                            .then(
                                function (resultadoCriar) {
                                    res.status(201).json({
                                        mensagem: "Torneio criado com sucesso!",
                                        idTorneio: resultadoCriar.insertId
                                    });
                                }
                            ).catch(
                                function (erro) {
                                    console.log(erro);
                                    console.log(
                                        "\nHouve um erro ao realizar a criação do torneio! Erro: ",
                                        erro.sqlMessage
                                    );
                                    res.status(500).json(erro.sqlMessage);
                                }
                            );
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao verificar torneio ativo! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function gerarChaveamento(req, res) {
    var idTorneio = req.params.idTorneio;
    var idGrupo = req.body.idGrupo;

    if (idTorneio == undefined) {
        res.status(400).send("idTorneio está indefinido!");
    } else if (idGrupo == undefined) {
        res.status(400).send("idGrupo está indefinido!");
    } else {

        // verificando se o torneio já possui partidas
        torneioModel.listarPartidas(idTorneio)
            .then(function (partidas) {
                if (partidas.length > 0) {
                    res.status(400).send("Este torneio já possui chaveamento.");
                } else {

                    // buscando membros do grupo
                    torneioModel.buscarMembrosDoGrupo(idGrupo)
                        .then(function (membros) {
                            console.log("MEMBROS ENCONTRADOS:", membros);
                            console.log("TOTAL MEMBROS:", membros.length);

                            if (membros.length != 4) {
                                res.status(400).send("É necessário ter exatamente 4 membros para gerar o chaveamento.");
                            } else {

                                // gerando chaveamento com duas semifinais
                                torneioModel.gerarChaveamento(idTorneio, membros)
                                    .then(function () {
                                        res.status(201).json({
                                            mensagem: "Chaveamento gerado com sucesso!",
                                            total_participantes: membros.length,
                                            total_partidas: 2
                                        });
                                    })
                                    .catch(function (erro) {
                                        console.log(erro);
                                        console.log("\nHouve um erro ao gerar o chaveamento! Erro: ", erro.sqlMessage);
                                        res.status(500).json(erro.sqlMessage);
                                    });
                            }
                        })
                        .catch(function (erro) {
                            console.log(erro);
                            console.log("\nHouve um erro ao buscar membros do grupo! Erro: ", erro.sqlMessage);
                            res.status(500).json(erro.sqlMessage);
                        });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao verificar partidas do torneio! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listarPartidas(req, res) {
    var idTorneio = req.params.idTorneio;

    if (idTorneio == undefined) {
        res.status(400).send("idTorneio está indefinido!");
    } else {
        torneioModel.listarPartidas(idTorneio)
            .then(function (resultado) {
                if (resultado.length == 0) {
                    res.status(204).send();
                } else {
                    res.status(200).json(resultado);
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nErro ao listar partidas: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function registrarVencedor(req, res) {
    var idPartida = req.params.idPartida;
    var idVencedor = req.body.idVencedor;

    if (idPartida == undefined) {
        res.status(400).send("idPartida está indefinido!");
    } else if (idVencedor == undefined) {
        res.status(400).send("idVencedor está indefinido!");
    } else {

        // registra vencedor da partida, se a partida for a final finaliza o torneio
        torneioModel.registrarVencedor(idPartida, idVencedor)
            .then(function () {
                res.status(200).json({
                    mensagem: "Vencedor registrado com sucesso!"
                });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nErro ao registrar vencedor: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function gerarFinal(req, res) {
    var idTorneio = req.params.idTorneio;

    if (idTorneio == undefined) {
        res.status(400).send("idTorneio está indefinido!");
    } else {

        // gera a final apenas se as duas semifinais estiverem finalizadas
        torneioModel.gerarFinal(idTorneio)
            .then(function (resultado) {
                if (resultado.affectedRows == 0) {
                    res.status(400).send("A final só pode ser gerada após as duas semifinais serem finalizadas.");
                } else {
                    res.status(201).json({
                        mensagem: "Final gerada com sucesso!"
                    });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nErro ao gerar final: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

// dados para a dash
function dados(req, res)  {
    var idGrupo = req.params.idGrupo

    if (idGrupo == undefined) {
        res.status(400).send("idGrupo está undefined!")
    } else  {
        torneioModel.buscarDados(idGrupo)
            .then(function(resultado) {
                res.status(200).json(resultado);
            })
            .catch(function(erro){
                console.log(erro);
                console.log("\nHouve um erro ao buscar dados dos torneios do grupo Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage)
            });
    }
}

module.exports = {
    verificar,
    criar,
    gerarChaveamento,
    listarPartidas,
    registrarVencedor,
    gerarFinal,
    dados
};