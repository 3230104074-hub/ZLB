(function () {
  "use strict";

  var data = window.SITE_DATA || { owner: {}, categories: [] };
  var records = Array.isArray(window.RECORDS) ? window.RECORDS : [];
  var toastTimer;

  function select(selector, root) {
    return (root || document).querySelector(selector);
  }

  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function categoryById(id) {
    return (data.categories || []).find(function (category) {
      return category.id === id;
    });
  }

  function sortedRecords() {
    return records.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
  }

  function formatDate(value) {
    var parts = String(value || "").split("-");
    if (parts.length !== 3) return String(value || "");
    return parts[0] + "年" + Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function recordText(record) {
    var fragments = [record.title, record.summary].concat(record.tags || []);
    (record.sections || []).forEach(function (section) {
      fragments.push(section.title || "");
      fragments = fragments.concat(section.paragraphs || [], section.list || []);
      if (section.quote) fragments.push(section.quote);
    });
    return fragments.join(" ");
  }

  function readingTime(record) {
    var length = recordText(record).replace(/\s/g, "").length;
    return Math.max(1, Math.ceil(length / 350)) + " 分钟阅读";
  }

  function articleHref(prefix, id) {
    return (prefix || "") + "article.html?id=" + encodeURIComponent(id);
  }

  function showToast(message) {
    var toast = select(".toast");
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  function hydrateOwner() {
    var owner = data.owner || {};
    selectAll("[data-owner-name]").forEach(function (element) {
      element.textContent = owner.name || "个人记录";
    });
    selectAll("[data-owner-initials]").forEach(function (element) {
      element.textContent = owner.initials || "ME";
    });
    selectAll("[data-owner-intro]").forEach(function (element) {
      element.textContent = owner.intro || "记录学习与生活。";
    });
    selectAll("[data-owner-email]").forEach(function (element) {
      element.textContent = owner.email || "";
    });
    selectAll("[data-email-link]").forEach(function (link) {
      link.setAttribute("href", "mailto:" + (owner.email || ""));
    });

    selectAll("[data-github-link]").forEach(function (link) {
      if (owner.githubUrl) {
        link.setAttribute("href", owner.githubUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noreferrer");
      } else {
        link.setAttribute("href", "#");
        link.setAttribute("data-github-placeholder", "true");
        link.setAttribute("aria-label", "GitHub 地址尚未填写");
      }
    });
  }

  function hydrateCategories() {
    (data.categories || []).forEach(function (category) {
      selectAll('[data-category-name="' + category.id + '"]').forEach(function (element) {
        element.textContent = category.name;
      });
      selectAll('[data-category-short-name="' + category.id + '"]').forEach(function (element) {
        element.textContent = category.shortName || category.name;
      });
      selectAll('[data-category-number="' + category.id + '"]').forEach(function (element) {
        element.textContent = category.number;
      });
      selectAll('[data-category-description="' + category.id + '"]').forEach(function (element) {
        element.textContent = category.description;
      });
    });
  }

  function hydrateMetadata() {
    var owner = data.owner || {};
    var site = data.site || {};
    var page = document.body.getAttribute("data-page") || "";
    var pageTitle = site.title || owner.name || "个人记录";
    var pageDescription = site.description || owner.intro || "记录学习与生活。";

    selectAll("[data-site-title]").forEach(function (element) {
      element.textContent = site.title || owner.name || "个人记录";
    });
    selectAll("[data-site-description]").forEach(function (element) {
      element.textContent = pageDescription;
    });

    if (page === "archive") {
      pageTitle = "文章归档 · " + (owner.name || "个人记录");
      pageDescription = (owner.name || "我") + "的课程、训练、科研与每日记录归档。";
    }
    if (page === "article") {
      pageTitle = "文章 · " + (owner.name || "个人记录");
      pageDescription = (owner.name || "我") + "的个人记录。";
    }
    if (page === "not-found") pageTitle = "页面未找到 · " + (owner.name || "个人记录");

    document.title = pageTitle;
    var descriptionMeta = select('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute("content", pageDescription);
    var ogTitle = select('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", pageTitle);
    var ogDescription = select('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", pageDescription);
  }

  function renderSidebars() {
    var sorted = sortedRecords();
    var categories = data.categories || [];
    var tags = [];
    sorted.forEach(function (record) {
      (record.tags || []).forEach(function (tag) {
        if (tags.indexOf(tag) === -1) tags.push(tag);
      });
    });

    setAllText("[data-record-total]", String(sorted.length));
    setAllText("[data-category-total]", String(categories.length));
    setAllText("[data-tag-total]", String(tags.length));

    var page = document.body.getAttribute("data-page") || "";
    var notesBase = page === "home" || page === "not-found" ? "notes/" : "";

    selectAll("[data-sidebar-categories]").forEach(function (container) {
      container.innerHTML = categories
        .map(function (category) {
          var count = sorted.filter(function (record) {
            return record.category === category.id;
          }).length;
          return (
            '<a href="' +
            notesBase +
            'index.html?category=' +
            encodeURIComponent(category.id) +
            '"><span><i class="category-dot" data-category="' +
            escapeHTML(category.id) +
            '" aria-hidden="true"></i>' +
            escapeHTML(category.name) +
            "</span><strong>" +
            count +
            "</strong></a>"
          );
        })
        .join("");
    });

    selectAll("[data-sidebar-recent]").forEach(function (container) {
      container.innerHTML = sorted
        .slice(0, 5)
        .map(function (record) {
          var category = categoryById(record.category) || { name: "记录" };
          return (
            '<a href="' +
            articleHref(notesBase, record.id) +
            '"><time datetime="' +
            escapeHTML(record.date) +
            '">' +
            escapeHTML(record.date.slice(5)) +
            '</time><span><strong>' +
            escapeHTML(record.title) +
            "</strong><small>" +
            escapeHTML(category.name) +
            "</small></span></a>"
          );
        })
        .join("");
    });
  }

  function setupTheme() {
    var button = select(".theme-toggle");
    var icon = select(".theme-icon");
    var themeMeta = select('meta[name="theme-color"]');
    var storedTheme = null;

    try {
      storedTheme = window.localStorage.getItem("zlb-site-theme");
    } catch (error) {
      storedTheme = null;
    }

    var theme =
      storedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    function applyTheme(nextTheme) {
      var dark = nextTheme === "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      if (icon) icon.textContent = dark ? "☀" : "☾";
      if (button) {
        button.setAttribute("aria-label", dark ? "切换浅色模式" : "切换深色模式");
        button.setAttribute("title", dark ? "切换浅色模式" : "切换深色模式");
      }
      if (themeMeta) themeMeta.setAttribute("content", dark ? "#071a2f" : "#0b4f9f");
    }

    applyTheme(theme);
    if (button) {
      button.addEventListener("click", function () {
        theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(theme);
        try {
          window.localStorage.setItem("zlb-site-theme", theme);
        } catch (error) {
          /* 当前页面仍会保持所选主题。 */
        }
      });
    }
  }

  function setupMobileNavigation() {
    var toggle = select(".menu-toggle");
    var nav = select("#mobile-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      nav.hidden = !open;
      document.body.classList.toggle("menu-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    selectAll("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !nav.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && !nav.hidden) setOpen(false);
    });
  }

  function setupPageActions() {
    var header = select(".site-header");
    var backToTop = select(".back-to-top");

    function updateScrollState() {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 10);
      if (backToTop) backToTop.classList.toggle("is-visible", y > 650);
    }

    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    document.addEventListener("click", function (event) {
      var githubLink = event.target.closest("[data-github-placeholder]");
      if (githubLink) {
        event.preventDefault();
        showToast("GitHub 地址尚未填写，可在 site-config.js 中添加");
      }
    });

    var copyButton = select(".copy-email");
    if (copyButton) {
      copyButton.addEventListener("click", function () {
        var email = (data.owner || {}).email || "";
        function success() {
          showToast("邮箱已复制：" + email);
          copyButton.textContent = "已复制";
          window.setTimeout(function () {
            copyButton.textContent = "复制邮箱";
          }, 1600);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(email).then(success).catch(function () {
            showToast("请手动复制：" + email);
          });
          return;
        }

        var textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          success();
        } catch (error) {
          showToast("请手动复制：" + email);
        }
        textarea.remove();
      });
    }
  }

  function addStructuredData() {
    var owner = data.owner || {};
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: owner.name,
      description: owner.intro,
      email: owner.email,
      sameAs: owner.githubUrl ? [owner.githubUrl] : [],
    });
    document.head.appendChild(script);
  }

  window.SiteUtils = {
    data: data,
    records: records,
    escapeHTML: escapeHTML,
    categoryById: categoryById,
    sortedRecords: sortedRecords,
    formatDate: formatDate,
    recordText: recordText,
    readingTime: readingTime,
    articleHref: articleHref,
    showToast: showToast,
  };

  hydrateOwner();
  hydrateCategories();
  hydrateMetadata();
  renderSidebars();
  setupTheme();
  setupMobileNavigation();
  setupPageActions();
  addStructuredData();

  var year = select("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
