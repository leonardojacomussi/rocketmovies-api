const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users")
      .where({ id: user_id }).first();

    if (!user) {
      throw new AppError("User not found", 404);
    };

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    };

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename.file;

    await knex("users")
      .where("id", user_id)
      .update({ ...user, updated_at: knex.fn.now() });

    return response.status(200).json(user);
  };
};

module.exports = UserAvatarController;