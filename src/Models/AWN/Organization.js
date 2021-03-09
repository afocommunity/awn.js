const { User } = require("./User");
const { Role } = require("./Role");
const { DedicatedBox } = require("./DedicatedBox");
const { Dictionary } = require("../Util/Dictionary");
const { Instance } = require("./Instance");
const { AdminList } = require("./AdminList");
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
		return this.SetProperties(result.Entity, this._Bot);
	}
	/**
	 * Get Users
	 * @returns {Dictionary<number, Users>}
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
	 * @returns {Dictionary<number, DedicatedBox>}
	 * @memberof Organization
	 */
	async FetchBoxes() {
		if (this._boxes) return this._boxes;
		let boxes = new Dictionary();
		let result = await this._Bot.Http.GET(
			`org/${this.id}/dedicated-boxes/boxes`
		);
		for (let box of result.Entity) {
			boxes.Add(box.id, new DedicatedBox(box, this._Bot));
		}
		this._boxes = boxes;
		return boxes;
	}
	/**
	 * Get Instances
	 *
	 * @returns {Dictionary<number, Instance>}
	 * @memberof Organization
	 */
	async FetchInstances() {
		if (this._instances) return this._instances;
		let instances = new Dictionary();
		let result = await this._Bot.Http.GET(
			`org/${this.id}/game-servers/instances`
		);
		for (let instance of result.Entity) {
			instances.Add(instance.id, new Instance(instance, this._Bot));
		}
		this._instances = instances;
		return instances;
	}
	/**
	 * Get Admin Lists
	 *
	 * @returns {Dictionary<number, AdminList>}
	 * @memberof Organization
	 */
	async FetchAdminLists() {
		if (this._adminLists) return this._adminLists;
		let adminLists = new Dictionary();
		let result = await this._Bot.Http.GET(
			`org/${this.id}/game-servers/admin-lists`
		);
		for (let list of result.Entity) {
			adminLists.AddOrUpdate(list.id, new AdminList(list, this._Bot, this.id));
		}
		this._adminLists = adminLists;
		return adminLists;
	}
}
module.exports = { Organization };
