// ==UserScript==
// @name         Light Theme for Website
// @namespace    http://tampermonkey.net/brutalist_report
// @version      1.0
// @description  Change the website's dark theme to a light pleasing theme.
// @author       You
// @match        https://brutalist.report/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles to override the website's dark theme
    GM_addStyle(`
        body {
            background-color: #fdfdfd !important;
            color: #333 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
        }

        div.banner a:visited, a:link {
            text-decoration: none !important;
            color: #0056b3 !important; /* Muted blue for links */
        }

        nav a:visited, a:link {
            text-decoration: none !important;
            color: #0056b3 !important; /* Muted blue for navigation links */
        }

        a[href*="/source/"] {
            text-decoration: none !important;
            color: #6c757d !important; /* Soft gray for source links */
        }

        .brutal-grid {
            display: grid !important;
            grid-auto-flow: row !important;
            grid-template-columns: repeat(3, 1fr) !important;
        }

        div.about {
            max-width: 50% !important;
            margin-right: auto !important;
        }

        li {
            padding-bottom: 0.5rem !important;
        }

        .login-link {
            position: absolute !important;
            top: 0 !important;
            right: 0 !important;
            margin: 1em !important;
        }

        @media (max-width: 800px) {
            .brutal-grid {
                display: grid !important;
                grid-auto-flow: row !important;
                grid-template-columns: repeat(1, 1fr) !important;
            }
            div.about {
                max-width: 100% !important;
                margin: auto !important;
            }
            .banner {
                padding-top: 3em !important;
            }
        }

        /* Ensure links are readable */
        a:link {
            color: #0056b3 !important; /* Muted blue */
        }
        a:visited {
            color: #7f8c8d !important; /* Soft gray */
        }
    `);
    // Make all links open in new tab
    function setLinksToOpenInNewTab() {
        document.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer'); // security best practice
        });
    }

    // Run on load
    setLinksToOpenInNewTab();

    // Run again if the page dynamically changes (e.g., SPA navigation)
    const observer = new MutationObserver(setLinksToOpenInNewTab);
    observer.observe(document.body, { childList: true, subtree: true });


})();
