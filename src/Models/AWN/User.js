/**
 *
 *
 * @class User
 */
class User {
	constructor($b, Bot) {
		this.SetProperties($b, Bot);
	}
	SetProperties($b, Bot) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.name = $b.name;
		this.email = $b.email;
		this.identity = $b.identity;
		this.steam64 = $b.steam64;
		this.discordId = $b.discordId;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
	}
}
module.exports = { User };
