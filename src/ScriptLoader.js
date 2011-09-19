(function(){

    var loadedScripts = {};
       
    function ScriptLoader(scriptList, callback)
    {
        this.callback = callback;
        this.scriptList = scriptList;    
        this.currentScript = 0;
    }

    ScriptLoader.prototype.loadNext = function() {

        var scriptElem = this.scriptList[ this.currentScript++ ];

        // Check for the end of the list
        if (!scriptElem)
        {
            if (this.callback)
            {
                this.callback.apply(window, [loadedScripts]);
                this.callback = null;
            }
            return;
        }
        
        this.load(scriptElem);
    }
   
    ScriptLoader.prototype.load = function(elem) {

        if(elem.src)
        {
            jQuery.ajax({
                'url': elem.src,
                'dataType': 'script',
                'cache': false,
                'success': (function(scriptLoader){                
                    return function(){
                        loadedScripts[elem.src] = elem;
                        scriptLoader.loadNext();
                    }
                    
                })(this)
            });
        }
        else
        {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            if(typeof(script.text) == 'undefined')
            {
                script.appendChild(document.createTextNode(elem.innerHTML));
            }
            else
            {
                script.text = elem.innerHTML;
            }
            
            jQuery('head').append(script);
            jQuery('head').remove(script); 
            this.loadNext();
        }
    }

    ScriptLoader.loadNeededScripts = function(callback, containerElement)
    {
        var currentScripts = containerElement.getElementsByTagName("script");
        var neededScripts = [];

        for (var i=0; i<currentScripts.length; i++)
        {
            var script = currentScripts[i];
            if (script.src)
            {
                if (!loadedScripts[script.src]) {
                    neededScripts.push(script);
                }
            } else {
                neededScripts.push(script);
            }
        }
        
        new ScriptLoader(neededScripts, callback).loadNext();
    }
    
    window['ScriptLoader'] = ScriptLoader;
    ScriptLoader['loadNeededScripts'] = ScriptLoader.loadNeededScripts;
})();


