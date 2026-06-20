(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(function () {
        bindNavigation();
        bindHero();
        bindFilters();
        bindImageFallbacks();
    });

    function bindNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-nav-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
            document.body.classList.toggle("nav-open");
        });
    }

    function bindHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function bindFilters() {
        var sections = Array.prototype.slice.call(document.querySelectorAll(".content-section, .quick-search-inner"));
        sections.forEach(function (section) {
            var input = section.querySelector("[data-filter-input]");
            var cards = Array.prototype.slice.call(section.querySelectorAll("[data-card]"));
            var buttons = Array.prototype.slice.call(section.querySelectorAll("[data-filter-button]"));
            var empty = section.querySelector("[data-empty-state]");
            if (!cards.length || (!input && !buttons.length)) {
                return;
            }
            var activeValue = "";
            function normalize(value) {
                return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
            }
            function apply() {
                var query = normalize(input ? input.value : "");
                var activeWords = normalize(activeValue).split(" ").filter(Boolean);
                var visible = 0;
                cards.forEach(function (card) {
                    var content = normalize((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || "") + " " + card.textContent);
                    var matchedQuery = !query || content.indexOf(query) !== -1;
                    var matchedChip = !activeWords.length || activeWords.some(function (word) {
                        return content.indexOf(word) !== -1;
                    });
                    var matched = matchedQuery && matchedChip;
                    card.classList.toggle("is-hidden-card", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }
            if (input) {
                input.addEventListener("input", apply);
            }
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    buttons.forEach(function (item) {
                        item.classList.remove("active");
                    });
                    button.classList.add("active");
                    activeValue = button.getAttribute("data-filter-value") || "";
                    apply();
                });
            });
        });
    }

    function bindImageFallbacks() {
        var images = Array.prototype.slice.call(document.querySelectorAll("img"));
        images.forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("is-missing-image");
            });
        });
    }
})();
