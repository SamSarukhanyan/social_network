//account.service.js
import { USER_PUBLIC_FIELDS } from "@modules/auth/constants/user.attributes.js";
import { AppError } from "@utils/appError.js";
import { Op } from "sequelize";

export class AccountService {
  constructor(User, Follow, Post, sequelize) {
    this.User = User;
    this.Follow = Follow;
    this.Post = Post;
    this.sequelize = sequelize;
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

    return user.Followers || [];
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
    return this.sequelize.transaction(async (transaction) => {
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
        transaction,
      });
      if (!created) {
        follow.status =
          follow.status === "unfollowed"
            ? targetUser.isPrivate
              ? "requested"
              : "followed"
            : "unfollowed";
      }
      await follow.save({ transaction });
      return {
        status: follow.status,
        targetUser: targetUser.toJSON(),
      };
    });
  }
  async getRequests(currUserid) {
    const requests = await this.Follow.findAll({
      where: {
        followingId: currUserid,
        status: "requested",
      },
      include: [
        {
          model: this.User,
          as: "sender",
          attributes: USER_PUBLIC_FIELDS,
        },
      ],
    });

    const plain = requests.map((r) => {
      const p = r.get({ plain: true });
      return {
        sender: p.sender,
      };
    });
    return plain;
  }
  async acceptFollow(currUserId, requestId) {
    const request = await this.Follow.findByPk(requestId);
    if (!request) throw new AppError("Request not found", 404);
    if (request.followingId !== currUserId)
      throw new AppError("Forbidden", 403);
    if (request.status !== "requested")
      throw new AppError("Invalid request state", 400);
    request.status = "followed";
    await request.save();
    return request.status;
  }
  async declineFollow(currUserId, requestId) {
    const request = await this.Follow.findByPk(requestId);
    if (!request) throw new AppError("Request not found", 404);
    if (request.followingId !== currUserId)
      throw new AppError("Forbidden", 403);
    if (request.status !== "requested")
      throw new AppError("Invalid request state", 400);
    request.status = "unfollowed";
    await request.save();
    return request.status;
  }
}
