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
        }

        getNode('filterVal1').val(values[0]);
        if (values.length > 1) {
            getNode('filterVal2').val(values[1]);
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

            xhtml += '<div class="form-group col-md-2">';
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
                '<input type="checkbox" class="icheck" name="search[' + id + '][search]" value="1" />' +
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
    'boolean': ["=", "!="],
    'list': ["=", "!="]
};
