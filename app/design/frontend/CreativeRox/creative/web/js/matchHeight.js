define([
    'jquery',
    'matchHeight'
], function ($, mh) {
    return function(config, node) {
        $(function () {
            $(node).find(config.targetChildElements).matchHeight();
        });
    };
});