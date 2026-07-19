(function () {
  "use strict";

  var utils = window.SiteUtils;
  if (!utils) return;

  var id = new URLSearchParams(window.location.search).get("id") || "";
  var records = utils.sortedRecords();
  var record = records.find(function (item) {
    return item.id === id;
  });
  var articleView = document.querySelector("#article-view");
  var missingView = document.querySelector("#article-missing");

  if (!record) {
    if (articleView) articleView.hidden = true;
    if (missingView) missingView.hidden = false;
    document.title = "记录不存在 · " + (utils.data.owner.name || "个人记录");
    return;
  }

  var category = utils.categoryById(record.category) || { id: "all", name: "个人记录" };
  var hero = document.querySelector("#article-hero");
  if (hero) hero.setAttribute("data-category", category.id);
  document.title = record.title + " · " + (utils.data.owner.name || "个人记录");
  var descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", record.summary);

  var title = document.querySelector("#article-title");
  var summary = document.querySelector("#article-summary");
  var date = document.querySelector("#article-date");
  var reading = document.querySelector("#article-reading-time");
  var categoryLink = document.querySelector("#article-category");
  var tags = document.querySelector("#article-tags");
  var content = document.querySelector("#article-content");
  var toc = document.querySelector("#article-toc");

  if (title) title.textContent = record.title;
  if (summary) summary.textContent = record.summary;
  if (date) {
    date.textContent = utils.formatDate(record.date);
    date.setAttribute("datetime", record.date);
  }
  if (reading) reading.textContent = utils.readingTime(record);
  if (categoryLink) {
    categoryLink.textContent = category.name;
    categoryLink.setAttribute("href", "index.html?category=" + encodeURIComponent(category.id));
  }
  if (tags) {
    (record.tags || []).forEach(function (tag) {
      var item = document.createElement("span");
      item.className = "tag";
      item.textContent = tag;
      tags.appendChild(item);
    });
  }

  (record.sections || []).forEach(function (section, index) {
    var sectionElement = document.createElement("section");
    var heading = document.createElement("h2");
    var headingId = "section-" + (index + 1);
    heading.id = headingId;
    heading.textContent = section.title || "第 " + (index + 1) + " 部分";
    sectionElement.appendChild(heading);

    (section.paragraphs || []).forEach(function (paragraph) {
      var p = document.createElement("p");
      p.textContent = paragraph;
      sectionElement.appendChild(p);
    });

    if (Array.isArray(section.list) && section.list.length) {
      var list = document.createElement(section.ordered ? "ol" : "ul");
      section.list.forEach(function (value) {
        var item = document.createElement("li");
        item.textContent = value;
        list.appendChild(item);
      });
      sectionElement.appendChild(list);
    }

    if (section.quote) {
      var quote = document.createElement("blockquote");
      quote.textContent = section.quote;
      sectionElement.appendChild(quote);
    }

    if (content) content.appendChild(sectionElement);
    if (toc) {
      var link = document.createElement("a");
      link.href = "#" + headingId;
      link.textContent = heading.textContent;
      toc.appendChild(link);
    }
  });

  var navigation = document.querySelector("#article-navigation");
  if (navigation) {
    var index = records.indexOf(record);
    var newer = index > 0 ? records[index - 1] : null;
    var older = index < records.length - 1 ? records[index + 1] : null;

    function navigationLink(item, label, direction) {
      if (!item) return '<span class="article-nav-empty"></span>';
      return (
        '<a class="article-nav-link ' +
        direction +
        '" href="' +
        utils.articleHref("", item.id) +
        '"><small>' +
        label +
        "</small><strong>" +
        utils.escapeHTML(item.title) +
        "</strong></a>"
      );
    }

    navigation.innerHTML =
      navigationLink(newer, "更新一篇", "newer") + navigationLink(older, "更早一篇", "older");
  }
})();
