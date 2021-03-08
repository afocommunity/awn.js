const { HttpMethod } = require("./HttpMethod");
const { HttpRequestMessage } = require("./HttpRequestMessage");
const { CancellationTokenSource } = require("./CancellationTokenSource");
const { TimeSpan } = require("../Util/TimeSpan");
const { CloudResult } = require("./CloudResult");
const { ProductInfoHeaderValue } = require("./ProductInfoHeaderValue");
const { HTTP_CLIENT } = require("./HTTP_CLIENT");
/**
 * HTTP Client
 * @class Http
 */
class Http {
	constructor(Bot) {
		this.Bot = Bot;
		this.ENDPOINT = "https://api.awn.gg/v5";
		this.DefaultTimeout = TimeSpan.fromSeconds(6);
		this.UserAgent = new ProductInfoHeaderValue(
			"AWN.js",
			require("../../../package.json").version
		);
		this.DEBUG_REQUESTS = false;
		this._currentAuthenticationToken = null;
		this.HttpClient = new HTTP_CLIENT();
	}
	OnError(...err) {
		throw Error(err);
	}
	OnDebug(...info) {
		console.log(...info);
	}
	/**
	 * Make a Get Request
	 *
	 * @param {string} resource - Endpoint
	 * @param {TimeSpan} [timeout=null]
	 * @param {boolean} [throwOnError=true]
	 * @returns {Promise<CloudResult<any>>}
	 * @memberof Http
	 */
	GET(resource, timeout = null, throwOnError = true) {
		return this.RunRequest(
			() => {
				return this.CreateRequest(resource, HttpMethod.Get);
			},
			timeout,
			throwOnError
		);
	}
	/**
	 * Make a Post Request
	 *
	 * @param {string} resource - Endpoint
	 * @param {*} entity - Content
	 * @param {TimeSpan} [timeout=null]
	 * @param {boolean} [throwOnError=true]
	 * @returns {Promise<CloudResult<any>>}
	 * @memberof Http
	 */
	POST(resource, entity, timeout = null, throwOnError = true) {
		return this.RunRequest(
			() => {
				let request = this.CreateRequest(resource, HttpMethod.Post);
				if (entity != null) this.AddBody(request, entity);
				return request;
			},
			timeout,
			throwOnError
		);
	}
	/* //TODO
	POST_File(resource, filePath, FileMIME = null, progressIndicator = null) {
		return this.RunRequest(() => {
			let request = this.CreateRequest(resource, HttpMethod.Post);
			//TODO this.AddFileToRequest(request, filePath, FileMIME, progressIndicator);
			return request;
		}, TimeSpan.fromMinutes(60.0));
	}
	*/
	/**
	 * Make a Put Request
	 *
	 * @param {string} resource - Endpoint
	 * @param {*} entity - Content
	 * @param {TimeSpan} [timeout=null]
	 * @param {boolean} [throwOnError=true]
	 * @returns {Promise<CloudResult<any>>}
	 * @memberof Http
	 */
	PUT(resource, entity, timeout = null, throwOnError = true) {
		return this.RunRequest(
			() => {
				let request = this.CreateRequest(resource, HttpMethod.Put);
				this.AddBody(request, entity);
				return request;
			},
			timeout,
			throwOnError
		);
	}
	/**
	 * Make a Patch Request
	 *
	 * @param {string} resource - Endpoint
	 * @param {*} entity - Content
	 * @param {TimeSpan} [timeout=null]
	 * @param {boolean} [throwOnError=true]
	 * @returns {Promise<CloudResult<any>>}
	 * @memberof Http
	 */
	PATCH(resource, entity, timeout = null, throwOnError = true) {
		return this.RunRequest(
			() => {
				let request = this.CreateRequest(resource, HttpMethod.Patch);
				this.AddBody(request, entity);
				return request;
			},
			timeout,
			throwOnError
		);
	}
	/**
	 * Make a Delete Request
	 *
	 * @param {string} resource - Endpoint
	 * @param {TimeSpan} [timeout=null]
	 * @param {boolean} [throwOnError=true]
	 * @returns {Promise<CloudResult<any>>}
	 * @memberof Http
	 */
	DELETE(resource, timeout = null, throwOnError = true) {
		return this.RunRequest(
			() => {
				return this.CreateRequest(resource, HttpMethod.Delete);
			},
			timeout,
			throwOnError
		);
	}
	/**
	 * Build a Http Request
	 *
	 * @param {string} resource - Endpoint
	 * @param {HttpMethod} method
	 * @instance
	 * @returns {HttpRequestMessage}
	 * @memberof Http
	 */
	CreateRequest(resource, method) {
		var flag = false;
		if (!resource.startsWith("http")) {
			flag = true;
			resource = this.ENDPOINT + "/" + resource;
		}
		var httpRequestMessage = new HttpRequestMessage(method, resource);
		if ((this._currentAuthenticationToken != null) & flag) {
			httpRequestMessage.Headers[
				"X-AWN-ACCESS-TOKEN"
			] = this._currentAuthenticationToken;
		}
		httpRequestMessage.Headers.UserAgent = this.UserAgent.Value();
		return httpRequestMessage;
	}
	/**
	 * Add a body to a request
	 *
	 * Internal
	 * @param {HttpRequestMessage} message
	 * @instance
	 * @param {*} entity - Content
	 * @memberof Http
	 */
	AddBody(message, entity) {
		message.Headers["Content-Type"] = "application/json";
		if (entity) message.Content = JSON.stringify(entity);
	}

	/**
	 * Run a {@link #httprequestmessage HttpRequest}
	 * @see Http#CreateRequest
	 * @param {HttpRequestMessage} requestSource
	 * @param {TimeSpan} timeout
	 * @param {boolean} [throwOnError=false]
	 * @returns {Promise<CloudResult<any>>}
	 * @memberof Http
	 * @instance
	 */
	async RunRequest(requestSource, timeout, throwOnError = false) {
		let request = null;
		let result = null;
		let exception = null;
		let content;
		let result1;
		try {
			let remainingRetries = this.DEFAULT_RETRIES; //lgtm [js/useless-assignment-to-local] False Positive
			let delay = 250;
			do {
				try {
					request = await requestSource();
					let cancellationTokenSource = new CancellationTokenSource(
						timeout || this.DefaultTimeout
					);
					if (this.DEBUG_REQUESTS)
						this.OnDebug(request.Method, request.RequestUri);
					result = await this.HttpClient.SendAsync(
						request,
						cancellationTokenSource.Token
					);
					if (this.DEBUG_REQUESTS)
						this.OnDebug(request.Method, request.RequestUri, result.StatusCode);
				} catch (error2) {
					exception = error2;
				}
				// Handle Error Response, Will Retry after <delay>
				if (
					result == null ||
					result.StatusCode === 429 ||
					result.StatusCode === 500
				) {
					if (result == null) {
						this.OnDebug(
							`Exception running ${request.Method} request to ${request.RequestUri}. Remaining retries: ${remainingRetries}`
						);
						await TimeSpan.Delay(new TimeSpan(delay)); // Wait and then retry
						delay *= 2; // Double Retry Time
					}
				}
			} while (result == null && remainingRetries-- > 0);
			if (result == null) {
				if (!throwOnError) {
					result1 = new CloudResult(null, 0, null, null);
				} else {
					if (exception == null)
						this.OnError("Failed to get response. Exception is null");
					this.OnError(exception);
				}
			} else {
				if (result.IsSuccessStatusCode) {
					if (typeof result.Content === "string") {
						content = result.Content;
					} else {
						content = result.Content;
						if (this.DEBUG_REQUESTS)
							this.OnDebug(
								`ENTITY for ${request.Method} - ${request.RequestUri}`
							);
					}
					result1 = new CloudResult(null, result.StatusCode, content);
				} else {
					// Bad Status Code
					result1 = new CloudResult(null, result.StatusCode, result.Content);
				}
			}
		} catch (ex) {
			this.OnError(ex, true); // This is a Hard Error, Request has Failed Spectacularly for some reason and will return No value, Likely braking what called it, Suggest Throw
		}
		return result1;
	}
}
module.exports = { Http };
