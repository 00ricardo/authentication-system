const checkParams = (params, data) => {
    /*
    Check request parameters
    expected - list with keys of expected parameters
    realparams - dict with parameters
    */

    var [_status, http] = [undefined, undefined]
    for (var p in params) {
        if (!(params[p] in data)) {
            _status = {
                "code": 'E400',
                "message":
                    `Missing mandatory key in request.data ${params[p]} is not in request.`
            }

            http = 400

            if (_status != undefined) {
                break;
            }
        }
    }
    return [_status, http]
}

export default checkParams