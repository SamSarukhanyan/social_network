export class CommentController {
  constructor(service) {
    this.service = service;
  }
  async addComment(req, res) {
    const currUserId = req.user.id;
    const postId = +req.params.id;
    const comment = await this.service.addComment(currUserId, postId, req.body);
    res.status(201).json({ ok: true, data: comment });
  }
}
