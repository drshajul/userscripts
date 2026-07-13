// ==UserScript==
// @name         Social Feed Ad Cleaner
// @namespace    https://local.user.js/social-feed-ad-cleaner
// @version      1.1.0
// @description  Hide promoted/ad posts in Reddit and X/Twitter timelines.
// @author       personal
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/582158/Social%20Feed%20Ad%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/582158/Social%20Feed%20Ad%20Cleaner.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const host = location.hostname.replace(/^www\./, "");

  function normalizeText(value) {
    return value
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function appendStyle(id, css) {
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function startObserver(sweep) {
    sweep(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            sweep(node);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function startWhenReady(start) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
  }

  function runRedditCleaner() {
    const STYLE_ID = "sfac-reddit-style";
    const HIDDEN_ATTR = "data-sfac-reddit-hidden";
    const ROOT_ATTR = "data-sfac-reddit-running";

    const markerSelector = [
      "shreddit-ad-post",
      "shreddit-dynamic-ad-link",
      '[data-testid="promoted-credit-bar-avatar"]',
      '[aria-label^="Advertisement:"]',
      '[aria-label^="Ad:"]',
      "[promoted]",
      "[is-promoted]",
      ".promotedlink"
    ].join(",");

    const containerSelector = [
      "shreddit-ad-post",
      "shreddit-post",
      "article",
      ".thing",
      'div[data-testid="post-container"]'
    ].join(",");

    const promotedLabels = new Set([
      "promoted",
      "sponsored",
      "advertisement",
      "ad",
      "已推广",
      "推广",
      "廣告",
      "广告",
      "gesponsert",
      "sponsorise",
      "sponsorisé",
      "promocionado"
    ]);

    function installStyle() {
      appendStyle(
        STYLE_ID,
        `
          html[${ROOT_ATTR}="true"] shreddit-ad-post,
          html[${ROOT_ATTR}="true"] .promotedlink,
          html[${ROOT_ATTR}="true"] shreddit-feed > shreddit-ad-post,
          html[${ROOT_ATTR}="true"] shreddit-feed > .promotedlink,
          html[${ROOT_ATTR}="true"] [${HIDDEN_ATTR}="true"],
          shreddit-ad-post,
          .promotedlink {
            display: none !important;
          }

          html[${ROOT_ATTR}="true"] shreddit-feed > shreddit-post:has(shreddit-dynamic-ad-link),
          html[${ROOT_ATTR}="true"] shreddit-feed > article:has(shreddit-dynamic-ad-link),
          html[${ROOT_ATTR}="true"] shreddit-feed > shreddit-post:has([data-testid="promoted-credit-bar-avatar"]),
          html[${ROOT_ATTR}="true"] shreddit-feed > article:has([data-testid="promoted-credit-bar-avatar"]) {
            display: none !important;
          }
        `
      );
    }

    function closestContainer(node) {
      if (!(node instanceof Element)) return null;
      return node.matches(containerSelector) ? node : node.closest(containerSelector);
    }

    function hideContainer(container) {
      if (!container || container.getAttribute(HIDDEN_ATTR) === "true") return;
      container.setAttribute(HIDDEN_ATTR, "true");
    }

    function hideByMarkers(root) {
      const scope = root instanceof Element || root instanceof Document ? root : document;

      if (scope instanceof Element && scope.matches(markerSelector)) {
        hideContainer(closestContainer(scope));
      }

      scope.querySelectorAll(markerSelector).forEach((marker) => {
        hideContainer(closestContainer(marker));
      });
    }

    function hideByLabels(root) {
      const scope = root instanceof Element || root instanceof Document ? root : document;
      const candidates = scope.querySelectorAll(
        '[slot="credit-bar"], [data-testid*="promoted" i], a, span, div'
      );

      candidates.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        const text = normalizeText(node.innerText || node.textContent || "");
        if (!text || text.length > 40) return;

        if (promotedLabels.has(text) || /(^|[ .•|])promoted($|[ .•|])/.test(text)) {
          hideContainer(closestContainer(node));
        }
      });
    }

    function sweep(root) {
      document.documentElement.setAttribute(ROOT_ATTR, "true");
      installStyle();
      hideByMarkers(root);
      hideByLabels(root);
    }

    document.documentElement.setAttribute(ROOT_ATTR, "true");
    installStyle();
    startWhenReady(() => startObserver(sweep));
  }

  function runXCleaner() {
    const STYLE_ID = "sfac-x-style";
    const HIDDEN_ATTR = "data-sfac-x-hidden";
    const ROOT_ATTR = "data-sfac-x-running";

    const strongMarkerSelector = [
      '[data-testid="placementTracking"]',
      '[data-testid="promotedIndicator"]',
      '[data-testid*="promoted" i]',
      '[aria-label="Promoted"]',
      '[aria-label="广告"]',
      '[aria-label="廣告"]'
    ].join(",");

    const tweetSelector = [
      'article[data-testid="tweet"]',
      'article[role="article"]',
      '[data-testid="tweet"]'
    ].join(",");

    const cellSelector = [
      '[data-testid="cellInnerDiv"]',
      'article[data-testid="tweet"]',
      'article[role="article"]',
      '[data-testid="tweet"]'
    ].join(",");

    const promotedLabels = new Set([
      "ad",
      "ads",
      "promoted",
      "sponsored",
      "广告",
      "廣告",
      "推广",
      "已推广",
      "promocionado",
      "gesponsert",
      "sponsorise",
      "sponsorisé"
    ]);

    function installStyle() {
      appendStyle(
        STYLE_ID,
        `
          html[${ROOT_ATTR}="true"] [${HIDDEN_ATTR}="true"],
          html[${ROOT_ATTR}="true"] [data-testid="cellInnerDiv"]:has([data-testid="placementTracking"]),
          html[${ROOT_ATTR}="true"] article[data-testid="tweet"]:has([data-testid="placementTracking"]),
          html[${ROOT_ATTR}="true"] article[role="article"]:has([data-testid="placementTracking"]),
          html[${ROOT_ATTR}="true"] [data-testid="cellInnerDiv"]:has([data-testid*="promoted" i]),
          html[${ROOT_ATTR}="true"] article[data-testid="tweet"]:has([data-testid*="promoted" i]) {
            display: none !important;
          }
        `
      );
    }

    function closestCell(node) {
      if (!(node instanceof Element)) return null;
      return node.closest(cellSelector);
    }

    function hideCell(cell) {
      if (!cell || cell.getAttribute(HIDDEN_ATTR) === "true") return;
      cell.setAttribute(HIDDEN_ATTR, "true");
    }

    function hideByStrongMarkers(root) {
      const scope = root instanceof Element || root instanceof Document ? root : document;

      if (scope instanceof Element && scope.matches(strongMarkerSelector)) {
        hideCell(closestCell(scope));
      }

      scope.querySelectorAll(strongMarkerSelector).forEach((marker) => {
        hideCell(closestCell(marker));
      });
    }

    function isSmallStandaloneLabel(node) {
      const text = normalizeText(node.innerText || node.textContent || "");
      if (!promotedLabels.has(text)) return false;
      if (text.length > 20) return false;

      const box = node.getBoundingClientRect();
      return box.width <= 120 && box.height <= 40;
    }

    function hideByTextLabels(root) {
      const scope = root instanceof Element || root instanceof Document ? root : document;
      const tweets = [];

      if (scope instanceof Element && scope.matches(tweetSelector)) {
        tweets.push(scope);
      }

      scope.querySelectorAll(tweetSelector).forEach((tweet) => {
        tweets.push(tweet);
      });

      tweets.forEach((tweet) => {
        const candidates = tweet.querySelectorAll(
          'span, div[dir="ltr"], div[dir="auto"], [aria-label]'
        );

        for (const node of candidates) {
          if (!(node instanceof HTMLElement)) continue;
          if (isSmallStandaloneLabel(node)) {
            hideCell(closestCell(tweet));
            break;
          }
        }
      });
    }

    function sweep(root) {
      document.documentElement.setAttribute(ROOT_ATTR, "true");
      installStyle();
      hideByStrongMarkers(root);
      hideByTextLabels(root);
    }

    document.documentElement.setAttribute(ROOT_ATTR, "true");
    installStyle();
    startWhenReady(() => startObserver(sweep));
  }

  if (host === "reddit.com" || host === "new.reddit.com") {
    runRedditCleaner();
    return;
  }

  if (host === "x.com" || host === "twitter.com") {
    runXCleaner();
  }
})();
