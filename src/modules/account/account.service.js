//account.service.js
import { AppError } from "@utils/appError.js";
import { Op } from "sequelize";

export class AccountService {
  constructor(User, Follow, Post) {
    this.User = User;
    this.Follow = Follow;
    this.Post = Post;
  }
  async searchByUserName(text) {
    const founds = await this.User.findAll({
      where: {
        name: { [Op.like]: `${text}%` },
      },
      attributes: ["name", "surname", "username", "picture_url"],
    });
    return founds || [];
  }
  async getAccountById(id) {
    const account = await this.User.findByPk(id);
    if (!account) throw new AppError("Account not found", 404);

    const followersCount = await this.Follow.count({
      where: {
        followingId: id,
        status: "followed",
      },
    });

    const followingsCount = await this.Follow.count({
      where: {
        followerId: id,
        status: "followed",
      },
    });

    const postsCount = await this.Post.count({
      where: {
        userId: id,
      },
    });
    return {
      ...account.toJSON(),
      counts: {
        followers: followersCount,
        followings: followingsCount,
        posts: postsCount,
      },
    };
  }

  async getFollowers(userId) {
    const user = await this.User.findByPk(userId, {
      include: [
        {
          model: this.User,
          as: "Followers",
          attributes: ["id", "name", "surname", "username", "picture_url"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) return [];

    return user.Followers;
  }
}
