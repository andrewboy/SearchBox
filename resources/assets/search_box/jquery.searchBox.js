;
(function ($) {
    "use strict";

    //=require parts/SearchItem.js

    //=require parts/SearchBox.js

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

//=require jquery.urlParam.js