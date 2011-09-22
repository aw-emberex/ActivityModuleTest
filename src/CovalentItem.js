(function(){

    function CovalentItem(settings){
    
        if( !settings.restReceiverUrl )
            throw 'CovalentItem: settings.restReceiverUrl cannot be blank.';
    
        this.itemHandle = null;
    
        this.settings = settings;
    
        this.itemService = new CovalentItemService(this.getRestReceiverUrl());
        
        if( this.settings.secureParams ){
        
            this.itemService.secureGetItemScript( (function(covalentItem){
            
                return function(secureScriptResult){
                    covalentItem.settings.secureParams = secureScriptResult.nextSecureParams;
                    covalentItem.setItemHandle( eval(secureScriptResult.script) );
                }
            
            })(this), this.settings);            
            
        
        } else {
        
            this.itemService.getItemScript( (function(covalentItem){
            
                return function(scriptResult){
                    covalentItem.setItemHandle( eval(scriptResult.script) );
                }
            
            })(this), this.settings);
        }
        
    }
    
    CovalentItem.prototype.setItemHandle = function(handle)
    {
        if( !handle )
            throw "item handle cannot be null.";
            
        this.itemHandle = handle;
        this.itemHandle.setItemRendererOverride(this.settings.itemRendererOverride);
        this.itemHandle.render( this.getContainerElement() );
    }
    
    CovalentItem.prototype.getItemService = function()
    {
        return this.itemService;
    }
    
    CovalentItem.prototype.getContainerElement = function()
    {
        return document.getElementById( this.settings.containerElementId );
    }
    
    CovalentItem.prototype.getRestReceiverUrl = function(){
        return this.settings.restReceiverUrl;
    }
    
    CovalentItem.prototype.requestState = function(callback, messageParams, redraw){
    
        if( this.isSecure() )
        {
            if(redraw){
                if(this.reRender(false, true)){
                	redraw = false;
            	}
            }            
            
            var params = {
                secureParams: this.settings.secureParams,
                answerData: this.itemHandle.getAnswerData(),
                messageParams: messageParams,
                restReceiverUrl: this.getRestReceiverUrl(),
                redraw: redraw
            }
            this.itemService.secureGetItemScript( (function(covalentItem){
            
                return function(secureScriptResult){
                    
                    if( redraw )
                    {
                        covalentItem.itemHandle.destroy();
                        covalentItem.setItemHandle( eval(secureScriptResult.script) );
                    }
                    
                    covalentItem.settings.secureParams = secureScriptResult.nextSecureParams;
                    
                    callback( secureScriptResult.secureState );
                }
                
            
            })(this), params);
        }
        else
        {
            var params = {
                itemUri: this.settings.itemUri,
                rendererId: this.settings.rendererId,
                answerData: this.itemHandle.getAnswerData(),
                restReceiverUrl: this.getRestReceiverUrl()
            }
            
            this.itemService.getItemScript( (function(covalentItem){
            
                return function(scriptResult){
                    
                    if( redraw )
                    {
                        covalentItem.itemHandle.destroy();
                        covalentItem.setItemHandle( eval(scriptResult.script) );
                    }
                    
                    callback( scriptResult.state );
                    
                }
            
            })(this), params);
        }
        
    }
    
    CovalentItem.prototype.clearItem = function()
    {
        return this.itemHandle.clearItem();
    }
    
    CovalentItem.prototype.reRender = function(showFeedback, interactive, attemptNumber)
    {
        return this.itemHandle.reRender(showFeedback, interactive, attemptNumber);
    }
    
    CovalentItem.prototype.isSecure = function()
    {
        return typeof(this.settings.secureParams) != 'undefined' && this.settings.secureParams != null;
    }
    
    CovalentItem.prototype.notifyStateChangeListeners = function(state)
    {
        for(var i = 0; i < this.stateChangeListeners.length; i++){
            this.stateChangeListeners[i](state);
        }
    }
    
    CovalentItem.prototype.destroy = function()
    {
        this.itemHandle.destroy();
    }
    
    window.com_cengage_covalent_widgets_CovalentItem = CovalentItem;
    
})();
