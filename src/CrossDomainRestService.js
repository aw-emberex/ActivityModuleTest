/**
 * @constructor
 */
function CrossDomainRestService(covalentHost) 
{   
    this.covalentHost = (covalentHost || CovalentUtils.resolveCovalentHost()).replace(/^https?:\/\//, '');    
}

CrossDomainRestService.easyXDM = easyXDM.noConflict('CrossDomainRestService');

CrossDomainRestService.prototype.requestJson = function(url, method, params, callback, errorFn)
{
    var wrappedCallback = function(result){
        callback(JSON.parse(result, null));        
    }
    
    this.requestString(url, method, params, wrappedCallback, errorFn);
}

CrossDomainRestService.prototype.requestString = function(url, method, params, callback, errorFn)
{
    for (var property in params)
    {
        // Don't allow function-valued parameters
        // jQuery.ajax() will call jQuery.params() which will call the function
        // while EasyXDM will ignore the parameter
        if (typeof(params[property]) == 'function') {
            throw new Error("Invalid value of "+property+" parameter: function values are not supported by this framework.");
        }

        // Convert all boolean type properties in params to type string. 
        // jQuery.ajax() internally uses encodeURIComponent(). In IE, that 
        // built-in function returns an empty string for boolean values.
        if (typeof(params[property]) == 'boolean') 
        {
            params[property] = (params[property] ? 'true' : 'false');
        }
    }
    
    var windowHost = window.location.host;
    //if covalent host matches the current page, easyXDM will not work, so we can use straight ajax
    if (windowHost == this.covalentHost) {
        jQuery.ajax({
            url: url, 
            type: method, 
            data: params,
            dataType: 'text',
            success: callback,
            error: function(xhr, status, error) { // failure
                if (typeof(errorFn) == 'function') {
                    errorFn(error, status);
                } 
            }
        });
    }
    else
    {
        var remoteURL = 'http://' + this.covalentHost + "/media/jsframeworks/easyxdm/cors/index.html";
        new CrossDomainRestService.easyXDM.Rpc(
            {remote: remoteURL},
            {remote: {request: {}}}
        ).request(
            {
                url: url, 
                method: method, 
                data: params, 
                timeout: 60 * 1000
            },
            function(result) { // success
                if (typeof(callback) == "function") {
                    callback(result.data);
                }
            },
            function(error) { // failure
                if (typeof(errorFn) == 'function') {
                    errorFn(error.data, error.status);
                }
            }
        );
    }
};
