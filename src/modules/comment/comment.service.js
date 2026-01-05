import { AppError } from "@utils/appError.js";

export class CommentService {
  constructor(Comment, Post, sequelize) {
    this.Comment = Comment;
    this.Post = Post;
    this.sequelize = sequelize;
  }
  async addComment(currUserId, postId, body) {
    return this.sequelize.transaction(async (transaction) => {
      const post = await this.Post.findByPk(postId);
      if (!post) throw new AppError("Post not found", 404);

      const comment = await this.Comment.create(
        {
          userId: currUserId,
          postId: postId,
          text: body.comment,
        },
        { transaction }
      );
      return comment.get({ plain: true });
    });
  }
}
