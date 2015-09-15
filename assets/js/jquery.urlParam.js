(function($){
    
    $.getParams = function(){
        var params = new Object;
        
        var setParam = function(params, paramIndexes, value){
            var realParam = paramIndexes.shift();
            var cleanedParam = realParam.match(/\[(.*?)\]/)[1];
            
            if( "undefined" === typeof(params[cleanedParam]) ){
                params[cleanedParam] = [];
            }
            
            if( paramIndexes.length > 0 ){
                setParam(params[cleanedParam], paramIndexes, value);
            } else{
                if(realParam === '[]'){
                    params.push(value);
                } else{
                    params[cleanedParam] = value;
                }
            }
            
        };
        
        var searchParams = document.location.search.substr(1);
        var arrSearchParams = decodeURI(searchParams).split('&');
        
        if(searchParams.length < 1 || arrSearchParams.length < 1){return params;}
        
        for(var i in arrSearchParams){
            var param = arrSearchParams[i].split('=');
            var realIdx = param[0].replace(/\[.*?\]/g, '');
            
            if(param[0].search(/\[(.*?)\]/g)> -1){
                if("undefined" === typeof(params[realIdx])){
                    params[realIdx] = [];
                }
                setParam(params[realIdx], param[0].match(/\[(.*?)\]/g), decodeURIComponent(param[1]));
            } else{
                params[ param[0] ] = decodeURIComponent(param[1]);
            }
        }
        
        return params;
    };
    
    $.hasParam = function(paramName){
        var params = $.getParams();
        
        return "undefined" === typeof(params[paramName]);
    };
    
    $.getParam = function(paramName){
        var params = $.getParams();
        
        return params[paramName] || null;
    };
    
})(jQuery);