const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MoviesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const user_id = req.user.id;

    if (!title || !description || !rating || !tags) {
      throw new AppError("Missing required information", 400);
    };

    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    };

    const [movie_id] = await knex("movies").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsToInsert = tags.map(name => ({
      movie_id,
      user_id,
      name,
    }));

    await knex("tags").insert(tagsToInsert);

    return res.status(201).json({ message: "Movie created successfully" });
  };

  async show(req, res) {
    const { id } = req.params;

    const movie = await knex("movies").where({ id }).first();
    const tags = await knex("tags").where({ movie_id: id }).orderBy("name");

    return res.status(200).json({
      ...movie,
      tags,
    });
  };

  async delete(req, res) {
    const { id } = req.params;

    await knex("movies").where({ id }).delete();

    return res.status(200).json({ message: "Movie deleted successfully" });
  };

  async index(req, res) {
    const { title, tags } = req.query;
    const user_id = req.user.id;

    let movies;

    if (tags) {
      const filteredTags = tags.split(",").map(tag => tag.trim());
      movies = await knex("tags")
        .select([
          "movies.id",
          "movies.title",
          "movies.user_id",
        ])
        .where("movies.user_id", user_id)
        .whereLike("movies.title", `%${title}%`)
        .whereIn("name", filteredTags)
        .innerJoin("movies", "movies.id", "tags.movie_id")
        .groupBy("movies.id")
        .orderBy("movies.title", "asc");
    } else {
      movies = await knex("movies")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    };

    const userTags = await knex("tags").where({ user_id });
    const moviesWithTags = movies.map(movie => {
      const movieTags = userTags.filter(tag => tag.movie_id === movie.id);
      return {
        ...movie,
        tags: movieTags,
      };
    });

    return res.status(200).json(moviesWithTags);
  };
};

module.exports = MoviesController;