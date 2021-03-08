const { Http } = require("./Models/HTTP_CLIENT");
const { EventEmitter } = require("events");
const { TimeSpan } = require("./Models/Util/TimeSpan");
const { Organization } = require("./Models/AWN/Organization");
const { User } = require("./Models/AWN/User");
/**
 *
 * @class AWN
 */
class AWN {
	constructor() {
		this.Events = new EventEmitter();
		this.Http = new Http();
	}
	/**
	 * Login
	 * @param {string} username
	 * @param {string} password
	 * @memberof AWN
	 */
	async Login(username, password) {
		let result = await this.Http.POST(
			"auth/login",
			{ username, password },
			new TimeSpan(5000),
			true
		);
		if (result.IsOK && result.Entity.valid) {
			this.Http._currentAuthenticationToken = result.Entity.accessToken;
			this.Events.emit("login", result.Entity);
		} else {
			this.Error(result.Entity.error);
		}
	}
	/**
	 *
	 * @param {*} error
	 * @memberof AWN
	 */
	Error(...error) {
		this.Events.emit("error", error);
	}
	/**
	 *
	 *
	 * @param {string | number} userId
	 * @returns {User}
	 * @memberof AWN
	 */
	async FetchUser(userId) {
		return new User(await this.Http.GET(`users/${userId}`).Entity, this);
	}
	/**
	 *
	 *
	 * @param {string | number} orgId
	 * @returns {Organization}
	 * @memberof AWN
	 */
	async FetchOrg(orgId) {
		return new Organization((await this.Http.GET(`org/${orgId}`)).Entity, this);
	}
}
module.exports = { AWN };
