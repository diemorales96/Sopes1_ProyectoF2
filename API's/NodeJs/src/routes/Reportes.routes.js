const { Router } = require("express");
const router = Router();
const {
  getData,
  getRam,
  getLog,
  getResult,
} = require("../controllers/Reportes.controller");

router.get("/CPU", getData);
router.get("/RAM", getRam);
router.get("/LOG", getLog);
router.get("/RESULTS", getResult);

module.exports = {
    routes: router,
};