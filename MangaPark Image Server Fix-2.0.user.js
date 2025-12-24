// ==UserScript==
// @name         MangaPark Image Server Fix
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Auto-cycle through image servers on MangaPark
// @match        https://mangapark.com/*
// @match        https://*.mangapark.com/*
// @match        https://mangapark.net/*
// @match        https://*.mangapark.net/*
// @match        https://mangapark.org/*
// @match        https://*.mangapark.org/*
// @match        https://mangapark.me/*
// @match        https://*.mangapark.me/*
// @match        https://mangapark.io/*
// @match        https://*.mangapark.io/*
// @match        https://mangapark.to/*
// @match        https://*.mangapark.to/*
// @match        https://comicpark.org/*
// @match        https://*.comicpark.org/*
// @match        https://comicpark.to/*
// @match        https://*.comicpark.to/*
// @match        https://readpark.org/*
// @match        https://*.readpark.org/*
// @match        https://readpark.net/*
// @match        https://*.readpark.net/*
// @match        https://parkmanga.com/*
// @match        https://*.parkmanga.com/*
// @match        https://parkmanga.net/*
// @match        https://*.parkmanga.net/*
// @match        https://parkmanga.org/*
// @match        https://*.parkmanga.org/*
// @match        https://mpark.to/*
// @match        https://*.mpark.to/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SERVERS = ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'];
    const PREFERRED_SERVER = 's04';
    const attemptedServers = new WeakMap();

    function getNextServer(img) {
        const tried = attemptedServers.get(img) || [];
        const available = SERVERS.filter(s => !tried.includes(s));
        
        if (available.length === 0) return null;
        
        if (available.includes(PREFERRED_SERVER)) {
            return PREFERRED_SERVER;
        }
        return available[0];
    }

    function markServerTried(img, server) {
        const tried = attemptedServers.get(img) || [];
        tried.push(server);
        attemptedServers.set(img, tried);
    }

    function getCurrentServer(src) {
        const match = src.match(/https:\/\/(s[0-9]{2})\./);
        return match ? match[1] : null;
    }

    function tryNextServer(img) {
        const currentServer = getCurrentServer(img.src);
        if (!currentServer) return false;

        markServerTried(img, currentServer);

        const nextServer = getNextServer(img);
        if (!nextServer) {
            console.log(`[MangaPark Fix] All servers exhausted for:`, img.src);
            return false;
        }

        console.log(`[MangaPark Fix] Switching ${currentServer} → ${nextServer}`);
        img.src = img.src.replace(/s[0-9]{2}/, nextServer);
        return true;
    }

    function setupErrorHandler(img) {
        if (img.dataset.mpfixHandled) return;
        img.dataset.mpfixHandled = 'true';

        img.addEventListener('error', function() {
            if (/https:\/\/s[0-9]{2}/.test(img.src)) {
                tryNextServer(img);
            }
        });
    }

    function processImages() {
        document.querySelectorAll("img").forEach(img => {
            if (/https:\/\/s[0-9]{2}/.test(img.src)) {
                setupErrorHandler(img);

                if (img.complete && img.naturalHeight === 0) {
                    tryNextServer(img);
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processImages);
    } else {
        processImages();
    }

    const observer = new MutationObserver(processImages);
    
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 50);
        }
    }
    startObserver();

    let checks = 0;
    const interval = setInterval(() => {
        processImages();
        checks++;
        if (checks >= 30) clearInterval(interval);
    }, 1000);

})();