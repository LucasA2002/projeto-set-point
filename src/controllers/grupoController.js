var gruposModel = require("../models/gruposModel");

function gerarCodigo() {
    var caracteres = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ]
    var codigo = ""

    for (let i = 0; i < 4; i++) {
        codigo += caracteres[Math.floor(Math.random() * caracteres.length)]
    }

    return codigo;
};


function criar(req, res) {
    var nomeGrupo = req.body.nomeGrupoServer;
    var idUsuario = req.body.idUsuarioServer;

    if (nomeGrupo == undefined) {
        res.status(400).send("nomeGrupo está indefinido!");
    } else if (idUsuario == undefined) {
        res.status(400).send("idUsuario está indefinido!");
    } else {
        let codigo = gerarCodigo();

        gruposModel.criarGrupo(nomeGrupo, codigo, idUsuario)
            .then(function (resultadoCriarGrupo) {
                
                var idGrupoCriado = resultadoCriarGrupo.insertId;

                gruposModel.adicionarMembro(idGrupoCriado, idUsuario, "admin")
                    .then(
                        function () {
                            res.status(201).json({
                                id_grupo: idGrupoCriado,
                                nome: nomeGrupo,
                                codigo_convite: codigo
                            });
                        })
                    .catch(function (erro) {
                        console.log(erro);
                        console.log("\nErro ao adicionar criador como membro! Erro: ", erro.sqlMessage);
                        res.status(500).json(erro.sqlMessage);
                    });
            })
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao criar o grupo! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                });
    }
}


function entrar(req, res) {
    var codigo = req.body.codigoServer;
    var idUsuario = req.body.idUsuarioServer

    // validações
    if (codigo == undefined) {
        res.status(400).send("Seu código está undefined!");
    }
    else if (idUsuario == undefined) {
        res.status(400).send("Seu idUsuario está undefined!");
    } else {
        // buscar grupo pelo código
        gruposModel.buscarPeloCodigo(codigo)
            .then(
                function (resultadoGrupo) {
                    if (resultadoGrupo.length == 1) {
                        var grupo = resultadoGrupo[0];

                        gruposModel.adicionarMembro(grupo.id_grupo, idUsuario, "membro")
                            .then(
                                function () {
                                    res.status(200).json({
                                        id_grupo: grupo.id_grupo,
                                        nome: grupo.nome,
                                        codigo_convite: grupo.codigo_convite
                                    });
                                })
                            .catch(function (erro) {
                                console.log(erro);
                                console.log("\nErro ao entrar no grupo! Erro: ", erro.sqlMessage);
                                res.status(500).json(erro.sqlMessage);
                            });
                    } else if (resultadoGrupo.length == 0) {
                        res.status(404).send("Código inválido. Grupo não encontrado.");
                    } else {
                        res.status(500).send("Mais de um grupo com o mesmo código!");
                    }

                })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nErro ao buscar grupo pelo código! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listar(req, res)  {
    var idUsuario = req.params.idUsuario

    if (idUsuario == undefined) {
        res.status(400).send("idUsuario está undefined!")
    } else  {
        gruposModel.listarGruposDoUsuario(idUsuario)
            .then(function(resultado) {
                res.status(200).json(resultado);
            })
            .catch(function(erro){
                console.log(erro);
                console.log("\nHouve um erro ao listar grupos do usuário Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage)
            });
    }
}


module.exports = {
    criar,
    entrar,
    listar
}