(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const switchButton = document.querySelector(".switch-block__switch-button");
    const premiumQuarterlyPrice = document.querySelector(".quarterly-premium-card-price");
    const premiumMonthlyPrice = document.querySelector(".monthly-premium-card-price");
    const ultimateQuarterlyPrice = document.querySelector(".quarterly-ultimate-card-price");
    const ultimateMonthlyPrice = document.querySelector(".monthly-ultimate-card-price");
    document.querySelector(".card");
    const basicCard = document.querySelector(".basic-card");
    const premiumCard = document.querySelector(".premium-card");
    const ultimateCard = document.querySelector(".ultimate-card");
    const pointPriceValue = document.querySelector(".point-price-value");
    const cardBasicPrice = document.querySelector(".basic-card-price");
    const greenLine = document.querySelector(".progressbar__green-line");
    switchButton.addEventListener("click", (function() {
        switchButton.classList.toggle("switch-block__button-switcher-right");
        switchButton.classList.toggle("switch-block__button-switcher-left");
        premiumQuarterlyPrice.classList.toggle("_hidden");
        premiumMonthlyPrice.classList.toggle("_hidden");
        ultimateQuarterlyPrice.classList.toggle("_hidden");
        ultimateMonthlyPrice.classList.toggle("_hidden");
        if (premiumCard.classList.contains("card-shadow") && switchButton.classList.contains("switch-block__button-switcher-right")) pointPriceValue.innerHTML = `${premiumQuarterlyPrice.textContent}`; else if (premiumCard.classList.contains("card-shadow") && switchButton.classList.contains("switch-block__button-switcher-left")) pointPriceValue.innerHTML = `${premiumMonthlyPrice.textContent}`; else if (ultimateCard.classList.contains("card-shadow") && switchButton.classList.contains("switch-block__button-switcher-right")) pointPriceValue.innerHTML = `${ultimateQuarterlyPrice.textContent}`; else if (ultimateCard.classList.contains("card-shadow") && switchButton.classList.contains("switch-block__button-switcher-left")) pointPriceValue.innerHTML = `${ultimateMonthlyPrice.textContent}`;
    }));
    const monthlyTextLabel = document.querySelector(".monthly-text-label");
    monthlyTextLabel.addEventListener("click", (function() {
        switchButton.classList.remove("switch-block__button-switcher-right");
        switchButton.classList.add("switch-block__button-switcher-left");
        premiumMonthlyPrice.classList.remove("_hidden");
        ultimateMonthlyPrice.classList.remove("_hidden");
        premiumQuarterlyPrice.classList.add("_hidden");
        ultimateQuarterlyPrice.classList.add("_hidden");
    }));
    const quarterlyTextLabel = document.querySelector(".quarterly-text-label");
    quarterlyTextLabel.addEventListener("click", (function() {
        switchButton.classList.add("switch-block__button-switcher-right");
        switchButton.classList.remove("switch-block__button-switcher-left");
        premiumMonthlyPrice.classList.add("_hidden");
        ultimateMonthlyPrice.classList.add("_hidden");
        premiumQuarterlyPrice.classList.remove("_hidden");
        ultimateQuarterlyPrice.classList.remove("_hidden");
    }));
    basicCard.addEventListener("mouseenter", (function(event) {
        const cardBasicPriceContent = cardBasicPrice.textContent;
        pointPriceValue.innerHTML = `${cardBasicPriceContent}`;
        premiumCard.classList.remove("card-shadow");
        ultimateCard.classList.remove("card-shadow");
        basicCard.classList.add("card-shadow");
        greenLine.classList.remove("green-line-width-percent_fifty");
        greenLine.classList.remove("green-line-width-percent_full");
        greenLine.classList.add("green-line-width-percent_null");
    }));
    premiumCard.addEventListener("mouseenter", (function(event) {
        const quarterlyPremiumCardContent = premiumQuarterlyPrice.textContent;
        const monthlyPremiumCardContent = premiumMonthlyPrice.textContent;
        if (switchButton.classList.contains("switch-block__button-switcher-right")) pointPriceValue.innerHTML = `${quarterlyPremiumCardContent}`; else if (switchButton.classList.contains("switch-block__button-switcher-left")) pointPriceValue.innerHTML = `${monthlyPremiumCardContent}`;
        ultimateCard.classList.remove("card-shadow");
        basicCard.classList.remove("card-shadow");
        premiumCard.classList.add("card-shadow");
        greenLine.classList.remove("green-line-width-percent_full");
        greenLine.classList.remove("green-line-width-percent_null");
        greenLine.classList.add("green-line-width-percent_fifty");
    }));
    ultimateCard.addEventListener("mouseenter", (function(event) {
        const quarterlyUltimateCardContent = ultimateQuarterlyPrice.textContent;
        const monthlyUltimateCardContent = ultimateMonthlyPrice.textContent;
        if (switchButton.classList.contains("switch-block__button-switcher-right")) pointPriceValue.innerHTML = `${quarterlyUltimateCardContent}`; else if (switchButton.classList.contains("switch-block__button-switcher-left")) pointPriceValue.innerHTML = `${monthlyUltimateCardContent}`;
        basicCard.classList.remove("card-shadow");
        premiumCard.classList.remove("card-shadow");
        ultimateCard.classList.add("card-shadow");
        greenLine.classList.remove("green-line-width-percent_null");
        greenLine.classList.remove("green-line-width-percent_fifty");
        greenLine.classList.add("green-line-width-percent_full");
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();