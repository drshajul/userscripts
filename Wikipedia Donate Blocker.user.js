// ==UserScript==
// @name         Wikipedia Donate Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block the donation prompts!
// @author       You
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('div.frb').forEach(
        function myFunction(item, index, arr) {item.style.display = "none";}
    )
})();
