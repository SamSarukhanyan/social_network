export class AccountController {
  constructor(service) {
    this.service = service;
  }

  async search(req, res) {
    const users = await this.service.searchByUserName(req.params.text);
    return res.status(200).send({ ok: true, payload: { users } });
  }
  async getById(req, res) {
    const account = await this.service.getAccountById(req.params.id);
    res.status(200).send({ ok: true, payload: account });
  }
  async getFollowers() {
    const followers = this.service.getFollowers(req.user.id);
    res.status(200).send({ ok: true, payload: { followers } });
  }
}
