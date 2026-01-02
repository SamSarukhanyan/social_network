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
const { User, Follow, Post, PostImage } = models;

// associations
////User
User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});
User.belongsToMany(User, {
  through: Follow,
  as: "Followings",
  foreignKey: "followerId",
  otherKey: "followingId",
});

User.hasMany(Follow, {
  foreignKey: "followerId",
  as: "sentFollows",
  onDelete: "CASCADE",
});
User.hasMany(Follow, {
  foreignKey: "followingId",
  as: "receivedFollows",
  onDelete: "CASCADE",
});
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
});
//Follow
Follow.belongsTo(User, {
  foreignKey: "followerId",
  as: "sender",
});
Follow.belongsTo(User, {
  foreignKey: "followingId",
  as: "receiver",
});
//Post
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});
PostImage.belongsTo(Post, { foreignKey: "postId" });
Post.hasMany(PostImage, {
  foreignKey: "postId",
  as: "images",
  onDelete: "CASCADE",
});

export default models;
