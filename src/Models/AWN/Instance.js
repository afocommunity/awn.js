const { List } = require("../Util/List");
const { Game } = require("./Game");
/**
 *
 *
 * @class Instance
 */
class Instance {
	constructor($b, Bot) {
		Object.defineProperty(this, "_Bot", { value: Bot, enumerable: false });
		this.id = $b.id;
		this.label = $b.label;
		this.maxSlots = $b.maxSlots;
		this.ipAddress = $b.ipAddress;
		this.gamePort = $b.gamePort;
		this.queryPort = $b.queryPort;
		this.rconPort = $b.rconPort;
		this.ftpPort = $b.ftpPort;
		this.rconUsername = $b.rconUsername;
		this.rconPassword = $b.rconPassword;
		this.ftpUsername = $b.ftpUsername;
		this.ftpPassword = $b.ftpPassword;
		this.clusterId = $b.clusterId;
		this.orchId = $b.orchId;
		this.createdAt = new Date($b.createdAt);
		this.updatedAt = new Date($b.updatedAt);
		this.orgId = $b.orgId;
		this.gameId = $b.gameId;
		this.boxId = $b.boxId;
		this.tagLine = $b.tagLine;
		this.gameState = $b.gameState; //TODO GameState
		this.adminLists = $b.adminLists; //TODO Setup Admin Lists
		this.banLists = List.ToList($b.banLists);
		this.game = new Game($b.game, this._Bot);
	}
}
module.exports = { Instance };
