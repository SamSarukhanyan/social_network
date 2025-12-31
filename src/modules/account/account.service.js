//account.service.js
import { USER_PUBLIC_FIELDS } from "@modules/auth/constants/user.attributes.js";
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
      attributes: USER_PUBLIC_FIELDS,
    });
    return founds || [];
  }
  async getAccountById(id) {
    const account = await this.User.findByPk(id);
    if (!account) throw new AppError("Account not founddd", 404);

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
      attributes: ["id"],
      include: [
        {
          model: this.User,
          as: "Followers",
          attributes: USER_PUBLIC_FIELDS,
          through: {
            where: { status: "followed" },
            attributes: [],
          },
        },
      ],
    });

    if (!user) throw new AppError("User not found", 404);

    return user.Followers.length ? user.followers : [];
  }
  async getFollowings(userId) {
    const user = await this.User.findByPk(userId, {
      attributes: ["id"],
      include: [
        {
          model: this.User,
          as: "Followings",
          attributes: USER_PUBLIC_FIELDS,
          through: {
            where: { status: "followed" },
            attributes: [],
          },
        },
      ],
    });

    if (!user) throw new AppError("User not found", 404);

    return user.Followings;
  }

  async follow(curr, target) {
    if (curr == target) throw new AppError("bad request", 400);
    const targetUser = await this.User.findByPk(target);
    if (!targetUser) throw new AppError("User not found", 404);

    const [follow, created] = await this.Follow.findOrCreate({
      where: {
        followerId: curr,
        followingId: target,
      },
      defaults: {
        status: targetUser.isPrivate ? "requested" : "followed",
      },
    });
    if (!created) {
      switch (follow.status) {
        case "followed":
          follow.status = "unfollowed";
          break;
        case "requested":
          follow.status = "unfollowed";
          break;
        case "unfollowed":
          follow.status = targetUser.isPrivate ? "requested" : "followed";
          break;
      }
    }
    await follow.save();
    return {
      status: follow.status,
      targetUser: targetUser.toJSON(),
    };

    return;
  }
}
