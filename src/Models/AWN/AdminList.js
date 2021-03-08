/**
 *
 *
 * @class AdminList
 */
class AdminList {
	constructor($b, Bot, orgIdOverride = null) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.label = $b.label;
		this.permissions = $b.permissions; // TODO setup PermissionList
		this.isPublic = $b.isPublic;
		this.password = $b.password;
		this.isDeleted = $b.isDeleted;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
		this.orgId = $b.orgId || orgIdOverride;
		this.admins = $b.admins; //TODO Setup List
		this.instances = $b.instances; // TODO Setup Instances
	}
}
module.exports = { AdminList };
