/**
 * @constructor
 */
function CovalentActivityService(covalentHost)
{
    this.restService = new CrossDomainRestService(covalentHost);
}

CovalentActivityService.prototype._prepareLaunchParams = function(params)
{
    // Serialize activityOptions if specified and an object
    if (typeof(params.activityOptions) == "object") {
        params.activityOptions = JSON.stringify(params.activityOptions, null, null);
    }
}

CovalentActivityService.prototype.launchSecureActivity = function(callback, parameters, error)
{
    var url = "/ilrn/service/covalentActivity/secure";
    this._prepareLaunchParams(parameters);
    this.restService.requestJson(url, 'POST', parameters, callback, error);    
}

CovalentActivityService.prototype.launchActivity = function(callback, parameters, error)
{
    var url = "/ilrn/service/covalentActivity";
    this._prepareLaunchParams(parameters);
    this.restService.requestJson(url, 'POST', parameters, callback, error);
}

CovalentActivityService.prototype.launchReviewActivity = function(callback, parameters, error)
{
    var url = "/ilrn/service/covalentActivity/review";
    this._prepareLaunchParams(parameters);
    this.restService.requestJson(url, 'POST', parameters, callback, error);
}

CovalentActivityService.prototype.getActivityStatus = function(callback, uuid, error)
{
    var url = "/ilrn/service/covalentActivity/status/"+uuid;
    this.restService.requestJson(url, 'POST', null, callback, error);
}

CovalentActivityService.prototype.getActivityState = function(callback, uuid, error)
{
    var url = "/ilrn/service/covalentActivity/state/"+uuid;
    this.restService.requestJson(url, 'GET', null, callback, error);
}

CovalentActivityService.prototype.submitActivityByUuid = function(callback, uuid, error)
{
    var url = "/ilrn/service/covalentActivity/submit/"+uuid;
    this.restService.requestJson(url, 'POST', null, callback, error);
}

CovalentActivityService.prototype.closeActivity = function(callback, uuid, error)
{
    var url = "/ilrn/service/covalentActivity/close/"+uuid;
    this.restService.requestString(url, 'POST', null, callback, error);
}

CovalentActivityService.prototype.doneWithStep = function(callback, activityLocator, stepUid, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator + "/step/" + stepUid + "/done";
    this.restService.requestJson(url, 'POST', null, callback, error);
}

CovalentActivityService.prototype.getItemWidgetParams = function(callback, activityLocator, itemUid, options, mode, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator + "/item/" + itemUid;
    
    var params = {
        options: JSON.stringify(options),
        mode: mode
    };
    
    this.restService.requestJson(url, 'GET', params, callback, error);
}

CovalentActivityService.prototype.gotoStep = function(callback, activityLocator, stepUid, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator + "/step/" + stepUid + "/goto";
    this.restService.requestJson(url, 'POST', null, callback, error);
}

CovalentActivityService.prototype.loadActivity = function(callback, activityLocator, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator;
    this.restService.requestJson(url, 'GET', null, callback, error);
}

CovalentActivityService.prototype.nextStep = function(callback, activityLocator, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator + "/step/next";
    this.restService.requestJson(url, 'POST', null, callback, error);
}

CovalentActivityService.prototype.submitItemResult = function(callback, activityLocator, encryptedScoreAndState, itemUid, itemAttempted, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator + "/item/" + itemUid;
    
    var params = {
        encryptedScoreAndState: encryptedScoreAndState,
        itemAttempted: itemAttempted
    };
    
    this.restService.requestJson(url, 'POST', params, callback, error);
}

CovalentActivityService.prototype.updateActivityState = function(callback, activityLocator, updatedInfo, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator + "/state";

    var params = {
    	updatedInfo: JSON.stringify(updatedInfo)
    };

   this.restService.requestJson(url, 'POST', params, callback, error);
}   

CovalentActivityService.prototype.submitActivity = function(callback, activityLocator, error)
{
    var url = "/ilrn/service/covalentActivity/" + activityLocator;
    this.restService.requestString(url, 'POST', null, callback, error);
};
