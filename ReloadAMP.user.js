// ==UserScript==
// @name         Reload AMP
// @namespace    http://tampermonkey.net/drshajul/reloadAMP
// @version      0.2
// @description  Reload AMP articles!
// @author       You
// @include      https://news.google.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    var my_href = "";
    setInterval(function(){
        my_href = document.location.href;
        if ( my_href.includes("/articles/") ) {
            console.log('DrShajul - Reloading..');
            window.location.reload();
        }
    }, 1000)
})();
