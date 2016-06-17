/*jslint indent: 4, maxerr: 500, vars: true, regexp: true, sloppy: true */
/*global document*/
/*global decodeURI*/
/*global jQuery*/
/**
 * Handles the URL parameters
 * @param {Object} $ jQuery object
 * @returns {undefined}
 */
(function ($) {
    "use strict";

    /**
     * Get all params from the URL
     * @returns {Object|Array}
     */
    $.getParams = function () {
        var params = Object.create(null),
            i,
            searchParams = document.location.search.substr(1).replace(/\+/g, '%20'),
            arrSearchParams,
            param,
            realIdx,

            setParam = function (params, paramIndexes, value) {
                var realParam = paramIndexes.shift(),
                    cleanedParam;

                cleanedParam = realParam.match(/\[(.*?)\]/)[1];

                if (undefined === params[cleanedParam]) {
                    if ('[]' === paramIndexes[0]) {
                        params[cleanedParam] = [];
                    } else {
                        params[cleanedParam] = {};
                    }
                }

                if ('[]' === paramIndexes[0]) {
                    realParam = paramIndexes.shift();
                }

                if (paramIndexes.length > 0) {
                    setParam(params[cleanedParam], paramIndexes, value);
                } else {
                    if ('[]' === realParam) {
                        params[cleanedParam].push(value);
                    } else {
                        params[cleanedParam] = value;
                    }
                }

            };

        arrSearchParams = decodeURI(searchParams).split('&');

        if (searchParams.length < 1 || arrSearchParams.length < 1) {
            return params;
        }

        for (i in arrSearchParams) {
            if (arrSearchParams.hasOwnProperty(i)) {
                param = arrSearchParams[i].split('=');
                realIdx = param[0].replace(/\[.*?\]/g, '');

                if (param[0].search(/\[(.*?)\]/g) > -1) {
                    if (undefined === params[realIdx]) {
                        params[realIdx] = {};
                    }
                    setParam(params[realIdx], param[0].match(/\[(.*?)\]/g), decodeURIComponent(param[1]));
                } else {
                    params[param[0]] = decodeURIComponent(param[1]);
                }
            }
        }

        return params;
    };

    /**
     * Check URL parameter exists or not
     * @param {String} paramName
     * @returns {Boolean}
     */
    $.hasParam = function (paramName) {
        var params = $.getParams();

        return undefined !== params[paramName];
    };

    /**
     * Get selected parameter from URL
     * @param {String} paramName
     * @returns {jquery.urlParam_L10.$.getParam.params|Array|Object|Object.getParams.params}
     */
    $.getParam = function (paramName) {
        var params = $.getParams();

        return params[paramName] || null;
    };

})(jQuery);