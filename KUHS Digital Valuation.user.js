// ==UserScript==
// @name         KUHS Digital Valuation
// @namespace    http://tampermonkey.net/kuhs-remote-digital-evaluation
// @version      2026-07-11
// @description  Adjust element displays.
// @author       You
// @match        http://14.139.185.154:8364/*
// @match        http://112.133.211.40:8364/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=185.154
// @grant        unsafeWindow
// @run-at       document-start
// @updateURL    https://github.com/drshajul/userscripts/raw/refs/heads/master/KUHS%20Digital%20Valuation.user.js
// @downloadURL  https://github.com/drshajul/userscripts/raw/refs/heads/master/KUHS%20Digital%20Valuation.user.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Part 1: Element Removal Logic ---
    const removeInnerElements = () => {
        const elements = document.querySelectorAll('#question_block p, #question_block h4');
        elements.forEach(el => el.remove());
    };

    removeInnerElements();

    const observer = new MutationObserver(() => {
        removeInnerElements();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // --- Part 2: Modal Positioning on Click ---
    document.addEventListener('click', (e) => {
        if (e.target.matches('input[type="button"], button')) {

            setTimeout(() => {
                // Modified selector to capture whichever modal layout the page pulls up
                const modal = document.querySelector('#markModal .modal-dialog, #cnf_modal .modal-dialog');
                if (!modal) return;

                // Force absolute/fixed positioning
                modal.style.position = 'fixed';
                modal.style.margin = '0';

                // Calculate positions based on viewport boundaries
                const modalHeight = 150;
                const modalWidth = 300;
                const offsetFromCursor = 10;

                const targetTop = e.clientY - modalHeight - offsetFromCursor;
                const targetLeft = window.innerWidth - modalWidth - offsetFromCursor;

                // Apply static styles
                modal.style.top = `${targetTop}px`;
                modal.style.left = `${targetLeft}px`;
            }, 20); // Slightly increased buffer to let jQuery complete the DOM adjustments
        }
    });

})();
