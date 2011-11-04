function CovalentUtils(){}

CovalentUtils.resolveCovalentHost = function(sourceFileName)
{
    var scriptElement = jQuery('script[src$="'+ sourceFileName +'"]');
    if (scriptElement) {
        var host = scriptElement.attr('src').match(new RegExp("^\\w+:\\/\\/([^/]+)"));

        if (host && host.length>1) {
            return host[1];
        }
    }
    
    return null;
};
