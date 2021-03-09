/**
 *
 *
 * @class Role
 */
class Role {
	constructor($b, Bot) {
		this.SetProperties($b, Bot);
	}
	/**
	 * Get Latest Data
	 *
	 * @returns {Role}
	 * @memberof Role
	 */
	async Fetch() {
		this.SetProperties(
			(await this._Bot.Http.GET(`org/${this.orgId}/roles/${this.id}`)).Entity,
			this._Bot
		);
		return this;
	}
	SetProperties($b, Bot) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.name = $b.name;
		this.priority = $b.priority;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
		this.orgId = $b.orgId;
	}
}
module.exports = { Role };
