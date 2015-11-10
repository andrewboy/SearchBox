;
(function ($) {
    "use strict";
    /*global $*/
    /**
     * Handles search item mechanizm in search box plugin
     * @param {Object} context The search box reference
     * @param {String} id Search item identifier
     * @param {Array} params Search Item params
     * @returns {SearchItem}
     */
    var SearchItem = function (context, id, params) {
        "use strict";
    
        var $el,
            obj = this,
    
            /**
             * Register and get node references
             * @param {String} nodeId
             * @returns {$} Node reference
             */
            getNode = function (nodeId) {
                switch (nodeId) {
                case 'operatorSelect':
                    return $('.operators', $el);
    
                case 'filterVal1':
                    return $('.filter-value-1', $el);
    
                case 'filterVal2':
                    return $('.filter-value-2', $el);
    
                case 'listToggleBtn':
                    return $('.list-toggle', $el);
    
                case 'checkBox':
                    return $('input.icheck', $el);
                }
            },
    
            /**
             * Handle operator select box 'change' event
             * @param {Object} e Event object
             * @returns {undefined}
             */
            operatorHandler = function (e) {
                var $target = $(e.currentTarget);
    
                switch ($target.val()) {
                case '=':
                case '>=':
                case '<=':
                case '!':
                    getNode('filterVal1').css('display', 'block').attr('disabled', false);
                    getNode('filterVal2').css('display', 'none').attr('disabled', true);
                    break;
    
                case '><':
                    getNode('filterVal1').css('display', 'block').attr('disabled', false);
                    getNode('filterVal2').css('display', 'block').attr('disabled', false);
                    break;
                }
            },
    
            /**
             * Set valuelist state to mulit or single
             * @param {Boolean} isExpand
             * @returns {undefined}
             */
            expandValuesList = function (isExpand) {
                var $variablesList = getNode('filterVal1');
                if (!isExpand) {
                    $variablesList.attr('size', 1).attr('multiple', false);
                    getNode('listToggleBtn').removeClass('btn-danger').addClass('btn-primary')
                            .children().removeClass('fa-minus').addClass('fa-plus');
                } else {
                    $variablesList.attr('size', 4).attr('multiple', true);
                    getNode('listToggleBtn').addClass('btn-danger').removeClass('btn-primary')
                            .children().removeClass('fa-plus').addClass('fa-minus');
                }
            },
    
            /**
             * Handle toggle button between single and multiple state
             * @returns {undefined}
             */
            toggleBtnHandler = function () {
                expandValuesList(!getNode('filterVal1').is("[multiple]"));
            },
    
            /**
             * Init the SearchItem object
             * @returns {undefined}
             */
            init = function () {
                $el = $(SearchItem.getTemplate('layout', [id, params, context.getSettings('itemLabels'), context.getSettings('itemOperators')]));
                context.addItem(obj);
    
                getNode('checkBox').iCheck('destroy').iCheck({
                    checkboxClass: 'icheckbox_square',
                    radioClass: 'iradio_square'
                });
                getNode('listToggleBtn').on('click', toggleBtnHandler);
                getNode('operatorSelect').on('change', operatorHandler);
                getNode('operatorSelect').change();
            };
    
        /**
         * Destroy search item
         * @returns {undefined}
         */
        this.destroy = function () {
            $el.remove();
            params = undefined;
            context.removeItem(id);
        };
    
        /**
         * Get the search item element node reference
         * @returns {SearchItem.$el|$}
         */
        this.getElement = function () {
            return $el;
        };
    
        /**
         * Get the identifier of the SearchItem
         * @returns {String}
         */
        this.getId = function () {
            return id;
        };
    
        /**
         * Sets the operator selecttion box
         * @param {String} operatorId
         * @returns {undefined}
         */
        this.setOperator = function (operatorId) {
            getNode('operatorSelect').children('[value="' + operatorId + '"]')
                    .prop('selected', 'selected').trigger('change');
        };
    
        /**
         * Sets the values
         * @param {Array} values
         * @returns {undefined}
         */
        this.setValues = function (values) {
            if ('list' === params.type && values.length > 1) {
                expandValuesList(true);
                getNode('filterVal1').val(values);
            } else {
                getNode('filterVal1').val(values[0]);
                if (values.length > 1) {
                    getNode('filterVal2').val(values[1]);
                }
            }
        };
    
        /**
         * Sets the visibility
         * @param {Boolean} isVisisble
         * @returns {undefined}
         */
        this.setVisible = function (isVisisble) {
            if (isVisisble) {
                $el.removeClass('hidden');
            } else {
                $el.addClass('hidden');
            }
        };
    
        /**
         * Set checked state
         * @param {Boolean} isChecked
         * @returns {undefined}
         */
        this.setChecked = function (isChecked) {
            if (isChecked) {
                getNode('checkBox').iCheck('check');
            } else {
                getNode('checkBox').iCheck('uncheck');
            }
        };
    
        init();
    };
    
    /**
     * SearchItem templace container
     * @param {String} item
     * @param {Object} params
     * @returns {String} Template string literal
     */
    SearchItem.getTemplate = function (item, params) {
        "use strict";
    
        var tpl = {};
    
        /**
         * Get the full layout of the search item
         * @param {String} id
         * @param {Object} params
         * @param {Array} labels
         * @param {Object} operators
         * @returns {String} The layout string literal
         */
        tpl.layout = function (id, params, labels, operators) {
            var xhtml = '<div class="row">';
            xhtml += SearchItem.getTemplate('checkboxLayout', [id]);
            xhtml += SearchItem.getTemplate('labelLayout', [id, labels]);
            xhtml += SearchItem.getTemplate('operatorListLayout', [id, params, operators]);
            xhtml += SearchItem.getTemplate('valuesLayout', [id, params]);
            xhtml += '</div>';
            return xhtml;
        };
    
        /**
         * Get values template
         * @param {String} id
         * @param {Object} params
         * @returns {String}
         */
        tpl.valuesLayout = function (id, params) {
            var xhtml = '',
                i;
            xhtml += '<div class="row col-md-7">';
    
            if (params.type === 'list') {
    
                xhtml += '<div class="form-group col-md-4">';
                xhtml += '<select name="search[' + id + '][values][]" class="form-control input-block-level filter-value-1" size="1">';
    
                for (i in params.values) {
                    if (params.values.hasOwnProperty(i)) {
                        xhtml += '<option value="' + i + '">' + params.values[i] + '</option>';
                    }
                }
    
                xhtml += '</select>';
                xhtml += '</div>';
    
                xhtml += '<div class="form-group col-md-2">' +
                        '<button type="button" class="btn btn-sm btn-primary glyphicon list-toggle">' +
                        '<i class="fa fa-plus"></i>' +
                        '</button>' +
                        '</div>';
    
            } else if(params.type === 'boolean') {
                xhtml += '<div class="form-group col-md-4">' +
                        '<input type="hidden" value="1" name="search[' + id + '][values][]" />' +
                        '</div>';
            } else {
                xhtml += '<div class="form-group col-md-4">' +
                        '<input type="text" value="" name="search[' + id + '][values][]" placeholder="" class="form-control filter-value-1" ' + (params.type === 'date' ? 'data-provide="datepicker" data-date-format="yyyy-mm-dd"' : '') + ' />' +
                        '</div>';
    
                if (['date', 'integer'].indexOf(params.type) > -1) {
                    xhtml += '<div class="form-group col-md-4">' +
                            '<input type="text" value="" name="search[' + id + '][values][]" placeholder="" class="form-control filter-value-2" ' + (params.type === 'date' ? 'data-provide="datepicker"  data-date-format="yyyy-mm-dd"' : '') + ' />' +
                            '</div>';
                }
    
            }
    
            xhtml += '</div>';
    
            return xhtml;
        };
    
        /**
         * Get operator list selection box template
         * @param {String} id
         * @param {Object} params
         * @param {Object} operators
         * @returns {String}
         */
        tpl.operatorListLayout = function (id, params, operators) {
            var xhtml,
                i;
            xhtml = '<div class="form-group col-md-2">' +
                    '<select name="search[' + id + '][operator]" class="form-control  input-block-level operators">';
    
            for (i in SearchItem.operatorByType[params.type]) {
                if (SearchItem.operatorByType[params.type].hasOwnProperty(i)) {
                    xhtml += '<option value="' + SearchItem.operatorByType[params.type][i] + '">' +
                            operators[SearchItem.operatorByType[params.type][i]] +
                            '</option>';
                }
            }
    
            xhtml += '</select>' +
                    '</div>';
    
            return xhtml;
        };
    
        /**
         * Get label layout
         * @param {String} id
         * @param {Array} labels
         * @returns {String}
         */
        tpl.labelLayout = function (id, labels) {
            return '<div class="form-group col-md-2">' +
                    '<label>' + (labels[id] || id) + '</label>' +
                    '</div>';
        };
    
        /**
         * Get checkbox layout
         * @param {String} id
         * @returns {String}
         */
        tpl.checkboxLayout = function (id) {
            return '<div class="form-group col-md-1 text-center">' +
                    '<input type="checkbox" class="icheck" name="search[' + id + '][active]" value="1" />' +
                    '</div>';
        };
    
        return tpl[item].apply(this, params);
    };
    
    /**
     * SearchItem operator container
     */
    SearchItem.operatorByType = {
        'integer': ["=", "!=", ">=", "<=", "><"],
        'date': ["=", ">=", "<=", "><"],
        'string': ["~", "!~"],
        'boolean': ["!!1", "!!0"],
        'list': ["=", "!="]
    };
    
    /*global $*/
    /*global SearchItem*/
    /*global window*/
    /**
     * Searchbox mechanizm
     * @param {Object} el The jQuery node reference
     * @param {Object} opts Pass options from plugin
     * @returns {SearchBox}
     */
    var SearchBox = function (el, opts) {
        "use strict";
    
        var $el = $(el),
            obj = this,
            settings = $.extend({
                isJSON: false,
                itemBeforeInit: function(){},
                itemAfterInit: function(item){}
            }, opts || {}),
            items = [],
    
            /**
             * Register and get node references
             * @param {string} nodeId Node identifier
             * @returns {$} jQuery node reference
             */
            getNode = function (nodeId) {
                switch (nodeId) {
                case 'body':
                    return $('.box-body', $el);
    
                case 'footer':
                    return $('.box-footer', $el);
    
                case 'searchItemSelector':
                    return $('select[name="searchbox-item-selector"]', $el);
    
                case 'submitBtn':
                    return $('[type=submit]', $el);
    
                case 'form':
                    return $('form', $el);
                case 'clearBtn':
                    return $('.searchbox-clear', $el);
                }
            },
    
            /**
             * Initialize the plugin after loaded
             * @returns {undefined}
             */
            setInitialState = function () {
                if ($.hasParam('search')) {
                    $el.removeClass('collapsed-box');
    
                    var searchSettings = $.getParam('search'),
                        id,
                        item;
    
                    for (id in searchSettings) {
                        if (searchSettings.hasOwnProperty(id)) {
                            if (searchSettings[id].active > 0 && Object.keys(settings.params).indexOf(id) > -1) {
                                item = new SearchItem(obj, id, settings.params[id]);
                                item.setChecked(true);
                                item.setOperator(searchSettings[id].operator);
                                item.setValues(searchSettings[id].values);
                            }
                        }
                    }
                }
            },
    
            /**
             * Handle submit button 'submit' event
             * @param {object} e Event object
             * @returns {Boolean}
             */
            submitHandler = function (e) {
                e.preventDefault();
    
                var $target = $(e.currentTarget);
    
                $.ajax({
                    url: getNode('form').attr('action'),
                    type: 'get',
                    data: $target.serializeArray(),
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        if (undefined !== settings.events.onSuccess) {
                            settings.events.onSuccess.call(this, data, status, xhr);
                        }
                    }
                });
    
                return false;
            },
    
            /**
             * Handle search item selector 'change' event
             * @param {object} e Event object
             * @returns {undefined}
             */
            searchItemSelectorHandler = function (e) {
                var $target = $(e.currentTarget),
                    id = $target.val(),
                    item;
    
                if (undefined === items[id]) {
                    settings.itemBeforeInit.call(this);
                    item = new SearchItem(obj, id, settings.params[id]);
                    item.setChecked(true);
                    settings.itemAfterInit.call(this, item);
                }
            },
    
            /**
             * Handle clear button 'click' event
             * @returns {undefined}
             */
            clearBtnHandler = function () {
                var i;
    
                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        items[i].destroy();
                    }
                }
            },
    
            /**
             * Initalize the object
             * @returns {undefined}
             */
            init = function () {
                //SET PARAMS
                if (undefined === settings.params && undefined !== window.searchBoxParams) {
                    var input = JSON.parse(window.searchBoxParams);
                    settings.params = input.params;
                    settings.url = input.url;
                    settings.itemOperators = input.operators;
                    settings.itemLabels = input.fieldLabels;
                }
    
                //SET ENVIROMENT
                if (undefined !== settings.params) {
                    getNode('searchItemSelector')
                            .append(SearchBox.getTemplate('selectOptionsLayout', [{'cls': '', 'name': '', 'options': settings.params}, settings.itemLabels]));
                    getNode('searchItemSelector').on('change', searchItemSelectorHandler);
                    getNode('form').attr('action', settings.url);
                    getNode('clearBtn').on('click', clearBtnHandler);
    
                    setInitialState();
                }
    
                //SET JSON MODE
                if (settings.isJSON) {
                    getNode('form').submit(submitHandler);
                }
    
            };
    
        /**
         * Remove one searchItem from items
         * @param {type} id
         * @returns {undefined}
         */
        this.removeItem = function (id) {
            delete items[id];
            getNode('searchItemSelector').children('[value="' + id + '"]').attr('disabled', false);
        };
    
        /**
         * Get setting
         * @param {string} key
         * @returns {null|SearchBox.settings}
         */
        this.getSettings = function (key) {
            if (['itemOperators', 'itemLabels'].indexOf(key) > -1) {
                return settings[key];
            }
    
            return null;
        };
    
        /**
         * Get search item
         * @param {string} itemId
         * @returns {item}
         */
        this.getItem = function (itemId) {
            return items[itemId];
        };
    
        this.addItem = function (item) {
            getNode('body').append(item.getElement());
            items[item.getId()] = item;
            getNode('searchItemSelector').children('[value="' + item.getId() + '"]').attr('disabled', true);
        };
    
    
        init();
    };
    
    /**
     * Searchbox template container
     * @param {string} item
     * @param {array} params
     * @returns {string} The template string literal
     */
    SearchBox.getTemplate = function (item, params) {
        "use strict";
    
        var tpl = {};
    
        tpl.selectOptionsLayout = function (params, labels) {
            var xhtml = '',
                i;
    
            for (i in params.options) {
                if (params.options.hasOwnProperty(i)) {
                    xhtml += '<option value="' + i + '">' + (labels[i] || i) + '</option>';
                }
            }
    
            return xhtml;
        };
    
        return tpl[item].apply(this, params);
    };
    

    $.fn.searchBox = function (opts) {
        return this.each(function () {
            var $el = $(this);
            if ($el.data('searchBox')) {
                return;
            }
            var searchBox = new SearchBox(this, opts);

            $el.data('searchBox', searchBox);
        });
    };

})(jQuery);
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
            searchParams = document.location.search.substr(1),
            arrSearchParams,
            param,
            realIdx,

            setParam = function (params, paramIndexes, value) {
                var realParam = paramIndexes.shift(),
                    cleanedParam;

                cleanedParam = realParam.match(/\[(.*?)\]/)[1];

                if (undefined === params[cleanedParam]) {
                    params[cleanedParam] = [];
                }

                if (paramIndexes.length > 0) {
                    setParam(params[cleanedParam], paramIndexes, value);
                } else {

                    if (realParam === '[]') {
                        params.push(value);
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
                        params[realIdx] = [];
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