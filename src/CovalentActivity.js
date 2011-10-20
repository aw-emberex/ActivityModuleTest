(function(){

    function CovalentActivity(settings){
    
        this.stateChangeListeners = [];
        this.finishedListeners = [];
    
        this.activityHandle = null;

        this.settings = settings;
        
        // Clone the settings object for launch params since call to launch may modify the params object
        var launchParams = jQuery.extend({}, settings);
        
        var covalentHost = this.settings.covalentHost;
        if (covalentHost && typeof(covalentHost) != 'string') {
            throw new Error("Unrecognized value for 'covalentHost' setting.  Value must be a string.");
        }
        this.activityService = new CovalentActivityService(covalentHost);
        
        var errorHandler = this.settings.error;
        if (errorHandler) {
            if (typeof(errorHandler) != "function") {
                throw new Error("Unrecognized value for 'error' setting.  Value must be a function.");
            }
            // Remove the error handler function from the launch parameters
            delete launchParams.error;
        }
        
        var handleLaunchResult = (function(covalentActivity){
            
            return function(launchInfo){
                covalentActivity.activityHandle = eval(launchInfo['activityScript']);
             
                covalentActivity.activityHandle.setActivityService( covalentActivity.activityService );
                
                covalentActivity.activityHandle.addActivityStateChangeListener( function(activityState){
                    covalentActivity.notifyActivityStateChangeListeners(activityState);
                } );
                
                covalentActivity.activityHandle.addActivityFinishedListener( function(uuid){
                    covalentActivity.notifyActivityFinishedListeners(uuid);
                } );
                if (settings.itemRendererOverride && typeof(covalentActivity.activityHandle.setItemRendererOverride) == "function") {
                    covalentActivity.activityHandle.setItemRendererOverride(settings.itemRendererOverride);
                }
                
                covalentActivity.activityHandle.render( covalentActivity.getContainerElement() );
            }
        
        })(this);
        
        if (this.isSecure())
        {
            this.activityService.launchSecureActivity(handleLaunchResult, launchParams, errorHandler);
        }
        else if (this.settings.reviewMode)
        {
        	this.activityService.launchReviewActivity(handleLaunchResult, launchParams, errorHandler);
        }
        else
        {
            this.activityService.launchActivity(handleLaunchResult, launchParams, errorHandler);
        }
    }
    
    CovalentActivity.prototype.isSecure = function()
    {
        return typeof(this.settings.secureParams) == 'string' && this.settings.secureParams;
    }
    
    CovalentActivity.prototype.setActivityHandle = function(handle)
    {
        if (!handle)
        {
            throw "activity handle cannot be null.";
        }
        this.activityHandle = handle;
    }
    
    CovalentActivity.prototype.getActivityService = function()
    {
        return this.activityService;
    }
    
    CovalentActivity.prototype.getContainerElement = function()
    {
        var id = this.settings['containerElementId'];
        return (id ? document.getElementById(id) : null);
    }
    
    //TODO: this style of registering listeners came from ALS widget's style
    //which was a necessity of being a widget in an iframe.  i think it might
    //be better to methods like CovalentActivity.getActivityState( callback( activityState) )
    CovalentActivity.prototype.addActivityStateChangeListener = function(listener)
    {
        this.stateChangeListeners.push(listener);
    }
    
    //TODO: this came from ALS widget.  Do we even need it?  are activities
    //going to be ending themselves and notifying consumers?  or will the consumer
    //be telling the activity that it's done?  need to reexamine.
    CovalentActivity.prototype.addActivityFinishedListener = function(listener)
    {
        this.finishedListeners.push(listener);
    }
    
    CovalentActivity.prototype.notifyActivityStateChangeListeners = function(activityState)
    {
        for(var i = 0; i < this.stateChangeListeners.length; i++)
        {
            this.stateChangeListeners[i](activityState);
        }
    }
    
    CovalentActivity.prototype.notifyActivityFinishedListeners = function(activityState)
    {
        for(var i = 0; i < this.finishedListeners.length; i++)
        {
            this.finishedListeners[i](activityState);
        }
    }
    
    CovalentActivity.prototype.destroy = function() 
    {
        if (this.activityHandle) 
        {
            this.activityHandle.destroy();
        }
        
        var containerElement = this.getContainerElement();
        if (containerElement) 
        {
            containerElement.innerHTML = '';
        }
    }
    
    window['com_cengage_covalent_widgets_CovalentActivity'] = CovalentActivity;
    CovalentActivity.prototype['addActivityStateChangeListener'] = CovalentActivity.prototype.addActivityStateChangeListener;
    CovalentActivity.prototype['addActivityFinishedListener'] = CovalentActivity.prototype.addActivityFinishedListener;
    
})();