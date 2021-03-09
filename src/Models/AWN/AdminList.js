const { Dictionary } = require("../Util/Dictionary");
const { Admin } = require("./Admin");
/**
 *
 *
 * @class AdminList
 */
class AdminList {
	constructor($b, Bot, orgIdOverride = null) {
		this.SetProperties($b, Bot, orgIdOverride);
	}
	/**
	 * Update self to Latest Data
	 * @returns {AdminList}
	 * @memberof AdminList
	 */
	async Fetch() {
		this.SetProperties(
			(
				await this._Bot.Http.GET(
					`org/${this.orgId}/game-servers/admin-lists/${this.id}`
				)
			).Entity,
			this._Bot
		);
		return this;
	}
	SetProperties($b, Bot, orgIdOverride = null) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.label = $b.label;
		if (typeof $b.permissions === "string") {
			try {
				this.permissions = JSON.parse($b.permissions); // TODO setup PermissionList
			} catch (error) {
				this.permissions = $b.permissions;
			}
		} else {
			this.permissions = $b.permissions;
		}
		this.isPublic = $b.isPublic;
		this.password = $b.password;
		this.isDeleted = $b.isDeleted;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
		this.orgId = $b.orgId || orgIdOverride;
		this.admins = new Dictionary();
		if ($b.admins != null) {
			for (let admin of $b.admins) {
				this.admins.AddOrUpdate(
					admin.id,
					new Admin(admin, this._Bot, this.id, this.orgId)
				);
			}
		}
		this.instances = $b.instances; // TODO Setup Instances
	}
	/**
	 * Remove Admin from list, Accepts internalID or steam64 string
	 * @param {string | number} AdminId
	 * @returns {{id:number} | false}
	 * @memberof AdminList
	 */
	async RemoveAdmin(AdminId) {
		if (this.admins.ContainsKey(parseInt(AdminId))) {
			let result = await this._Bot.Http.DELETE(
				`org/${this.orgId}/game-servers/admin-lists/${this.id}/admins/${AdminId}`
			);
			await this.Fetch();
			return result.Entity;
		} else {
			let key = null;
			for (let item of this.admins) {
				if (item.Value.value == AdminId) {
					key = item.Key;
				}
			}
			if (key) return await this.RemoveAdmin(key);
		}
		return false;
	}
	/**
	 * Remove Admin from list, Accepts internalID or steam64 string
	 * @param {"awn_identity"|"steam64"} type
	 * @param {string} value
	 * @returns {{id:number}}
	 * @memberof AdminList
	 */
	async AddAdmin(type, value) {
		let result = await this._Bot.Http.POST(
			`org/${this.orgId}/game-servers/admin-lists/${this.id}/admins`,
			{ type, value }
		);
		await this.Fetch();
		return result.Entity;
	}
}
module.exports = { AdminList };
