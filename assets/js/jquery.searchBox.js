;
(function ($) {
    "use strict";
    /*global $*/
    var SearchItem = function (context, id, params) {
        "use strict";
    
        var $el,
            obj = this,
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
            toggleBtnHandler = function (/*e*/) {
                var $variablesList = getNode('filterVal1');
                if ($variablesList.is("[multiple]")) {
                    $variablesList.attr('size', 1).attr('multiple', false);
                    $(this).removeClass('btn-danger').addClass('btn-primary')
                            .children().removeClass('fa-minus').addClass('fa-plus');
                } else {
                    $variablesList.attr('size', 4).attr('multiple', true);
                    $(this).addClass('btn-danger').removeClass('btn-primary')
                            .children().removeClass('fa-plus').addClass('fa-minus');
                }
            },
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
    
    
        this.getElement = function () {
            return $el;
        };
    
        this.getId = function () {
            return id;
        };
    
        this.setOperator = function (operatorId) {
            getNode('operatorSelect').children('[value="' + operatorId + '"]')
                    .prop('selected', 'selected').trigger('change');
        };
    
        this.setValues = function (values) {
            getNode('filterVal1').val(values[0]);
            if (values.length > 1) {
                getNode('filterVal2').val(values[1]);
            }
        };
    
        this.setVisible = function (isVisisble) {
            if (isVisisble) {
                $el.removeClass('hidden');
            } else {
                $el.addClass('hidden');
            }
        };
    
        this.setChecked = function (isChecked) {
            if (isChecked) {
                getNode('checkBox').iCheck('check');
            } else {
                getNode('checkBox').iCheck('uncheck');
            }
        };
    
        //======================================================================
    
        init();
    };
    
    SearchItem.getTemplate = function (item, params) {
        "use strict";
    
        var tpl = {};
    
        tpl.layout = function (id, params, labels, operators) {
            var xhtml = '<div class="row">';
            xhtml += SearchItem.getTemplate('checkboxLayout', [id]);
            xhtml += SearchItem.getTemplate('labelLayout', [id, labels]);
            xhtml += SearchItem.getTemplate('operatorListLayout', [id, params, operators]);
            xhtml += SearchItem.getTemplate('valuesLayout', [id, params]);
            xhtml += '</div>';
            return xhtml;
        };
    
        tpl.valuesLayout = function (id, params) {
            var xhtml = '',
                i;
            xhtml += '<div class="row col-md-7">';
    
            if (params.type === 'list') {
    
                xhtml += '<div class="form-group col-md-2">';
                xhtml += '<select name="search[' + id + '][values][]" class="form-control input-block-level filter-value-1" size="1">';
    
                for (i in params.values) {
                    xhtml += '<option value="' + i + '">' + params.values[i] + '</option>';
                }
    
                xhtml += '</select>';
                xhtml += '</div>';
    
                xhtml += '<div class="form-group col-md-2">' +
                        '<button type="button" class="btn btn-sm btn-primary glyphicon list-toggle">' +
                        '<i class="fa fa-plus"></i>' +
                        '</button>' +
                        '</div>';
    
            } else {
    
                xhtml += '<div class="form-group col-md-2">' +
                        '<input type="text" value="" name="search[' + id + '][values][]" placeholder="" class="form-control filter-value-1" ' + (params.type === 'date' ? 'data-provide="datepicker" data-date-format="yyyy-mm-dd"' : '') + ' />' +
                        '</div>';
    
                if (['date', 'integer'].indexOf(params.type) > -1) {
                    xhtml += '<div class="form-group col-md-2">' +
                            '<input type="text" value="" name="search[' + id + '][values][]" placeholder="" class="form-control filter-value-2" ' + (params.type === 'date' ? 'data-provide="datepicker"  data-date-format="yyyy-mm-dd"' : '') + ' />' +
                            '</div>';
                }
    
            }
    
            xhtml += '</div>';
    
            return xhtml;
        };
    
        tpl.operatorListLayout = function (id, params, operators) {
            var xhtml,
                i;
            xhtml = '<div class="form-group col-md-2">' +
                    '<select name="search[' + id + '][operator]" class="form-control  input-block-level operators">';
    
            for (i in SearchItem.operatorByType[params.type]) {
                xhtml += '<option value="' + SearchItem.operatorByType[params.type][i] + '">' +
                        operators[SearchItem.operatorByType[params.type][i]] +
                        '</option>';
            }
    
            xhtml += '</select>' +
                    '</div>';
    
            return xhtml;
        };
    
        tpl.labelLayout = function (id, labels) {
            return '<div class="form-group col-md-2">' +
                    '<label>' + (labels[id] || id) + '</label>' +
                    '</div>';
        };
    
        tpl.checkboxLayout = function (id) {
            return '<div class="form-group col-md-1 text-center">' +
                    '<input type="checkbox" class="icheck" name="search[' + id + '][search]" value="1" />' +
                    '</div>';
        };
    
        return tpl[item].apply(this, params);
    };
    
    SearchItem.operatorByType = {
        'integer': ["=", "!=", ">=", "<=", "><"],
        'date': ["=", ">=", "<=", "><"],
        'string': ["~", "!~"],
        'boolean': ["=", "!="],
        'list': ["=", "!="]
    };
    
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