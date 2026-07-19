(function () {
  "use strict";

  var utils = window.SiteUtils;
  if (!utils) return;

  var records = utils.sortedRecords();
  var categories = utils.data.categories || [];
  var list = document.querySelector("#archive-list");
  var filter = document.querySelector("#archive-filter");
  var search = document.querySelector("#notes-search");
  var count = document.querySelector("#results-count");
  if (!list || !filter) return;

  var params = new URLSearchParams(window.location.search);
  var queryCategory = params.get("category");
  var activeCategory = categories.some(function (item) {
    return item.id === queryCategory;
  })
    ? queryCategory
    : "all";
  var keyword = (params.get("q") || "").trim().toLowerCase();
  if (search && keyword) search.value = params.get("q") || "";

  function renderFilters() {
    var options = [{ id: "all", name: "全部" }].concat(categories);
    filter.innerHTML = options
      .map(function (item) {
        var active = item.id === activeCategory;
        return (
          '<button class="filter-button' +
          (active ? " is-active" : "") +
          '" type="button" data-category="' +
          utils.escapeHTML(item.id) +
          '" aria-pressed="' +
          String(active) +
          '">' +
          utils.escapeHTML(item.name) +
          "</button>"
        );
      })
      .join("");
  }

  function recordMatches(record) {
    var categoryMatches = activeCategory === "all" || record.category === activeCategory;
    var textMatches = !keyword || utils.recordText(record).toLowerCase().indexOf(keyword) !== -1;
    return categoryMatches && textMatches;
  }

  function entryHTML(record) {
    var category = utils.categoryById(record.category) || { name: "记录" };
    return (
      '<a class="archive-entry" href="' +
      utils.articleHref("", record.id) +
      '">' +
      '<time datetime="' +
      utils.escapeHTML(record.date) +
      '">' +
      utils.escapeHTML(record.date.slice(5)) +
      "</time>" +
      '<span class="archive-entry-copy"><strong>' +
      utils.escapeHTML(record.title) +
      "</strong><small>" +
      utils.escapeHTML(record.summary) +
      "</small></span>" +
      '<span class="archive-entry-category">' +
      utils.escapeHTML(category.name) +
      "</span>" +
      "</a>"
    );
  }

  function renderList() {
    var visible = records.filter(recordMatches);
    if (count) count.textContent = "共 " + visible.length + " 篇记录";

    if (!visible.length) {
      list.innerHTML = '<div class="notes-empty">没有找到符合条件的记录，换一个关键词试试。</div>';
      return;
    }

    var years = [];
    var grouped = {};
    visible.forEach(function (record) {
      var year = String(record.date).slice(0, 4) || "其他";
      if (!grouped[year]) {
        grouped[year] = [];
        years.push(year);
      }
      grouped[year].push(record);
    });

    list.innerHTML = years
      .map(function (year) {
        return (
          '<section class="archive-year-group" aria-labelledby="archive-year-' +
          utils.escapeHTML(year) +
          '"><h2 class="archive-year" id="archive-year-' +
          utils.escapeHTML(year) +
          '">' +
          utils.escapeHTML(year) +
          '</h2><div class="archive-year-entries">' +
          grouped[year].map(entryHTML).join("") +
          "</div></section>"
        );
      })
      .join("");
  }

  filter.addEventListener("click", function (event) {
    var button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.getAttribute("data-category") || "all";
    renderFilters();
    renderList();
  });

  if (search) {
    search.addEventListener("input", function () {
      keyword = search.value.trim().toLowerCase();
      renderList();
    });

    Array.prototype.slice.call(document.querySelectorAll('a[href="#search"]')).forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(function () {
          search.focus();
        }, 0);
      });
    });
  }

  renderFilters();
  renderList();

  if (search && window.location.hash === "#search") {
    window.setTimeout(function () {
      search.focus();
    }, 0);
  }
})();
