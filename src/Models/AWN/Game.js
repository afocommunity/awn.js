/**
 *
 * @class Game
 */
class Game {
	constructor($b, Bot) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.publisherId = $b.publisherId;
		this.publisherName = $b.publisherName;
		this.name = $b.name;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
	}
}
module.exports = { Game };
