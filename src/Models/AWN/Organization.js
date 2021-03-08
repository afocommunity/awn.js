const { User } = require("./User");
const { Role } = require("./Role");
const { DedicatedBox } = require("./DedicatedBox");
const { Dictionary } = require("../Util/Dictionary");
/**
 *
 * @class Organization
 */
class Organization {
	constructor($b, Bot) {
		this.SetProperties($b, Bot);
	}
	/**
	 * @private
	 * @param {*} $b
	 * @param {*} Bot
	 * @returns {Organization}
	 * @memberof Organization
	 */
	SetProperties($b, Bot) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.name = $b.name;
		this.type = $b.type;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
		this.ownerId = $b.ownerId;
		this.owner = new User($b.owner, this._Bot);
		this.role = new Role($b.role, this._Bot);
		this.permissions = $b.permissions;
		return this;
	}
	/**
	 * Update Self
	 * @returns {Organization}
	 * @memberof Organization
	 */
	async Fetch() {
		let result = await this._Bot.Http.GET(`org/${this.id}`);
		return this.SetProperties(result.Entity);
	}
	/**
	 * Get Users
	 * @returns {Dictionary<Users>}
	 * @memberof Organization
	 */
	async FetchUsers() {
		if (this._users) return this._users;
		let users = new Dictionary();
		let result = await this._Bot.Http.GET(`org/${this.id}/users`);
		for (let user of result.Entity) {
			users.Add(user.id, new User(user, this._Bot));
		}
		this._users = users;
		return users;
	}
	/**
	 * Get Server Boxes
	 * @returns {Dictionary<DedicatedBox>}
	 * @memberof Organization
	 */
	async FetchBoxes() {
		if (this._boxes) return this._boxes;
		let boxes = new Dictionary();
		let result = await this._Bot.Http.GET(
			`org/${this.id}/dedicated-boxes/boxes`
		);
		for (let box of result.Entity) {
			boxes.Add(box.id, new DedicatedBox(box, this._bot));
		}
		this._boxes = boxes;
		return boxes;
	}
}
module.exports = { Organization };
