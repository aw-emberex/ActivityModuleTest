(function() {
    /** 
     * The name of the packaged script file that this code gets compiled into.
     * This string is dynamically replaced during the build process to reflect the generated filename.
     */
    var SCRIPT_FILENAME = "@module.script.filename@";
    
    /**
     * A list of properties that, if specified in the settings passed to the constructor, will be passed
     * as launch parameters, and will not be passed to the activity handle constructor when it is
     * instantiated.
     */
    var COVALENT_ACTIVITY_SERVICE_LAUNCH_PARAMS = [
        "consumerId",
        "uuid",
        "specification",
        "prebuiltId",
        "activityOptions",
        "persistent",
        "serializedGrade",
        "secureParams"
    ];

    /**
     * Constructor.
     * @param {Object} settings The settings used to configure this object.
     */
    function CovalentActivity(settings)
    {
        var covalentHost = settings.covalentHost;
        if (! covalentHost) {
            covalentHost = CovalentUtils.resolveCovalentHost(SCRIPT_FILENAME);
            if (! covalentHost) {
                throw new Error("Unable to resolve covalent host from script element with src containing filename ("+SCRIPT_FILENAME+").");
            }
        } else if (typeof(covalentHost) != 'string') {
            throw new Error("Unrecognized value for 'covalentHost' setting.  Value must be a string.");
        }
        
        this.errorHandler = settings.error;
        if (this.errorHandler) {
            if (typeof(this.errorHandler) != "function") {
                throw new Error("Unrecognized value for 'error' setting.  Value must be a function.");
            }
            delete settings.error;
        }
        
        var useSecureProtocol = typeof(settings.useSecureProtocol) == "undefined" ? false : settings.useSecureProtocol;
        
        this.settings = settings;
        
        this.activityService = new CovalentActivityService(covalentHost, useSecureProtocol, null, this.settings.covalentHostTimeout);
        this.stateChangeListeners = [];
        this.endNavigationListeners = [];
        this.finishedListeners = [];
        this.activityHandle = null;
        
        var activityLaunchParams = {};
        jQuery.each(COVALENT_ACTIVITY_SERVICE_LAUNCH_PARAMS, function(idx, prop) {
            activityLaunchParams[prop] = settings[prop];
        });
        
        this._launch(activityLaunchParams);
    };
    
    jQuery.extend(CovalentActivity.prototype, {
    
        isSecure: function()
        {
            return typeof(this.settings.secureParams) == 'string' && this.settings.secureParams;
        },
        
        getActivityService: function()
        {
            return this.activityService;
        },
        
        getContainerElement: function()
        {
            var id = this.settings.containerElementId;
            return (id ? document.getElementById(id) : null);
        },
        
        addActivityStateChangeListener: function(listener)
        {
            this.stateChangeListeners.push(listener);
        },
        
        addActivityEndNavigationListener: function(listener)
        {
            this.endNavigationListeners.push(listener);
        },
        
        addActivityFinishedListener: function(listener)
        {
            this.finishedListeners.push(listener);
        },
        
        _launch: function(launchParams) 
        {
            var onLaunch = jQuery.proxy(this._onActivityLaunch, this);
            var onError = jQuery.proxy(this._onError, this);
            
            if (this.isSecure()) {
                this.activityService.launchSecureActivity(onLaunch, launchParams, onError);
            } else if (this.settings.reviewMode) {
                this.activityService.launchReviewActivity(onLaunch, launchParams, onError);
            } else {
                this.activityService.launchActivity(onLaunch, launchParams, onError);
            }
        },
        
        _onActivityLaunch: function(launchInfo)
        {
            this.activityLaunchInfo = launchInfo;
            
            if (! launchInfo.className) {
                throw new Error("No value defined for activity handle classname");
            }
            
            if (typeof(window[launchInfo.className]) == "undefined") {
                if (! launchInfo.url) {
                    throw new Error("No value defined for activity handle URL");
                }
                jQuery.getScript(launchInfo.url, jQuery.proxy(this._onActivityHandleClassLoaded, this));
            } else {
                this._onActivityHandleClassLoaded();
            }
        },
        
        _onActivityHandleClassLoaded: function()
        {
            var activityHandleClassName = this.activityLaunchInfo.className;
            if (typeof(window[activityHandleClassName]) == "undefined") {
                throw new Error("Class not found for activity handle class name '"+activityHandleClassName+"'");
            }
            this._createAndRenderActivity(activityHandleClassName);
        },
        
        _createAndRenderActivity: function(activityHandleClassName)
        {
            var activityCreateParams = jQuery.extend(
                {},
                this.settings,
                (this.activityLaunchInfo.settings || {}), 
                {
                    activityService: this.activityService,
                    error: jQuery.proxy(this._onError, this)
                }
            );
            
            this.activityHandle = new window[activityHandleClassName](activityCreateParams);
            this.activityHandle.addActivityStateChangeListener(jQuery.proxy(this._onActivityStateChange, this));
            if(this.endNavigationListeners && this.endNavigationListeners.length > 0) {
                this.activityHandle.addActivityEndNavigationListener(jQuery.proxy(this._onActivityEndNavigation, this));
            }            
            this.activityHandle.addActivityFinishedListener(jQuery.proxy(this._onActivityFinished, this));
            this.activityHandle.render(this.getContainerElement());
        },
            
        _onActivityStateChange: function(message)
        {
            this._notifyListeners(this.stateChangeListeners, message);
        },
        
        _onActivityEndNavigation: function(message)
        {
            this._notifyListeners(this.endNavigationListeners, message);
        },
        
        _onActivityFinished: function(message)
        {
            // TODO: Pass the entire activity state object, not just the UUID.
            if (message && typeof(message) == "object") {
                message = (message.secure ? message.secureMessage : message.uuid);
            }
            this._notifyListeners(this.finishedListeners, message);
        },
        
        _notifyListeners: function(listeners, message) 
        {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](message);
            }
        },
            
        save: function(afterSaveCallback) 
        {
            if (this.activityHandle) 
            {
                this.activityHandle.save(afterSaveCallback);
            }
        },
        
        isModified: function() 
        {
            if (this.activityHandle) 
            {
                return this.activityHandle.isModified();
            }
            return false;
        },

        hasModifiedItem: function() 
        {
            if (this.activityHandle)
            {
                return this.activityHandle.hasModifiedItem();
            }
            return false;
        },
        
        destroy: function() 
        {
            if (this.activityHandle) {
                this.activityHandle.destroy();
            }
            
            var containerElement = this.getContainerElement();
            if (containerElement) {
                containerElement.innerHTML = '';
            }
        },
        
        _onError: function(message) {
            if (this.errorHandler) {
                this.errorHandler(message);
            }
        }
    });
    
    window['com_cengage_covalent_widgets_CovalentActivity'] = CovalentActivity;
    
})();