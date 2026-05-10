var express = require("express");
var router = express.Router();

var torneioController = require("../controllers/torneioController");

router.get("/ativo/:idGrupo", function (req, res) {
    torneioController.verificar(req, res);
})

router.post("/criar", function (req, res) {
    torneioController.criar(req, res);
})

router.post("/:idTorneio/gerar-chaveamento", function (req, res) {
    torneioController.gerarChaveamento(req, res);
})

router.get("/:idTorneio/partidas", function (req, res) {
    torneioController.listarPartidas(req, res);
})

module.exports = router;