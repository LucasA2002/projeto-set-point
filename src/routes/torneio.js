var express = require("express");
var router = express.Router();

var torneioController = require("../controllers/torneioController");

router.get("/torneios/ativo/:idGrupo", function (req, res) {
    torneioController.verificar(req, res);
})


module.exports = router;