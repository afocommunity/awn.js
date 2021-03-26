const { Dictionary } = require("@bombitmanbomb/utils");
const { Instance } = require("./Instance");
/**
 *
 *
 * @class DedicatedBox
 */
class DedicatedBox {
	constructor($b, Bot) {
		this.SetProperties($b, Bot);
	}
	/**
	 * @private
	 * @param {*} $b
	 * @param {*} Bot
	 * @memberof DedicatedBox
	 */
	SetProperties($b, Bot) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.label = $b.label;
		this.location = $b.location;
		this.cpu = $b.cpu;
		this.spec = $b.spec;
		this.ipv4 = $b.ipv4;
		this.ipAddress = $b.ipAddress;
		this.domain = $b.domain;
		this.os = $b.os;
		this.isActive = $b.isActive;
		this.orchId = $b.orchId;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedt);
		this.orgId = $b.orchId;
		this.numberOfInstances = $b.numberOfInstances;
	}
	/**
	 * Get the instances
	 * @returns {Dictionary<Instance>}
	 * @memberof DedicatedBox
	 */
	async FetchInstances() {
		if (this._instances) return this._instances;
		let instances = new Dictionary();
		let result = await this._Bot.Http.GET(
			`org/${this.orgId}/dedicated-boxes/boxes/${this.id}/instances`
		);
		for (let instance of result.Entity) {
			instances.Add(instance.id, new Instance(instance, this._bot));
		}
		this._instances = instances;
		return instances;
	}
}
module.exports = { DedicatedBox };
