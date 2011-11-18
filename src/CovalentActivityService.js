/**
 * @constructor
 */
function CovalentActivityService(covalentHost, useSecureProtocol)
{
    if (! covalentHost) {
        // The filename string "@cam.script.filename@" is dynamically replaced during the build process
        // to reflect the cam generated filename needed when resolving the Covalent Host. 
        covalentHost = CovalentUtils.resolveCovalentHost("@cam.script.filename@");
        
        if (! covalentHost) {
            throw new Error("Unable to resolve covalent host.");
        }
    }
    
    this.restService = new CovalentXDClient(covalentHost, "/ilrn/service/covalentActivity");
};

CovalentActivityService.prototype._prepareLaunchParams = function(params)
{
    // Serialize activityOptions if specified and an object
    if (typeof(params.activityOptions) == "object") {
        params.activityOptions = JSON.stringify(params.activityOptions, null, null);
    }
};

CovalentActivityService.prototype.launchSecureActivity = function(onSuccess, parameters, onFailure)
{
    this._prepareLaunchParams(parameters);
    this.restService.postRequestJSON("/secure", parameters, onSuccess, onFailure);    
};

CovalentActivityService.prototype.launchActivity = function(onSuccess, parameters, onFailure)
{
    this._prepareLaunchParams(parameters);
    this.restService.postRequestJSON("", parameters, onSuccess, onFailure);
};

CovalentActivityService.prototype.launchReviewActivity = function(onSuccess, parameters, onFailure)
{
    this._prepareLaunchParams(parameters);
    this.restService.postRequestJSON("/review", parameters, onSuccess, onFailure);
};

CovalentActivityService.prototype.getActivityStatus = function(onSuccess, uuid, onFailure)
{
    this.restService.postRequestJSON("/status/"+uuid, null, onSuccess, onFailure);
};

CovalentActivityService.prototype.getActivityState = function(onSuccess, uuid, onFailure)
{
    this.restService.getJSON("/state/"+uuid, null, onSuccess, onFailure);
};

CovalentActivityService.prototype.submitActivityByUuid = function(onSuccess, uuid, onFailure)
{
    this.restService.postRequestJSON("/submit/"+uuid, null, onSuccess, onFailure);
};

CovalentActivityService.prototype.closeActivity = function(onSuccess, uuid, onFailure)
{
    this.restService.postRequestString("/close/"+uuid, null, onSuccess, onFailure);
};

CovalentActivityService.prototype.doneWithStep = function(onSuccess, activityLocator, stepUid, onFailure)
{
    this.restService.postRequestJSON("/"+activityLocator+"/step/"+stepUid+"/done", null, onSuccess, onFailure);
};

CovalentActivityService.prototype.getItemWidgetParams = function(onSuccess, activityLocator, itemUid, options, mode, onFailure)
{
    var params = {
        options: JSON.stringify(options),
        mode: mode
    };
    this.restService.getJSON("/"+activityLocator+"/item/"+itemUid, params, onSuccess, onFailure);
};

CovalentActivityService.prototype.gotoStep = function(onSuccess, activityLocator, stepUid, onFailure)
{
    this.restService.postRequestJSON("/"+activityLocator+"/step/"+stepUid+"/goto", null, onSuccess, onFailure);
};

CovalentActivityService.prototype.loadActivity = function(onSuccess, activityLocator, onFailure)
{
    this.restService.getJSON("/"+activityLocator, null, onSuccess, onFailure);
};

CovalentActivityService.prototype.nextStep = function(onSuccess, activityLocator, onFailure)
{
    this.restService.postRequestJSON("/"+activityLocator+"/step/next", null, onSuccess, onFailure);
};

CovalentActivityService.prototype.submitItemResult = function(onSuccess, activityLocator, encryptedScoreAndState, itemUid, itemAttempted, onFailure)
{
    
   var params = {
        encryptedScoreAndState: encryptedScoreAndState,
        itemAttempted: itemAttempted
    };
    this.restService.postRequestJSON("/"+activityLocator+"/item/"+itemUid+"/result", params, onSuccess, onFailure);
};

CovalentActivityService.prototype.updateActivityState = function(onSuccess, activityLocator, updatedInfo, onFailure)
{
    var params = {
    	updatedInfo: JSON.stringify(updatedInfo)
    };
    this.restService.postRequestJSON("/"+activityLocator+"/state", params, onSuccess, onFailure);
};

CovalentActivityService.prototype.submitActivity = function(onSuccess, activityLocator, onFailure)
{
    this.restService.postRequestString("/"+activityLocator, null, onSuccess, onFailure);
};

CovalentActivityService.prototype.getProperties = function(onSuccess, parameters, onFailure)
{
    this._prepareLaunchParams(parameters);
    this.restService.postRequestJSON("/properties", parameters, onSuccess, onFailure);    
};
