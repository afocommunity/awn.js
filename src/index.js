/**
 * Awn.js
 * @fileoverview Library to interact with api.awn.gg
 * @author {@link https://www.github.com/bombitmanbomb bombitmanbomb}
 * @author {@link https://www.github.com/werewolfboy13 werewolfboy13}
 * @license MIT
 * @see AWN
 */

const { Http } = require("./Models/HTTP_CLIENT");
const { EventEmitter } = require("events");
const { TimeSpan } = require("./Models/Util/TimeSpan");
const { Organization } = require("./Models/AWN/Organization");
const { User } = require("./Models/AWN/User");
/**
 * @module
 * @class AWN
 */
class AWN {
	constructor() {
		this.Events = new EventEmitter();
		this.Http = new Http();
	}
	//TODO IMPLIMENT Object Cache!!!!!
	/**
	 * Login to awn. if no Username or Password is passed, AWN.js will use AWN_USERNAME & AWN_PASSWORD environment variables
	 * @param {string} [username]
	 * @param {string} [password]
	 * @memberof AWN
	 */
	async Login(username, password) {
		if (username == null && password == null) {
			try {
				if (
					process.env.AWN_USERNAME == null ||
					process.env.AWN_PASSWORD == null
				) {
					require("dotenv").config();
				}
				username = process.env.AWN_USERNAME;
				password = process.env.AWN_PASSWORD;
				if (username == null && password == null)
					throw Error(
						"AWN_USERNAME or AWN_PASSWORD not defined in environment variables"
					);
			} catch (error) {
				throw new Error(
					"call Login with Username & Password or install dotenv and define AWN_USERNAME & AWN_PASSWORD"
				);
			}
		}
		let result = await this.Http.POST(
			"auth/login",
			{ username, password },
			new TimeSpan(5000),
			true
		);
		if (result.IsOK && result.Entity.valid) {
			this.CurrentUser = result.Entity;
			this.Http._currentAuthenticationToken = this.CurrentUser.accessToken;
			this.Events.emit("login", this.CurrentUser);
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
