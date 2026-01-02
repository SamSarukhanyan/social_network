//post.controller.js
export class PostController {
  constructor(service) {
    this.service = service;
  }

  async getPosts(req, res) {
    const posts = await this.service.getPosts(req.user.id);
    console.log(posts);

    return res.status(200).json({
      ok: true,
      data: posts,
    });
  }
  async createPost(req, res) {
    try {
      const post = await this.service.createPost(
        req.user.id,
        req.body,
        req.files
      );
      return res.status(201).json({ ok: true, data: post });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, message: err.message });
    }
  }
  async getPostById(req, res) {
    const post = await this.service.getPostById(req.user.id, req.params.id);
    res.status(200).json({ ok: true, data: post });
  }
}
