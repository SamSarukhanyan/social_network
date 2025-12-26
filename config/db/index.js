import { sequelize } from "@db/db-config.js";
import { DataTypes } from "sequelize";

import UserModel from "@modules/auth/auth.model.js";
import FollowModel from "@modules/follow/follow.model.js";
import PostModel from "@modules/post/post.model.js";
import PostImageModel from "@modules/post/postImage.model.js";

const models = {};

//  attach sequelize
models.sequelize = sequelize;

//  init models
models.User = UserModel(sequelize, DataTypes);
models.Follow = FollowModel(sequelize, DataTypes);
models.Post = PostModel(sequelize, DataTypes);
models.PostImage = PostImageModel(sequelize, DataTypes);

// associations
models.User.belongsToMany(models.User, {
  through: models.Follow,
  as: "Followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});

models.User.belongsToMany(models.User, {
  through: models.Follow,
  as: "Followings",
  foreignKey: "followerId",
  otherKey: "followingId",
});
models.User.hasMany(models.Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
});
models.User.hasMany(models.Follow, {
  foreignKey: "followerId",
  onDelete: "CASCADE",
});
models.User.hasMany(models.Follow, {
  foreignKey: "followingId",
  onDelete: "CASCADE",
});
models.Post.belongsTo(models.User, {
  foreignKey: "userId",
  as: "author",
});
models.PostImage.belongsTo(models.Post, { foreignKey: "postId" });
models.Post.hasMany(models.PostImage, {
  foreignKey: "postId",
  as: "images",
  onDelete: "CASCADE",
});

export default models;
