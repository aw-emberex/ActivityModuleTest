function CovalentUtils(){}

CovalentUtils.resolveCovalentHost = function(sourceFileName)
{
    var scriptElement = CovalentUtils.findCovalentApiScriptElement(sourceFileName);
    if (scriptElement) {
        var host = scriptElement.attr('src').match(new RegExp("^\\w+:\\/\\/([^/]+)"));

        if (host && host.length>1) {
            return host[1];
        }
    }
    
    return window.location.host;
}

CovalentUtils.findCovalentApiScriptElement = function(sourceFileName) {
    if (! sourceFileName) {
        // TODO: This filename should come from build configuration somehow
        sourceFileName = "CovalentApi.js";
    }
    var scriptElement = jQuery('script[src$="'+ sourceFileName +'"]');
    return (scriptElement.length ? scriptElement : null);        
}
