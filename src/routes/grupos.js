var express = require("express");
var router = express.Router();

var grupoController = require("../controllers/grupoController");

//Recebendo os dados do html e direcionando para a função criar de grupoController.js
router.post("/criar", function (req, res) {
    grupoController.criar(req, res);
})

router.post("/entrar", function (req, res) {
    grupoController.entrar(req, res);
});

router.get("/:idUsuario", function (req, res) {
    grupoController.listar(req, res);
});

module.exports = router;