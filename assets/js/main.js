(function () {
  "use strict";

  var utils = window.SiteUtils;
  if (!utils) return;

  var feed = document.querySelector("#post-feed");
  if (!feed) return;

  var records = utils.sortedRecords();
  if (!records.length) {
    feed.innerHTML = '<div class="empty-state">这里还没有文章，第一篇就从今天开始。</div>';
    return;
  }

  function tagsHTML(tags) {
    return (tags || [])
      .slice(0, 3)
      .map(function (tag) {
        return '<span class="tag"># ' + utils.escapeHTML(tag) + "</span>";
      })
      .join("");
  }

  feed.innerHTML = records
    .map(function (record) {
      var category = utils.categoryById(record.category) || {
        id: "daily",
        number: "--",
        name: "记录",
        shortName: "记录",
      };
      var href = utils.articleHref("notes/", record.id);
      return (
        '<article class="post-card" data-category="' +
        utils.escapeHTML(category.id) +
        '">' +
        '<a class="post-cover" href="' +
        href +
        '" aria-label="阅读：' +
        utils.escapeHTML(record.title) +
        '">' +
        '<span class="cover-grid" aria-hidden="true"></span>' +
        '<span class="cover-label">' +
        utils.escapeHTML(category.shortName || category.name) +
        "</span>" +
        '<strong class="cover-number">' +
        utils.escapeHTML(category.number || "--") +
        "</strong>" +
        '<span class="cover-word">LOG</span>' +
        "</a>" +
        '<div class="post-card-content">' +
        '<a class="post-category" href="notes/index.html?category=' +
        encodeURIComponent(category.id) +
        '">' +
        utils.escapeHTML(category.name) +
        "</a>" +
        '<h2><a href="' +
        href +
        '">' +
        utils.escapeHTML(record.title) +
        "</a></h2>" +
        '<div class="post-meta"><time datetime="' +
        utils.escapeHTML(record.date) +
        '">' +
        utils.escapeHTML(utils.formatDate(record.date)) +
        "</time><span>·</span><span>" +
        utils.escapeHTML(utils.readingTime(record)) +
        "</span></div>" +
        "<p>" +
        utils.escapeHTML(record.summary) +
        "</p>" +
        '<div class="tag-list">' +
        tagsHTML(record.tags) +
        "</div>" +
        "</div>" +
        "</article>"
      );
    })
    .join("");
})();
