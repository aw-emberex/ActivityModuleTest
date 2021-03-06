(function(){

    var COVALENT_ACTIVITY_SERVICE_PATH = "/ilrn/service/covalentActivity";
    
    /**
     * @constructor
     */
    function CovalentActivityService(covalentHost, useSecureProtocol, serviceBasePath, covalentHostTimeout)
    {
        if (! covalentHost) {
            // The filename string "@cam.script.filename@" is dynamically replaced during the build process
            // to reflect the cam generated filename needed when resolving the Covalent Host. 
            covalentHost = CovalentUtils.resolveCovalentHost("@cam.script.filename@");
            
            if (! covalentHost) {
                throw new Error("Unable to resolve covalent host.");
            }
        }
        
        if( typeof(serviceBasePath) == 'undefined' || serviceBasePath == null)
            serviceBasePath = COVALENT_ACTIVITY_SERVICE_PATH;
        
        this.restService = new CovalentXDClient(covalentHost, serviceBasePath, useSecureProtocol, covalentHostTimeout);
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
            return this.restService.postRequestJSON("/secure", parameters, onSuccess, onFailure);    
        },
        
        launchActivity: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            return this.restService.postRequestJSON("", parameters, onSuccess, onFailure);
        },
        
        launchReviewActivity: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            return this.restService.postRequestJSON("/review", parameters, onSuccess, onFailure);
        },
        
        getActivityStatus: function(onSuccess, uuid, onFailure)
        {
            return this.restService.postRequestJSON("/status/" + uuid, null, onSuccess, onFailure);
        },
        
        getActivityState: function(onSuccess, uuid, onFailure)
        {
            return this.restService.getJSON("/state/"+uuid, null, onSuccess, onFailure);
        },
        
        submitActivityByUuid: function(onSuccess, uuid, onFailure)
        {
            return this.restService.postRequestJSON("/submit/"+uuid, null, onSuccess, onFailure);
        },
        
        getItemWidgetParams: function(onSuccess, activityLocator, itemUid, options, mode, onFailure)
        {
            var params = {
                options: JSON.stringify(options),
                mode: mode
            };
            return this.restService.getJSON("/"+activityLocator+"/item/"+itemUid, params, onSuccess, onFailure);
        },
        
        gotoStep: function(onSuccess, activityLocator, stepUid, onFailure)
        {
            return this.restService.postRequestJSON("/"+activityLocator+"/step/"+stepUid+"/goto", null, onSuccess, onFailure);
        },
        
        loadActivity: function(onSuccess, activityLocator, onFailure)
        {
            return this.restService.getJSON("/"+activityLocator, null, onSuccess, onFailure);
        },
        
        nextStep: function(onSuccess, activityLocator, onFailure)
        {
            return this.restService.postRequestJSON("/"+activityLocator+"/step/next", null, onSuccess, onFailure);
        },
        
        submitItemResult: function(onSuccess, activityLocator, encryptedScoreAndState, itemUid, itemAttempted, onFailure)
        {
           var params = {
                encryptedScoreAndState: encryptedScoreAndState,
                itemAttempted: itemAttempted
            };
            return this.restService.postRequestJSON("/"+activityLocator+"/item/"+itemUid+"/result", params, onSuccess, onFailure);
        },
        
        updateActivityState: function(onSuccess, activityLocator, updatedInfo, onFailure)
        {
            var params = {
                updatedInfo: JSON.stringify(updatedInfo)
            };
            return this.restService.postRequestJSON("/"+activityLocator+"/state", params, onSuccess, onFailure);
        },
        
        submitActivity: function(onSuccess, activityLocator, onFailure)
        {
            return this.restService.postRequestString("/"+activityLocator, null, onSuccess, onFailure);
        },
        
        getProperties: function(onSuccess, parameters, onFailure)
        {
            this._prepareLaunchParams(parameters);
            return this.restService.postRequestJSON("/properties", parameters, onSuccess, onFailure);    
        }
    });
    
    window.CovalentActivityService = CovalentActivityService;
})();