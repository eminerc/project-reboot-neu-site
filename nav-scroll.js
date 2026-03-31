(function () {
  var nav = document.querySelector(".site-nav");
  if (!nav) return;

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setNavHeight() {
    var h = Math.ceil(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--site-nav-h", h + "px");
  }

  setNavHeight();
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(setNavHeight).observe(nav);
  } else {
    window.addEventListener("resize", setNavHeight);
  }

  if (reduced) return;

  var lastY = window.scrollY || 0;
  var hidden = false;

  function scrollHideActive() {
    if (
      nav.classList.contains("join-await-reveal") &&
      !nav.classList.contains("join-await-reveal--shown")
    ) {
      return false;
    }
    return true;
  }

  function applyHidden(nextHidden) {
    if (!scrollHideActive()) {
      nav.classList.remove("site-nav--scroll-hidden");
      hidden = false;
      return;
    }
    if (nextHidden === hidden) return;
    hidden = nextHidden;
    nav.classList.toggle("site-nav--scroll-hidden", hidden);
  }

  function onScroll() {
    if (!scrollHideActive()) {
      nav.classList.remove("site-nav--scroll-hidden");
      hidden = false;
      lastY = window.scrollY || 0;
      return;
    }

    var y = window.scrollY || 0;
    var delta = y - lastY;
    lastY = y;

    var topThreshold = 10;
    if (y <= topThreshold) {
      applyHidden(false);
      return;
    }

    var moveThreshold = 8;
    if (delta > moveThreshold) {
      applyHidden(true);
    } else if (delta < -moveThreshold) {
      applyHidden(false);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (typeof MutationObserver !== "undefined") {
    var prevJoinShown = nav.classList.contains("join-await-reveal--shown");
    new MutationObserver(function () {
      var nowJoinShown = nav.classList.contains("join-await-reveal--shown");
      if (nowJoinShown && !prevJoinShown) {
        lastY = window.scrollY || 0;
        applyHidden(false);
      }
      prevJoinShown = nowJoinShown;
    }).observe(nav, { attributes: true, attributeFilter: ["class"] });
  }

  onScroll();
})();
