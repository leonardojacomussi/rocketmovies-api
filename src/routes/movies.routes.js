const { Router } = require("express");

const MoviesController = require("../controllers/MoviesController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const moviesController = new MoviesController();

const moviesRouter = Router();

moviesRouter.use(ensureAuthenticated);

moviesRouter.get("/", moviesController.index);
moviesRouter.post("/", moviesController.create);
moviesRouter.get("/:id", moviesController.show);
moviesRouter.delete("/:id", moviesController.delete);

module.exports = moviesRouter;