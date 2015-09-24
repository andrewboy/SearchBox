/*global $*/
var SearchBox = function (el, opts) {
    "use strict";

    var $el = $(el),
        obj = this,
        settings = $.extend({
            isJSON: false
        }, opts || {}),
        items = [],

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
            }
        },

        setInitialState = function () {
            if ($.hasParam('search')) {
                $el.removeClass('collapsed-box');
                getNode('body').css('display', 'block');
                getNode('footer').css('display', 'block');

                var searchSettings = $.getParam('search');

                for (var id in searchSettings) {
                    if (searchSettings[id].search > 0 && Object.keys(settings.params).indexOf(id) > -1) {
                        var item = new SearchItem(obj, id, settings.params[id]);
                        item.setChecked(true);
                        item.setOperator(searchSettings[id].operator);
                        item.setValues(searchSettings[id].values);
                    }
                }
            }
            ;
        },

        init = function () {

    //            if( $.hasParam('search') ){
    //                $el.removeClass('collapsed-box');
    //                getNode('body').css('display','block');
    //                getNode('footer').css('display','block');
    //            }

            if ('undefined' === typeof (settings.params) && 'undefined' !== typeof (window.searchBoxParams)) {
                var input = JSON.parse(window.searchBoxParams);
                settings.params = input.params;
                settings.url = input.url;
                settings.itemOperators = input.operators;
                settings.itemLabels = input.fieldLabels;
            }

            if ('undefined' !== typeof (settings.params)) {
                getNode('searchItemSelector')
                        .append(SearchBox.getTemplate('selectOptionsLayout', [{'cls': '', 'name': '', 'options': settings.params}, settings.itemLabels]));
                getNode('searchItemSelector').on('change', searchItemSelectorHandler);
                getNode('form').attr('action', settings.url);

                setInitialState();
            }

            if (settings.isJSON) {
                getNode('form').submit(submitHandler);
            }

        },


    submitHandler = function (e) {
        e.preventDefault();

        var $target = $(e.currentTarget);

        $.ajax({
            url: getNode('form').attr('action'),
            type: 'get',
            data: $target.serializeArray(),
            dataType: 'json',
            success: function (data, status, xhr) {
                if ('undefined' != settings.events.onSuccess) {
                    settings.events.onSuccess.call(this, data, status, xhr);
                }
            }
        });

        return false;
    },

    searchItemSelectorHandler = function (e) {
        var $target = $(e.currentTarget);

        var id = $target.val();

        if ("undefined" === typeof (items[id])) {
            var item = new SearchItem(obj, id, settings.params[id]);
            item.setChecked(true);
        }
    };

    this.getSettings = function (key) {
        if (['itemOperators', 'itemLabels'].indexOf(key) > -1) {
            return settings[key];
        }

        return null;
    };

    this.getItem = function (itemId) {
        return items[itemId];
    };

    this.addItem = function (item) {
        getNode('body').append(item.getElement());
        items[ item.getId() ] = item;
        getNode('searchItemSelector').children('[value="' + item.getId() + '"]').attr('disabled', true);
    };


    init();
};

SearchBox.getTemplate = function (item, params) {
    var tpl = {};

    tpl.selectOptionsLayout = function (params, labels) {
        var xhtml = '';

        for (var i in params.options) {
            xhtml += '<option value="' + i + '">' + (labels[i] || i) + '</option>';
        }

        return xhtml;
    };

    return tpl[item].apply(this, params);
};
