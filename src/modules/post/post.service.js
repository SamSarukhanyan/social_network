import { AppError } from "@utils/appError.js";

//post.service.js
export class PostService {
  constructor(postModel, userModel, PostImage, sequelize) {
    this.sequelize = sequelize;
    this.Post = postModel;
    this.User = userModel;
    this.PostImage = PostImage;
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
    return this.sequelize.transaction(async (transaction) => {
      const post = await this.Post.create(
        { title: body.title, description: body.description, userId },
        { transaction }
      );

      if (files && files.length > 0) {
        const photos = files.map((file) => ({
          postId: post.id,
          image_url: file.path,
        }));

        await this.PostImage.bulkCreate(photos, { transaction });
      }

      return post;
    });
  }
  async getPostById(currUserId, postId) {
    const post = await this.Post.findByPk(postId, {
      attributes: ["userId", "description", "title"],
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["name", "surname", "isPrivate"],
        },
        {
          model: this.PostImage,
          as: "images",
          attributes: ["image_url"],
        },
      ],
    });
    if (!post) throw new AppError("Post not found", 404);
    const plain = post.get({ plain: true });
    const postPublic = {
      description: plain.description,
      title: plain.title,
      images: plain.images.map((img) => ({ image_url: img.image_url })),
      author: {
        name: plain.author.name,
        surname: plain.author.surname,
      },
    };
    if (plain.userId === currUserId) return postPublic;
    if (plain.author.isPrivate) throw new AppError("Profile is private", 403);
    return postPublic;
  }
}
