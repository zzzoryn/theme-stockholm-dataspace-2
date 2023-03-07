(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  if (!window.$$.page) {
    window.$$.page = {
      /**
       * Is home page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isHomePage: function isHomePage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /^http(s)?:\/\/[^\/?#]+(\/hc(\/[a-z-_]+)?(\/)?([?]([^?\/]+)?)?([#]([^#\/]+)?)?)?$/.test(url);
      },

      /**
       * Is category page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isCategoryPage: function isCategoryPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?categories\//i.test(url);
      },

      /**
       * Is section page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isSectionPage: function isSectionPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?sections\//i.test(url);
      },

      /**
       * Is article page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isArticlePage: function isArticlePage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?articles\//i.test(url);
      },

      /**
       * Is search results page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isSearchResultsPage: function isSearchResultsPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?search\?*.*/i.test(url);
      },

      /**
       * Is contributions posts page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isContributionsPostsPage: function isContributionsPostsPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?contributions\/posts(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is contributions community comments page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isContributionsCommunityCommentsPage: function isContributionsCommunityCommentsPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?contributions\/community_comments(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is contributions community comments page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isContributionsCommentsPage: function isContributionsCommentsPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?contributions\/comments(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is following page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isFollowingPage: function isFollowingPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?subscriptions(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is request list page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isRequestListPage: function isRequestListPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?requests(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is request page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isRequestPage: function isRequestPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return !this.isNewRequestPage(url) && /\/hc\/([a-z-]+\/)?requests\/[^/?#]+(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is new request page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isNewRequestPage: function isNewRequestPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?requests\/new(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is community topic list page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isCommunityTopicListPage: function isCommunityTopicListPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?community\/topics(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is community topic page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isCommunityTopicPage: function isCommunityTopicPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?community\/topics\/[^\/?#]+(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is community post list page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isCommunityPostListPage: function isCommunityPostListPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?community\/posts(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is community post page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isCommunityPostPage: function isCommunityPostPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return !this.isNewCommunityPostPage(url) && /\/hc\/([a-z-]+\/)?community\/posts\/[^\/?#]+(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is new community post page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isNewCommunityPostPage: function isNewCommunityPostPage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?community\/posts\/new(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Is user profile page
       * @param {string?} pageUrl: page url
       * @return {boolean}
       */
      isUserProfilePage: function isUserProfilePage(pageUrl) {
        var url = pageUrl || window.location.href;
        return /\/hc\/([a-z-]+\/)?profiles\/[^\/?#]+(\/)?([?#].*)?$/i.test(url);
      },

      /**
       * Get page ID
       * @param {string?} pageUrl: page url
       * @return {number | null}: page ID or null
       */
      getPageId: function getPageId(pageUrl) {
        var url = pageUrl || window.location.href;
        var links = url.split('/');
        var result = links[links.length - 1];
        return parseInt(result, 10) || null;
      },

      /**
       * Get category ID
       * @param {string?} url: page url
       * @return {number | null}: category ID or null
       */
      getCategoryId: function getCategoryId(url) {
        if (this.isCategoryPage(url)) {
          return this.getPageId(url);
        } else if (!url) {
          var $breadcrumbsItems = $('.breadcrumbs li');

          for (var i = 0; i < $breadcrumbsItems.length; i++) {
            var linkUrl = $breadcrumbsItems.eq(i).find('a').attr('href');

            if (linkUrl && this.isCategoryPage(linkUrl)) {
              return this.getPageId(linkUrl);
            }
          }
        }

        return null;
      },

      /**
       * Get section ID
       * @param {string?} url: page url
       * @return {number | null}: section ID or null
       */
      getSectionId: function getSectionId(url) {
        if (this.isSectionPage(url)) {
          return this.getPageId(url);
        } else if (!url) {
          var $breadcrumbsItems = $('.breadcrumbs li');

          for (var i = $breadcrumbsItems.length - 1; i >= 0; i--) {
            var linkUrl = $breadcrumbsItems.eq(i).find('a').attr('href');

            if (linkUrl && this.isSectionPage(linkUrl)) {
              return this.getPageId(linkUrl);
            }
          }
        }

        return null;
      },

      /**
       * Get article ID
       * @param {string?} url: page url
       * @return {number | null}: article ID or null
       */
      getArticleId: function getArticleId(url) {
        if (this.isArticlePage(url)) {
          return this.getPageId(url);
        }

        return null;
      }
    };
  }

  var modalWrapperTemplate = function modalWrapperTemplate(children) {
    return "\n    <div>\n        <a href=\"#sidenav-modal\" tabindex=\"0\" class=\"btn btn--primary btn--full-width-xs is-hidden--lg-up\">\n            Open sidenav\n        </a>\n        <div id=\"sidenav-modal\" data-plugin-make-modal='{\"devices\": [\"mobile\", \"tablet\"], \"position\": \"right\"}'>\n            ".concat(children, "\n        </div>\n    </div>\n");
  };

  var containerTemplate = function containerTemplate(name) {
    var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return "\n    <ul class=\"sidenav__list sidenav__list--".concat(name, "\">").concat(children, "</ul>\n");
  };

  var categoriesTemplate = function categoriesTemplate(categories) {
    return categories.map(function (category) {
      return "\n        <li class=\"sidenav__item sidenav__item--category\" data-category-id=\"".concat(category.id, "\">\n            <a class=\"sidenav__item__category js-spoiler-toggle\" role=\"button\" tabindex=\"0\">").concat(category.name, "</a>\n            <div class=\"sidenav__container js-spoiler\"></div>\n        </li>\n    ");
    }).join('');
  };

  var sectionsTemplate = function sectionsTemplate(sections) {
    return sections.map(function (section) {
      return "\n        <li class=\"sidenav__item sidenav__item--section\" data-section-id=\"".concat(section.id, "\">\n            <a class=\"sidenav__item__section js-spoiler-toggle\" role=\"button\" tabindex=\"0\">").concat(section.name, "</a>\n            <div class=\"sidenav__container js-spoiler\"></div>\n        </li>\n    ");
    }).join('');
  };

  var articlesTemplate = function articlesTemplate(articles, activeArticleId) {
    return articles.map(function (article) {
      return "\n        <li class=\"sidenav__item sidenav__item--article\" data-article-id=\"".concat(article.id, "\">\n            <a href=\"").concat(article.html_url, "\" class=\"sidenav__item__article ").concat(article.id === activeArticleId ? 'is-active' : '', "\" role=\"button\" tabindex=\"0\">\n                ").concat(article.title, "\n            </a>\n        </li>\n    ");
    }).join('');
  };

  var loadMoreButtonTemplate = function loadMoreButtonTemplate(url) {
    return "\n    <div class=\"sidenav__more\">\n        <button class=\"btn btn--xs btn--gray js-load-more\" data-url=\"".concat(url, "\">\n            <span>Load more</span>\n            <i class=\"fas fa-chevron-down\"></i>\n        </button>\n    </div>\n");
  };

  $$.jqueryPlugin('sidenav', {
    methods: {
      init: function init(uid, options, $container) {
        var _this2 = this;

        this.uid = uid;
        this.options = options;
        this.$container = $container.addClass('sidenav');
        this.activeCategoryId = $$.page.getCategoryId();
        this.activeSectionId = $$.page.getSectionId();
        this.activeArticleId = $$.page.getArticleId();
        this.bindEvents();
        this.fetchCategories(this.$container).then(function () {
          if (_this2.activeCategoryId) {
            _this2.fetchSectionsByCategoryId(_this2.activeCategoryId).then(function () {
              if (_this2.activeSectionId) {
                var categoryId = $container.closest('[data-category-id]').data('category-id');

                if (categoryId) {
                  _this2.fetchSectionsBySectionId(_this2.activeSectionId).then();

                  _this2.fetchArticlesBySectionId(_this2.activeSectionId).then();
                } else {
                  var $breadcrumbsItems = $('.breadcrumbs li');
                  var sections = [];
                  var ind = 0;

                  for (var i = 0; i < $breadcrumbsItems.length; i++) {
                    var linkUrl = $breadcrumbsItems.eq(i).find('a').attr('href');

                    if (linkUrl && window.$$.page.isSectionPage(linkUrl)) {
                      sections.push(window.$$.page.getPageId(linkUrl));
                    }
                  }

                  var _this = _this2;

                  (function sectionsIterator() {
                    Promise.all([_this.fetchSectionsBySectionId(sections[ind]), _this.fetchArticlesBySectionId(sections[ind])]).then(function () {
                      ind++;
                      if (sections[ind]) sectionsIterator();
                    });
                  })();
                }
              }
            });
          }
        });
      },
      bindEvents: function bindEvents() {
        var click = 'click.' + this.uid + ' enterkey.' + this.uid;
        this.$container.on(click, '.js-spoiler-toggle', this.handleSpoilerToggle.bind(this));
        this.$container.on(click, '.js-load-more', this.handleLoadMore.bind(this));
      },
      handleSpoilerToggle: function handleSpoilerToggle(event) {
        var $item = $(event.currentTarget).closest('.sidenav__item');

        if (!$item[0].hasAttribute('data-plugin-spoiler')) {
          event.stopPropagation();
          event.preventDefault();
          var categoryId = $item.data('category-id');
          var sectionId = $item.data('section-id');

          if (categoryId) {
            this.fetchSectionsByCategoryId(categoryId, $item);
          }

          if (sectionId) {
            this.fetchSectionsBySectionId(sectionId, $item);
            this.fetchArticlesBySectionId(sectionId, $item);
          }
        }
      },
      handleLoadMore: function handleLoadMore(event) {
        var $button = $(event.currentTarget);
        var $container = $button.closest('.sidenav__more');
        var url = $button.data('url');
        $button.removeClass('.js-load-more').html('<i class="fas fa-spinner"></i>');
        $container.addClass('sidenav__more--loading');
        this.fetchMoreData(url, $container);
      },
      fetchCategories: function fetchCategories($container) {
        var _this3 = this;

        return new $$.Request().fetch("/api/v2/help_center/".concat(window.theme.locale, "/categories"), {
          per_page: 100,
          draft: false
        }).then(function (data) {
          var html = containerTemplate('categories', categoriesTemplate(data.categories));
          var modal = modalWrapperTemplate(html);
          $container.html(modal);
          $$.initPlugins($container);

          if (!_this3.activeCategoryId) {
            _this3.activeCategoryId = data.categories[0].id;
          }
        });
      },
      fetchSectionsByCategoryId: function fetchSectionsByCategoryId(categoryId) {
        var _this4 = this;

        var $container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$container.find("[data-category-id=\"".concat(categoryId, "\"]"));
        $container.addClass('sidenav__loading');
        return new $$.Request().fetch("/api/v2/help_center/".concat(window.theme.locale, "/categories/").concat(categoryId, "/sections"), {
          per_page: 100,
          draft: false
        }).then(function (data) {
          if (!data.sections.length) {
            return _this4.renderEmptyTemplate($container);
          }

          var sections = data.sections.filter(function (sec) {
            return !sec.parent_section_id;
          });
          var html = containerTemplate('sections', sectionsTemplate(sections));

          _this4.renderTemplate($container, html);
        });
      },
      fetchSectionsBySectionId: function fetchSectionsBySectionId(sectionId) {
        var _this5 = this;

        var $container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$container.find("[data-section-id=\"".concat(sectionId, "\"]"));
        $container.addClass('sidenav__loading sidenav__loading--sections');
        var categoryId = $container.closest('[data-category-id]').data('category-id');
        return new $$.Request().fetch("/api/v2/help_center/".concat(window.theme.locale, "/categories/").concat(categoryId, "/sections"), {
          per_page: 100,
          draft: false
        }).then(function (data) {
          var sections = data.sections.filter(function (sec) {
            return sec.parent_section_id === sectionId;
          });

          if (!sections.length && !$container.hasClass('sidenav__loading--articles') && !$container.find('ul').length) {
            return _this5.renderEmptyTemplate($container);
          }

          $container.removeClass('sidenav__loading--sections');

          if (sections.length) {
            var html = containerTemplate('sections', sectionsTemplate(sections));

            _this5.renderTemplate($container, html, true);
          }
        });
      },
      fetchArticlesBySectionId: function fetchArticlesBySectionId(sectionId) {
        var _this6 = this;

        var $container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$container.find("[data-section-id=\"".concat(sectionId, "\"]"));
        $container.addClass('sidenav__loading sidenav__loading--articles');
        return new $$.Request().fetch("/api/v2/help_center/".concat(window.theme.locale, "/sections/").concat(sectionId, "/articles"), {
          per_page: 100,
          draft: false
        }).then(function (data) {
          if (!data.articles.length && !$container.hasClass('sidenav__loading--sections') && !$container.find('ul').length) {
            return _this6.renderEmptyTemplate($container);
          }

          $container.removeClass('sidenav__loading--articles');

          if (data.articles.length) {
            var html = containerTemplate('articles', articlesTemplate(data.articles, _this6.activeArticleId));

            _this6.renderTemplate($container, html);

            if (data.page < data.page_count) {
              _this6.renderLoadMoreButton($container, data.next_page);
            }
          }
        });
      },
      fetchMoreData: function fetchMoreData(url, $container) {
        var _this7 = this;

        new $$.Request().fetch(url, {
          per_page: 100,
          draft: false
        }).then(function (data) {
          if (!data.articles.length && !data.sections.length) {
            return $container.remove();
          }

          var html = data.articles.length ? articlesTemplate(data.articles, _this7.activeArticleId) : sectionsTemplate(data.sections, _this7.activeSectionId);
          var $parentContainer = $container.closest('.sidenav__list');
          $container.remove();
          $parentContainer.append(html);

          if (data.page < data.page_count) {
            _this7.renderLoadMoreButton($parentContainer, data.next_page);
          }
        });
      },
      renderEmptyTemplate: function renderEmptyTemplate($container) {
        $container.removeClass('sidenav__loading').addClass('sidenav__empty');
        $container.find('.js-spoiler-toggle').removeClass('js-spoiler-toggle');
        $container.find('.js-spoiler').remove();
      },
      renderTemplate: function renderTemplate($container, html, isPrepend) {
        if (isPrepend) {
          $container.find('.js-spoiler').first().prepend(html);
        } else {
          $container.find('.js-spoiler').first().append(html);
        }

        if ($container.hasClass('sidenav__loading')) {
          $container.removeClass('sidenav__loading').attr('data-plugin-spoiler', '').spoiler();
          $container.spoiler('open');
          $$.initPlugins($container);
        }
      },
      renderLoadMoreButton: function renderLoadMoreButton($container, buttonUrl) {
        var $list = $container.hasClass('sidenav__list') ? $container : $container.find('.sidenav__list').eq(0);
        $list.append(loadMoreButtonTemplate(buttonUrl));
      }
    }
  });

}));
