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
            isJSON: false
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
                getNode('body').css('display', 'block');
                getNode('footer').css('display', 'block');

                var searchSettings = $.getParam('search'),
                    id,
                    item;

                for (id in searchSettings) {
                    if (searchSettings.hasOwnProperty(id)) {
                        if (searchSettings[id].search > 0 && Object.keys(settings.params).indexOf(id) > -1) {
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
                item = new SearchItem(obj, id, settings.params[id]);
                item.setChecked(true);
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
