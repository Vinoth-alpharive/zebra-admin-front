
const httpStatus = require("http-status");
module.exports = {

	getExistsResult: function (result, res) {
		res.status(httpStatus.OK).json({ "status": false, msg: result });
	},
	getSuccessResult: function (result, res) {
		let jsonMsg = (result && result.msg) ? { "status": true, data: result, msg: result.msg } : { "status": true, data: result};
		res.status(httpStatus.OK).json(jsonMsg);
	},
	getMessageResult: function (response, msg, res) {
		if(response?.length===1){
       const data = Object.assign({}, ...response);
	   res.status(httpStatus.OK).json({ "status": true, data: data, msg: msg });
		}
		else{
			res.status(httpStatus.OK).json({ "status": true, data: response, msg: msg });
		}
	
	},
	getNotExistsResult: function (response, res) {
		res.status(httpStatus.OK).json({ "status": false, data:"" ,msg: response});
	},
	getBadRequestResult: function (result, msg) {
		res.status(httpStatus.BAD_REQUEST).json({ "status": false, data:"" ,msg:result });
	},
	getErrorResult: function (errResp, res) {
		res.status(httpStatus.BAD_REQUEST).json({ "status": false,data:"" ,msg: errResp.message ? errResp.message :  errResp});
	},
	getMessageResultPagination: function (response, msg, res) {
		res.status(httpStatus.OK).json({ "status": true, data: response.rows, count:response.count, pages:response.pages, msg: msg ,basePath: response.basePath});
	},
	serverError: function (errResp, res) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ "status": false, msg: "Internal server error"});
	}
}
