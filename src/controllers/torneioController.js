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
                        res.status(203).send();
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
                        alert("Já existe um torneio ativo!")
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

module.exports = {
    verificar,
    criar
}