var uiExtensionAPI = window.BV.extensions.ui;
var PostInteractionNotification = require('./pin');
var $ = require('jquery');

var privateExtensionHandle = uiExtensionAPI.register('rr_show_review_notifications');

var productDataPromise = $.getJSON('https://bvdata');

function loadReviewNotifications (settings) {
    $(function () {
        productDataPromise.then(
            function (data) {
                settings.config.productData = data;                
                var pin = new PostInteractionNotification(settings.config, BV.options.apiconfig);
                pin.render();                
                privateExtensionHandle.trigger('invoke');        
            },
            function () {
                alert ('Failed to load demo data from the server!');
            }
        );         
    });
}

privateExtensionHandle.on('call', loadReviewNotifications);

window.BV.loadReviewNotifications = loadReviewNotifications;