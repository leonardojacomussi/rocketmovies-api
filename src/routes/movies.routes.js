const { Router } = require("express");

const MoviesController = require("../controllers/MoviesController");

const moviesController = new MoviesController();

const moviesRouter = Router();

moviesRouter.get("/", moviesController.index);
moviesRouter.post("/:user_id", moviesController.create);
moviesRouter.get("/:id", moviesController.show);
moviesRouter.delete("/:id", moviesController.delete);

module.exports = moviesRouter;