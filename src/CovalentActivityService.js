(function(){

    var COVALENT_ACTIVITY_SERVICE_PATH = "/ilrn/service/covalentActivity";
    
    /**
     * @constructor
     */
    function CovalentActivityService(covalentHost, useSecureProtocol)
    {
        this.restService = new CovalentXDClient(covalentHost, COVALENT_ACTIVITY_SERVICE_PATH);
    };
    
    jQuery.extend(CovalentActivityService.prototype, {
    
        _prepareLaunchParams: function(params)
        {
            // Serialize activityOptions if specified and an object
            if (typeof(params.activityOptions) == "object") {
                params.activityOptions = JSON.stringify(params.activityOptions, null, null);
            }
        },
        
        launchSecureActivity: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            this.restService.postRequestJSON("/secure", parameters, onSuccess, onFailure);    
        },
        
        launchActivity: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            this.restService.postRequestJSON("", parameters, onSuccess, onFailure);
        },
        
        launchReviewActivity: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            this.restService.postRequestJSON("/review", parameters, onSuccess, onFailure);
        },
        
        getActivityStatus: function(onSuccess, uuid, onFailure)
        {
            this.restService.postRequestJSON("/status/" + uuid, null, onSuccess, onFailure);
        },
        
        getActivityState: function(onSuccess, uuid, onFailure)
        {
            this.restService.getJSON("/state/"+uuid, null, onSuccess, onFailure);
        },
        
        submitActivityByUuid: function(onSuccess, uuid, onFailure)
        {
            this.restService.postRequestJSON("/submit/"+uuid, null, onSuccess, onFailure);
        },
        
        closeActivity: function(onSuccess, uuid, onFailure)
        {
            this.restService.postRequestString("/close/"+uuid, null, onSuccess, onFailure);
        },
        
        getItemWidgetParams: function(onSuccess, activityLocator, itemUid, options, mode, onFailure)
        {
            var params = {
                options: JSON.stringify(options),
                mode: mode
            };
            this.restService.getJSON("/"+activityLocator+"/item/"+itemUid, params, onSuccess, onFailure);
        },
        
        gotoStep: function(onSuccess, activityLocator, stepUid, onFailure)
        {
            this.restService.postRequestJSON("/"+activityLocator+"/step/"+stepUid+"/goto", null, onSuccess, onFailure);
        },
        
        loadActivity: function(onSuccess, activityLocator, onFailure)
        {
            this.restService.getJSON("/"+activityLocator, null, onSuccess, onFailure);
        },
        
        nextStep: function(onSuccess, activityLocator, onFailure)
        {
            this.restService.postRequestJSON("/"+activityLocator+"/step/next", null, onSuccess, onFailure);
        },
        
        submitItemResult: function(onSuccess, activityLocator, encryptedScoreAndState, itemUid, itemAttempted, onFailure)
        {
            
           var params = {
                encryptedScoreAndState: encryptedScoreAndState,
                itemAttempted: itemAttempted
            };
            this.restService.postRequestJSON("/"+activityLocator+"/item/"+itemUid+"/result", params, onSuccess, onFailure);
        },
        
        updateActivityState: function(onSuccess, activityLocator, updatedInfo, onFailure)
        {
            var params = {
                updatedInfo: JSON.stringify(updatedInfo)
            };
            this.restService.postRequestJSON("/"+activityLocator+"/state", params, onSuccess, onFailure);
        },
        
        submitActivity: function(onSuccess, activityLocator, onFailure)
        {
            this.restService.postRequestString("/"+activityLocator, null, onSuccess, onFailure);
        },
        
        getProperties: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            this.restService.postRequestJSON("/properties", parameters, onSuccess, onFailure);    
        }
        
    });
    
    window.CovalentActivityService = CovalentActivityService;
    
})();
