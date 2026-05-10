var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        const u = resultadoAutenticar[0];
                        console.log(resultadoAutenticar);

                        res.status(200).json({
                            id_usuario: u.id_usuario,
                            email: u.email,
                            nome: u.nome,
                            genero: u.genero,
                            nivel: u.nivel
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // variáveis para guardar os dados do body
    var nome = req.body.nomeServer;
    var data_nascimento = req.body.nascServer;
    var genero = req.body.generoServer
    var nivel = req.body.nivelServer
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    // validaçoes
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    }
    else if (data_nascimento == undefined){
        res.status(400).send("Sua data de nascimento está undefined!");
    } 
    else if (genero == undefined){
        res.status(400).send("Seu gênero está undefined!");
    } 
    else if (nivel == undefined){
        res.status(400).send("Seu nível está undefined!");
    } 
    else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        // passando os valores como parâmetro (seguimento no arquivo usuarioModel.js)
        usuarioModel.cadastrar(nome, data_nascimento, genero, nivel, email, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}