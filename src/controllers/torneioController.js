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
                    console.log(`Resultados: ${JSON.stringify(resultadoVerificar)}`); // transforma JSON em String

                    if (resultadoVerificar.length == 1) {
                        const t = resultadoVerificar[0];
                        console.log(resultadoVerificar);

                        res.status(200).json({
                            id_torneio: t.id_torneio,
                            id_grupo: t.id_grupo,
                            nome: t.nome,
                            status: t.status,
                            dt_criacao: t.dt_criacao
                        });
                    } else if (resultadoVerificar.length == 0) {
                        res.status(204).send();
                    } else {
                        res.status(403).send("Erro na lógica do backend!");
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

function criar (req, res) {
    var idGrupo = req.body.idGrupoAtualServer;
    var nomeTorneio = req.body.nomeTorneioServer;

    if (idGrupo == undefined) {
        res.status(400).send("idGrupo está indefinido!");
    } else if(nomeTorneio == undefined){
        res.status(400).send("nomeTorneio está indefinido!");
    } else {
        torneioModel.verificarTorneio(idGrupo)
            .then(
                function (resultado){
                    if (resultado.length == 1) {
                        res.status(400).send("Já existe um torneio ativo!")
                    } else {
                        torneioModel.criarTorneio(idGrupo, nomeTorneio)
                        .then(
                            function (resultado) {
                                res.status(201).json({idTorneio: resultado.insertId})
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
            )
    }
}

function gerarChaveamento(req,res) {
    var idTorneio = req.params.idTorneio

    if(idTorneio == undefined) {
        res.status(400).send("idTorneio está indefinido!");
    } else {

        // buscando id do torneio
        torneioModel.buscarTorneioPorId(idTorneio)
            .then(function (resultadoTorneio){
                if (resultadoTorneio.length == 0){
                    res.status(404).send("Torneio não encontrado")
                } else {
                    var torneio = resultadoTorneio[0];
                    var idGrupo = torneio.id_grupo;

                    // verificando se tem chaveamento
                    torneioModel.contarPartidas(idTorneio)
                        .then(function (resultadoPartidas){
                            var totalPartidas = resultadoPartidas[0].total;

                            if(totalPartidas > 0) {
                                res.status(400).send("Este torneio já possui chaveamento")
                            } else {

                                // verificando número de membros
                                torneioModel.buscarMembrosDoGrupo(idGrupo)
                                    .then(function (membros){

                                        console.log("MEMBROS ENCONTRADOS:", membros)
                                        console.log("TOTAL MEMBROS:", membros.length)

                                        if (membros.length < 2){
                                            res.status(400).send("É necessário ter pelo menos 2 participantes.")
                                        } else if (membros.length % 2 != 0){
                                            res.status(400).send("O número de participantes precisa ser par.")
                                        } else {
                                            // inserindo participantes
                                            torneioModel.inserirParticipantes(idTorneio, membros)
                                            . then(function() {
                                                var partidas = [];

                                                for (let i = 0; i < membros.length; i += 2) {
                                                    partidas.push({
                                                        rodada: 1,
                                                        numero_partida: (i / 2) + 1,
                                                        id_jogador1: membros[i].id_usuario,
                                                        id_jogador2: membros[i + 1].id_usuario
                                                    });
                                                }
                                                // grando chaveamento
                                                torneioModel.inserirPartidas(idTorneio, partidas)
                                                    .then(function () {
                                                        res.status(201).json({
                                                            total_participantes: membros.length,
                                                            total_partidas: partidas.length
                                                        });
                                                    })
                                                    .catch(function (erro) {
                                                        console.log(erro);
                                                        res.status(500).json(erro.sqlMessage)
                                                    })
                                            })
                                            .catch(function (erro) {
                                                console.log(erro);
                                                res.status(500).json(erro.sqlMessage)
                                            })
                                        }
                                    })
                                    .catch(function (erro) {
                                        console.log(erro);
                                        res.status(500).json(erro.sqlMessage)
                                    })
                            }
                        })
                        .catch(function (erro) {
                            console.log(erro);
                            res.status(500).json(erro.sqlMessage)
                        })
                }
            })
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

module.exports = {
    verificar,
    criar,
    gerarChaveamento,
    listarPartidas
}