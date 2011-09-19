/**
 * @constructor
 */
function CovalentItemService(covalentHost)
{
    this.restService = new CrossDomainRestService(covalentHost);
}

CovalentItemService.prototype.getItemScript = function(callback, params){
    
    var url = "/ilrn/service/covalentItem";
    var method = "POST";

    this.restService.requestJson(url, method, params, callback);
}

CovalentItemService.prototype.secureGetItemScript = function(callback, params){

    var url = "/ilrn/service/covalentItem/secure";
    var method = "POST";
    
    this.restService.requestJson(url, method, params, callback);
};
