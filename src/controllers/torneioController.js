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
                        res.status(403).send("Sem torneio ativo!");
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


module.exports = {
    verificar,
}