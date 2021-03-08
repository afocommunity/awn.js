const Fetch = require("node-fetch")
const { Http } = require("./Models/HTTP_CLIENT")
const {EventEmitter} = require("events")
const { TimeSpan } = require("./Models/Util/TimeSpan")
class AWN {
  constructor(options) {
    this.Events = new EventEmitter()
    this.Http = new Http()
  }
  async Login(username, password) {
    let result = await this.Http.POST("auth/login", {username, password}, new TimeSpan(5000), true)
    if (result.IsOK && result.Entity.valid){
      this.Http._currentAuthenticationToken = result.Entity.accessToken
      this.Events.emit("login", result.Entity);
    } else {
      this.Error(result.Entity.error)
    }
  }
  Error(...error){
    this.Events.emit("error", error);
  }
}
module.exports = {AWN}