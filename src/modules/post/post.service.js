import { AppError } from "@utils/appError.js";
import { Op } from "sequelize";

//post.service.js
export class PostService {
  constructor(
    sequelize,
    postModel,
    userModel,
    PostImage,
    likeModel,
    CommentService,
    followModel
  ) {
    this.sequelize = sequelize;
    this.Post = postModel;
    this.User = userModel;
    this.PostImage = PostImage;
    this.Like = likeModel;
    this.commentService = CommentService;
    this.Follow = followModel;
  }

  async getPosts(currUserId) {
    const posts = await this.Post.findAll({
      where: { userId: currUserId },
      include: [
        {
          model: this.PostImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: this.User,
          as: "author",
          attributes: ["name", "surname"],
        },
      ],
      attributes: ["description", "title"],
      order: [["id", "DESC"]],
    });
    return posts;
  }
  async createPost(userId, body, files) {
    const uploadedPaths = files?.map((f) => f.path) ?? [];

    try {
      return await this.sequelize.transaction(async (transaction) => {
        const post = await this.Post.create(
          { title: body.title, description: body.description, userId },
          { transaction }
        );

        if (files?.length) {
          const photos = files.map((f) => ({
            postId: post.id,
            image_url: f.path,
          }));
          await this.PostImage.bulkCreate(photos, { transaction });
        }

        return post.get({ plain: true });
      });
    } catch (err) {
      // Cleanup uploaded files if transaction fails
      await this.cleanupFiles(uploadedPaths);
      throw err;
    }
  }
  async cleanupFiles(paths) {
    for (const path of paths) {
      try {
        await fs.unlink(path);
      } catch (err) {
        console.error("[CLEANUP_FAILED]", { path, error: err.message });
      }
    }
  }
  async getPostById(currUserId, postId) {
    const post = await this.Post.findByPk(postId, {
      attributes: ["id", "description", "title"],
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["name", "surname", "isPrivate", "id"],
        },
        {
          model: this.PostImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: this.Like,
          as: "postLikes",
          attributes: ["userId"],
          include: [
            {
              model: this.User,
              as: "likeAuthor",
              attributes: ["name", "username"],
            },
          ],
        },
      ],
    });
    if (!post) throw new AppError("Post not found", 404);
    const plain = post.get({ plain: true });

    const likesCount = await this.Like.count({
      where: {
        postId: plain.id,
      },
    });

    const users = plain.postLikes.map((elm) => {
      return elm.likeAuthor;
    });

    const postPublic = {
      description: plain.description,
      title: plain.title,
      images: plain.images.map((img) => ({ image_url: img.image_url })),
      author: {
        name: plain.author.name,
        surname: plain.author.surname,
      },
      likes: { count: likesCount, likedUsers: users },
    };

    const author = plain.author;
    if (author.id === currUserId) return postPublic;
    if (!author.isPrivate) return postPublic;
    const follow = await this.Follow.findOne({
      where: { followerId: currUserId, followingId: author.id },
    });
    if (!follow || follow.status !== "followed") {
      throw new AppError("You cannot view this post", 403);
    }
    return postPublic;
  }
  async likePost(currUserId, postId) {
    return this.sequelize.transaction(async (transaction) => {
      const [like, created] = await this.Like.findOrCreate({
        where: { userId: currUserId, postId: postId },
        defaults: { status: true },
        transaction,
      });
      if (!created) {
        like.status = !like.status;
        await like.save({ transaction });
      }

      return {
        liked: like.status,
        message: like.status ? "Post liked" : "Post unliked",
      };
    });
  }
}
