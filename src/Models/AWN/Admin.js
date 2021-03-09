class Admin {
	constructor($b, Bot, listIdOverride = null, orgIdOverride) {
		this.SetProperties($b, Bot, listIdOverride, orgIdOverride);
	}
	SetProperties($b, Bot, listIdOverride = null, orgIdOverride = null) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.type = $b.type;
		this.value = $b.value;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
		this.listId = $b.listId || listIdOverride;
		this.orgId = $b.orgId || orgIdOverride;
	}
	/**
	 * Update the Model to latest data
	 * @returns {Admin}
	 * @memberof Admin
	 */
	async Fetch() {
		if (this.listId == null)
			this.SetProperties(
				(
					await this._Bot.Http.GET(
						`org/${this.orgId}/game-servers/admin-lists/${this.listId}/admins/${this.id}`
					)
				).Entity,
				this._Bot
			);
		return this;
	}
	/**
	 * Remove self from list (If refrenced from AdminList)
	 *
	 * Else returns error
	 * @returns {CloudResult}
	 * @memberof Admin
	 */
	async Remove() {
		if (this.id == null || this.listId == null)
			return new Error("Invalid OrgID or ListID");
		let result = await this._Bot.Http.DELETE(
			`org/${this.orgId}/game-servers/admin-lists/${this.listId}/admins/${this.id}`
		);
		if (result.IsOK) this.isDeleted = true;
		return result;
	}
}
module.exports = { Admin };
