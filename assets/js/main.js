/* Roster — interactions. Vanilla JS, progressive enhancement over server-rendered HTML. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── mobile menu ─────────────────────────────────────────────── */
  var menuBtn = $("[data-menu-toggle]");
  var menu = $("[data-menu]");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () { menu.classList.toggle("is-open"); });
  }

  /* ── whole-row click navigation (ignore real links/buttons) ──── */
  $$("[data-href]").forEach(function (row) {
    row.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      window.location = row.getAttribute("data-href");
    });
  });

  /* ── home: stream tabs + load more ───────────────────────────── */
  var tabsBar = $("[data-tabs]");
  var homeFeed = tabsBar ? $("[data-feed]") : null;
  if (tabsBar && homeFeed) {
    var rows = $$(".row", homeFeed);
    var loadBtn = $("[data-load-more]");
    var stream = "Latest";
    var shown = parseInt(homeFeed.getAttribute("data-shown"), 10) || 5;

    var renderHome = function () {
      var count = 0;
      rows.forEach(function (row) {
        var match = stream === "Latest" || row.getAttribute("data-category") === stream;
        if (match && count < shown) { row.classList.remove("is-hidden"); count++; }
        else { row.classList.add("is-hidden"); }
      });
      var total = rows.filter(function (row) {
        return stream === "Latest" || row.getAttribute("data-category") === stream;
      }).length;
      if (loadBtn) loadBtn.parentNode.classList.toggle("is-hidden", shown >= total);
    };

    $$(".tabs__tab", tabsBar).forEach(function (tab) {
      tab.addEventListener("click", function () {
        $$(".tabs__tab", tabsBar).forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        stream = tab.getAttribute("data-tab");
        shown = 5;
        renderHome();
      });
    });
    if (loadBtn) loadBtn.addEventListener("click", function () { shown += 4; renderHome(); });
    renderHome();
  }

  /* ── listing: tag filter + sort ──────────────────────────────── */
  var filterBar = $("[data-filter]");
  if (filterBar) {
    var listFeed = $$("[data-feed]").filter(function (f) { return f !== homeFeed; })[0] || $("[data-feed]");
    if (listFeed) {
      var listRows = $$(".row", listFeed);
      var activeTag = "__all";
      var sort = "new";

      var applyFilter = function () {
        listRows.forEach(function (row) {
          var tags = (row.getAttribute("data-tags") || "").split(" ");
          var show = activeTag === "__all" || tags.indexOf(activeTag) !== -1;
          row.classList.toggle("is-hidden", !show);
        });
      };
      var applySort = function () {
        var sorted = listRows.slice().sort(function (a, b) {
          var da = a.getAttribute("data-date"), db = b.getAttribute("data-date");
          return sort === "new" ? db.localeCompare(da) : da.localeCompare(db);
        });
        sorted.forEach(function (row) { listFeed.appendChild(row); });
      };

      $$(".filter-chip", filterBar).forEach(function (chip) {
        chip.addEventListener("click", function () {
          $$(".filter-chip", filterBar).forEach(function (c) { c.classList.remove("is-active"); });
          chip.classList.add("is-active");
          activeTag = chip.getAttribute("data-tag");
          applyFilter();
        });
      });
      var sortBtn = $("[data-sort]");
      if (sortBtn) sortBtn.addEventListener("click", function () {
        sort = sort === "new" ? "old" : "new";
        sortBtn.textContent = "sort: " + (sort === "new" ? "newest" : "oldest") + " ▾";
        applySort();
      });
    }
  }

  /* ── article: reading progress, scroll-spy TOC, back-to-top ──── */
  var progressBar = $("[data-progress-bar]");
  var toTop = $("[data-to-top]");
  var tocItems = $$("[data-toc]");
  if (progressBar || toTop || tocItems.length) {
    var headings = tocItems.map(function (item) {
      return { item: item, el: document.getElementById(item.getAttribute("data-toc")) };
    }).filter(function (h) { return h.el; });

    var onScroll = function () {
      var doc = document.documentElement;
      var top = doc.scrollTop || document.body.scrollTop;
      var h = doc.scrollHeight - doc.clientHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, top / h)) : 0;
      if (progressBar) progressBar.style.width = (p * 100) + "%";
      if (toTop) toTop.classList.toggle("is-visible", p > 0.1);
      if (headings.length) {
        var cur = headings[0].item;
        headings.forEach(function (hd) {
          if (hd.el.getBoundingClientRect().top < 160) cur = hd.item;
        });
        tocItems.forEach(function (it) { it.classList.toggle("is-active", it === cur); });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ── article: Share / Save niceties ──────────────────────────── */
  var shareBtn = $("[data-share]");
  if (shareBtn) shareBtn.addEventListener("click", function () {
    if (navigator.share) { navigator.share({ title: document.title, url: location.href }).catch(function () {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(location.href); shareBtn.textContent = "Copied"; setTimeout(function () { shareBtn.textContent = "Share"; }, 1500); }
  });

  /* ── ⌘K search ───────────────────────────────────────────────── */
  var searchEl = $("[data-search]");
  if (searchEl) {
    var input = $("[data-search-input]", searchEl);
    var results = $("[data-search-results]", searchEl);
    var indexURL = searchEl.getAttribute("data-index");
    var data = null, activeIdx = -1, shownRows = [];

    var thumbStyle = function (item) {
      if (item.thumb) return "background-image:url('" + item.thumb + "');background-size:cover;background-position:center;";
      var h2 = (item.hue + 38) % 360;
      return "background:linear-gradient(135deg,hsl(" + item.hue + ",34%,86%),hsl(" + h2 + ",40%,78%));";
    };
    var escapeHtml = function (s) { return (s || "").replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

    var render = function (q) {
      if (!data) return;
      var ql = q.trim().toLowerCase();
      var list = ql ? data.filter(function (p) {
        return (p.title + " " + p.deck + " " + (p.tags || []).join(" ") + " " + p.cat).toLowerCase().indexOf(ql) !== -1;
      }) : data.slice(0, 5);
      shownRows = list; activeIdx = -1;
      if (!list.length) { results.innerHTML = '<div class="search__empty">No posts match “' + escapeHtml(q) + '”.</div>'; return; }
      results.innerHTML = list.map(function (p, i) {
        return '<a class="search__row" href="' + p.url + '" data-i="' + i + '">' +
          '<span class="search__thumb thumb" style="' + thumbStyle(p) + '"></span>' +
          '<span style="flex:1;min-width:0;">' +
          '<span class="search__row-title">' + escapeHtml(p.title) + '</span>' +
          '<span class="search__row-meta" style="display:block;">' + escapeHtml(p.cat) + " · " + p.min + " min</span>" +
          "</span></a>";
      }).join("");
    };

    var openSearch = function () {
      searchEl.classList.add("is-open");
      searchEl.setAttribute("aria-hidden", "false");
      input.value = "";
      var doRender = function () { render(""); setTimeout(function () { input.focus(); }, 30); };
      if (data) { doRender(); }
      else if (indexURL) {
        fetch(indexURL).then(function (r) { return r.json(); }).then(function (j) { data = j; doRender(); }).catch(function () {});
      }
    };
    var closeSearch = function () { searchEl.classList.remove("is-open"); searchEl.setAttribute("aria-hidden", "true"); };

    $$("[data-search-open]").forEach(function (b) { b.addEventListener("click", openSearch); });
    searchEl.addEventListener("click", function (e) { if (e.target === searchEl) closeSearch(); });
    input.addEventListener("input", function () { render(input.value); });

    var setActive = function (i) {
      var rowsEls = $$(".search__row", results);
      if (!rowsEls.length) return;
      activeIdx = (i + rowsEls.length) % rowsEls.length;
      rowsEls.forEach(function (r, k) { r.classList.toggle("is-active", k === activeIdx); });
      rowsEls[activeIdx].scrollIntoView({ block: "nearest" });
    };

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return; }
      if (!searchEl.classList.contains("is-open")) return;
      if (e.key === "Escape") { closeSearch(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeIdx + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeIdx - 1); }
      else if (e.key === "Enter" && activeIdx >= 0 && shownRows[activeIdx]) { window.location = shownRows[activeIdx].url; }
    });
  }
})();
