const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Email already in use", 400);
    };

    const hashedPassword = await hash(password, 8);
    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  };

  async update(req, res) {
    const { name, email, password, oldPassword } = req.body;
    const { id } = req.params;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("User not found", 404);
    };

    const userWithUpdatedEmail = await knex("users").where({ email }).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email already in use", 400);
    };

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !oldPassword) {
      throw new AppError("Old password is required to update password", 400);
    };

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match", 400);
      };

      const hashedPassword = await hash(password, 8);
      user.password = hashedPassword;
    };

    await knex("users")
      .where({ id })
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      });

    return res.status(200).json({ message: "User updated successfully" });
  };
};

module.exports = UsersController;