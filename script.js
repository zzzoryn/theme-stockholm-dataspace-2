/**
 * This script uses the utils object "$$"
 *
 * $$.jqueryPlugin(pluginName, options);
 *      Creates a jQuery plugin and call this after the "page:loaded" event
 *
 *      options:
 *          api?: [] => jquery plugin api to the call as $(element).plugin('apiMethod', ...options);
 *          defaultOptions?: {} => jquery plugin default options
 *          methods: {} => jquery plugin methods. The "init" method is required
 *
 * $$.initPlugins($container?);
 *      Initializes all plugins in the container
 *
 * $$.Request(options?).fetch(url, data?);
 *      Fetches a data from the sessionStorage or makes request to the server
 *      Returns the <Promise>
 *
 *      options:
 *          ssPrefix: 'request' => SessionStorage prefix
 *          type: 'GET' => type of the request
 *
 * $$.getDuration($element);
 *      Fetches and returns a transition duration of the element
 */

/**
 * jQuery special event for detecting single enter key press
 *
 * @example:
 *
 * $('.btn').on('tap enterkey', ...);
 */
$.event.special.enterkey = {
  delegateType: 'keydown',
  bindType: 'keydown',
  handle: function(event) {
    var handleObj = event.handleObj;
    var ret = null;

    if (event.which === 13) {
      event.type = handleObj.origType;
      ret = handleObj.handler.apply(this, arguments);
      event.type = handleObj.type;
      return ret;
    }
  }
};

/**
 * jQuery special event for detecting single escape key press
 *
 * @example:
 *
 * $('.btn').on('tap escapekey', ...);
 */
$.event.special.escapekey = {
  delegateType: 'keydown',
  bindType: 'keydown',
  handle: function(event) {
    var handleObj = event.handleObj;
    var ret = null;

    if (event.which === 27) {
      event.type = handleObj.origType;
      ret = handleObj.handler.apply(this, arguments);
      event.type = handleObj.type;
      return ret;
    }
  }
};

/**
 * Modal window plugin
 *
 * @example:
 *
 * <div id="example-modal" class="modal" data-plugin-modal>
 *     Modal content
 *
 *     <a class="js-modal-close" tabindex="0" role="button">Close modal</a>
 * </div>
 *
 * <a href="#example-modal" tabindex="0">Open modal</a>
 */
$$.jqueryPlugin('modal', {
  api: ['open', 'close', 'destroy'],
  defaultOptions: {
    // Modal position: "top", "right", "left", "center"
    position: 'center',

    // Custom modal template
    customTemplate: false,

    // Open link selector. By default [href="#{modalId}"]
    openLinkSelector: '',

    // Close link class name
    closeClassName: 'js-modal-close',

    // jQuery event name which is triggered when modal is about to be opened
    eventOpen: 'modal:open',

    // jQuery event name which is triggered when modal is about to be closed
    eventClose: 'modal:close'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;
      this.$document = $(document);
      this.$body = $('body');
      this.$trigger = $();

      this.lastHtml = this.$container.html();
      this.id = this.$container.attr('id');
      this.isOpened = false;

      if (this.options.openLinkSelector || this.id) {
        if (!this.options.customTemplate) {
          this.createModal();
        }
        this.openLinkSelector = this.options.openLinkSelector || '[href="#' + this.id + '"]';
        this.bindEvents();
      }
    },

    bindEvents: function() {
      var click = 'click.' + this.uid + ' enterkey.' + this.uid;

      this.$document.on(click, this.openLinkSelector, this.handleModalOpen.bind(this));
      this.$document.on('escapekey.' + this.uid, this.close.bind(this));
      this.$container.on(click, '.' + this.options.closeClassName, this.handleModalClose.bind(this));
    },

    createModal: function() {
      this.$container
        .addClass('modal')
        .attr('role', 'dialog')
        .attr('aria-hidden', 'true')
        .html('\
                <div class="modal__bg ' + this.options.closeClassName + '"></div>\
                <div class="modal__container">\
                    <div class="modal__content modal__content--' + this.options.position + '">\
                        ' + this.lastHtml + '\
                        <a class="btn btn--circle modal__close ' + this.options.closeClassName + '" tabindex="0" role="button" aria-label="Close">\
                            <i class="fas fa-times"></i>\
                        </a>\
                    </div>\
                </div>\
            ');
    },

    handleModalOpen: function(event) {
      event.preventDefault();
      this.open($(event.currentTarget));
    },

    handleModalClose: function(event) {
      event.preventDefault();
      this.close();
    },

    open: function($trigger) {
      if (!this.isOpened) {
        this.isOpened = true;
        this.$body.addClass('modal-is-open');

        this.$container
          .addClass('is-active')
          .attr('aria-hidden', 'false')
          .trigger(this.options.eventOpen, this);

        setTimeout(function() {
          this.$container
            .find('a[href], input, textarea, select, button')
            .not('[type="hidden"], [aria-hidden="true"], .is-hidden')
            .first()
            .focus();
        }.bind(this), 60);


        if ($trigger) {
          this.$trigger = $trigger;
          this.$trigger.addClass('is-active');
        }
      }
    },

    close: function() {
      if (this.isOpened) {
        this.isOpened = false;
        this.$body.removeClass('modal-is-open');
        this.$trigger.removeClass('is-active');

        this.$container
          .removeClass('is-active')
          .attr('aria-hidden', 'true')
          .trigger(this.options.eventClose, this);
      }
    },

    destroy: function() {
      this.$document.off('.' + this.uid);
      this.$container
        .off('.' + this.uid)
        .removeClass('modal')
        .removeAttr('role')
        .removeAttr('aria-hidden')
        .html(this.lastHtml);
    }
  }
});

/**
 * Search modal window plugin
 */
$$.jqueryPlugin('searchModal', {
  methods: {
    init: function(uid, options, $container) {
      this.$container = $container;
      this.$container.modal(options);
      this.bindEvents();
    },

    bindEvents: function() {
      this.$container.one('modal:open', this.createPopularSearches.bind(this));
    },

    createPopularSearches: function() {
      var $popularSearchesContainer = this.$container.find('.js-popular-searches');
      if ($popularSearchesContainer.length) {
        $popularSearchesContainer.popularSearches({
          linkClass: 'btn btn--xs btn--gray'
        });
      }
    }
  }
});

/**
 * Make a modal window on a specific device
 *
 * @example:
 *
 * <div data-plugin-make-modal='{"devices": ["mobile", "tablet"], "position": "right"}'>
 *     Modal content
 * </div>
 */
$$.jqueryPlugin('makeModal', {
  api: ['make'],
  defaultOptions: {
    devices: ['mobile', 'tablet', 'desktop']
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;
      this.isCreated = false;

      this.$container = $container;

      this.make();
      this.bindEvents();
    },

    bindEvents: function() {
      $(window).on('resize.' + this.uid, this.make.bind(this));
    },

    make: function() {
      var isVisible = false;

      this.options.devices.forEach(function(deviceName) {
        if (!isVisible) {
          switch (deviceName) {
            case 'mobile':
              isVisible = document.querySelector('.is-mobile').offsetParent != null;
              break;
            case 'tablet':
              isVisible = document.querySelector('.is-tablet').offsetParent != null;
              break;
            case 'desktop':
              isVisible = document.querySelector('.is-desktop').offsetParent != null;
              break;
          }
        }
      });

      if (isVisible && !this.isCreated) {
        this.isCreated = true;
        this.$container.modal(this.options);
        $$.initPlugins(this.$container);
      }
      else if (!isVisible && this.isCreated) {
        this.isCreated = false;
        this.$container.modal('destroy');
      }

    }
  }
});

/**
 * Dropdown plugin
 * This plugin use the "nanopop" package for setting dropdown positions.
 * More information https://github.com/Simonwep/nanopop
 *
 * @example:
 *
 * <div class="dropdown" data-plugin-dropdown>
 *     <a class="js-dropdown-open" tabindex="0" role="button" aria-label="Open">
 *         Open dropdown
 *     </a>
 *     <div class="dropdown__content js-dropdown" role="menu" aria-hidden="true">
 *         <a href="#" class="dropdown__menuitem" rel="nofollow" role="menuitem">One</a>
 *         <a href="#" class="dropdown__menuitem" rel="nofollow" role="menuitem">Two</a>
 *         <a href="#" class="dropdown__menuitem" rel="nofollow" role="menuitem">Three</a>
 *     </div>
 * </div>
 */
$$.jqueryPlugin('dropdown', {
  api: ['open', 'close'],
  defaultOptions: {
    // Open link selector.
    openLinkSelector: '.js-dropdown-open',

    // Close button selector. By default - all links with a "href" attribute in the dropdown container
    closeLinkSelector: '.js-dropdown a[href]',

    // Dropdown container selector
    dropdownSelector: '.js-dropdown',

    // Preferred position, any combination of [top|right|bottom|left]-[start|middle|end] is valid.
    // 'middle' is used as default-variant if you leave it out.
    position: 'bottom',

    // Margin between the dropdown and the trigger button
    margin: 12,

    // Add dropdown chevron
    addChevron: true,

    // jQuery event name which is triggered when dropdown is about to be opened
    eventOpen: 'dropdown:open',

    // jQuery event name which is triggered when dropdown is about to be closed
    eventClose: 'dropdown:close'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;
      this.lastPosition = '';
      this.popper = null;
      this.isOpened = false;

      this.$container = $container;
      this.$dropdown = this.$container.find(this.options.dropdownSelector);
      this.$trigger = this.$container.find(this.options.openLinkSelector).first();
      this.$document = $(document);
      this.$window = $(window);
      this.chevron = $();

      if (this.options.addChevron) {
        this.chevron = $('<div class="dropdown__chevron"></div>');
        this.$dropdown.append(this.chevron[0]);
      }

      this.bindEvents();
    },

    bindEvents: function() {
      var click = 'click.' + this.uid + ' enterkey.' + this.uid;

      this.$container.on(click, this.options.openLinkSelector, this.handleDropdownToggle.bind(this));
      this.$container.on(click, this.options.closeLinkSelector, this.close.bind(this));
      this.$document.on(click, this.handleDropdownClose.bind(this));
      this.$document.on('escapekey.' + this.uid, this.close.bind(this));
    },

    handleDropdownToggle: function(event) {
      event.preventDefault();
      if (!this.isOpened) {
        this.open($(event.currentTarget));
      }
      else {
        this.close();
      }
    },

    handleDropdownClose: function(event) {
      if (this.isOpened &&
        event.target !== this.$container[0] &&
        !$(event.target).closest(this.$container[0]).length
      ) {
        this.close();
      }
    },

    open: function($trigger) {
      if (!this.isOpened) {
        this.isOpened = true;

        if ($trigger) {
          this.$trigger = $trigger;
          this.$trigger.addClass('is-active');
        }

        this.update();
        this.$window.on('resize.' + this.uid, this.update.bind(this));
        this.$container.trigger(this.options.eventOpen, this);
      }
    },

    close: function() {
      if (this.isOpened) {
        this.isOpened = false;
        this.$dropdown.removeClass('is-active');
        this.$trigger.removeClass('is-active');
        this.$window.off('resize.' + this.uid);
        this.$container.trigger(this.options.eventClose, this);
      }
    },

    update: function() {
      this.popper = NanoPop.createPopper(this.$trigger[0], this.$dropdown[0], Object.assign({}, this.options, {
        container: document.documentElement.getBoundingClientRect()
      }));
      this.$dropdown.removeClass('dropdown__content--' + this.lastPosition);
      this.lastPosition = this.popper.update();
      this.$dropdown.addClass('is-active dropdown__content--' + this.lastPosition);

      if (this.options.addChevron) {
        this.setChevronPosition();
      }
    },

    setChevronPosition: function() {
      this.chevron
        .removeAttr('class style')
        .addClass('dropdown__chevron dropdown__chevron--' + this.lastPosition);

      var triggerRect = this.$trigger[0].getBoundingClientRect();
      var chevronRect = this.chevron[0].getBoundingClientRect();

      if (/^[tb]/i.test(this.lastPosition)) {
        this.chevron.offset({left: triggerRect.x + triggerRect.width / 2 - chevronRect.width / 2});
      }
      else {
        this.chevron.offset({top: triggerRect.y + triggerRect.height / 2 - chevronRect.height / 2});
      }
    }
  }
});

$$.jqueryPlugin('categoriesDropdown', {
  methods: {
    init: function(uid, options, $container) {
      this.$container = $container;
      this.$container.dropdown(options);
      this.bindEvent();
    },

    bindEvent: function() {
      this.$container.one('dropdown:open', this.createCategoryList.bind(this));
    },

    createCategoryList: function() {
      var $categoryListContainer = this.$container.find('.js-category-list');
      if ($categoryListContainer.length) {
        $categoryListContainer.categoryList({
          linkClass: 'dropdown__menuitem'
        });
      }
    }
  }
});

/**
 * Tabs plugin
 *
 * @example:
 *
 * <div class="tabs tabs--type-1 tabs--style-1" data-plugin-tabs>
 *     <div class="tabs__links js-tabs-links">
 *         <a href="#one" tabindex="0">One</a>
 *         <a href="#two" tabindex="0">Two</a>
 *         <a href="#three" tabindex="0">Three</a>
 *     </div>
 *     <div class="tabs__containers js-tabs-containers">
 *         <div id="one" class="tabs__container" aria-hidden="true">Content 1</div>
 *         <div id="two" class="tabs__container" aria-hidden="true">Content 2</div>
 *         <div id="three" class="tabs__container" aria-hidden="true">Content 3</div>
 *     </div>
 * </div>
 */
$$.jqueryPlugin('tabs', {
  api: ['toggle', 'destroy'],
  defaultOptions: {
    // Index of the Default active tab
    activeIndex: 0,

    // Selector of the container with links
    linksSelector: '.js-tabs-links',

    // Selector of the container with tabs
    containersSelector: '.js-tabs-containers',

    // jQuery event name which is triggered when tab is about to be opened
    eventOpen: 'tabs:open',

    // jQuery event name which is triggered after tab is opened
    eventOpened: 'tabs:opened'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;
      this.tabsContainerDelay = 10;
      this.triggerDuration = 400;
      this.tabDuration = 400;
      this.duration = 400;

      this.$container = $container;
      this.$links = this.$container.find(this.options.linksSelector).first();
      this.$containers = this.$container.find(this.options.containersSelector).first();
      this.$trigger = $();
      this.$tab = $();
      this.$lastTrigger = $();
      this.$lastTab = $();

      if (this.options.activeIndex !== -1) {
        this.toggle(0);
      }

      this.bindEvents();
    },

    bindEvents: function() {
      var click = 'click.' + this.uid + ' enterkey.' + this.uid;

      this.$links.on(click, 'a', this.handleTabsToggle.bind(this));
    },

    handleTabsToggle: function(event) {
      event.preventDefault();
      this.toggle($(event.currentTarget));
    },

    toggle: function($triggerOrIndex) {
      var $links = this.$links.children('a');
      var $containers = this.$containers.children('div');

      this.$lastTrigger = $links.filter('.is-active');
      this.$lastTab = $containers.filter('.is-active');

      this.$trigger = typeof $triggerOrIndex === 'number'
        ? $links.eq($triggerOrIndex)
        : $triggerOrIndex;

      if (!this.$trigger.length) {
        return;
      }

      var activeTabId = this.$trigger.attr('href').replace('#', '');
      this.$tab = $containers.filter('[id="' + activeTabId + '"]');

      this.$container.trigger(this.options.eventOpen, this);

      this.triggerDuration = $$.getDuration(this.$trigger);
      this.tabDuration = $$.getDuration(this.$tab);
      this.duration = this.triggerDuration > this.tabDuration ? this.triggerDuration : this.tabDuration;

      this.$containers.css('height', this.$containers.height());

      setTimeout(function() {
        this.$containers.css('height', this.$tab.outerHeight());
      }.bind(this), this.tabsContainerDelay);

      setTimeout(function() {
        this.$containers.css('height', '');
        this.$container.trigger(this.options.eventOpened, this);
      }.bind(this), this.tabsContainerDelay + this.duration);

      this.$lastTrigger.add(this.$lastTab).removeClass('is-active');
      this.$lastTab.attr('aria-hidden', 'true');
      this.$trigger.add(this.$tab).addClass('is-active');
      this.$tab.attr('aria-hidden', 'false');
    },

    destroy: function() {
      this.$links.off('.' + this.uid);
    }
  }
});

/**
 * Spoiler plugin
 *
 * @example
 * <div class="spoiler spoiler--type-1 spoiler--style-2" data-plugin-spoiler>
 *     <a class="spoiler__title js-spoiler-toggle" role="button" tabindex="0">Spoiler title</a>
 *     <div class="spoiler__text js-spoiler" aria-hidden="true">
 *         Spoiler content
 *     </div>
 * </div>
 */
$$.jqueryPlugin('spoiler', {
  api: ['toggle', 'open', 'close', 'destroy'],
  defaultOptions: {
    // Spoiler is open
    open: false,

    // Selector of the toggle link
    linkSelector: '.js-spoiler-toggle',

    // Selector of the spoiler box
    spoilerSelector: '.js-spoiler',

    // Animation duration
    duration: 400,

    // jQuery event name which is triggered when spoiler is about to be opened
    eventOpen: 'spoiler:open',

    // jQuery event name which is triggered after spoiler is opened
    eventOpened: 'spoiler:opened',

    // jQuery event name which is triggered when spoiler is about to be closed
    eventClose: 'spoiler:close',

    // jQuery event name which is triggered after spoiler is closed
    eventClosed: 'spoiler:closed'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;
      this.$link = this.$container.find(this.options.linkSelector).first();
      this.$spoiler = this.$container.find(this.options.spoilerSelector).first();

      if (this.options.open) {
        this.isOpen = false;
        this.open(true);
      }
      else {
        this.isOpen = true;
        this.close(true);
      }

      this.bindEvents();
    },

    bindEvents: function() {
      var click = 'click.' + this.uid + ' enterkey.' + this.uid;

      this.$link.on(click, this.handleSpoilerToggle.bind(this));
    },

    handleSpoilerToggle: function(event) {
      event.preventDefault();
      this.toggle();
    },

    toggle: function() {
      if (this.isOpen) {
        this.close();
      }
      else {
        this.open();
      }
    },

    open: function(withoutAnimation) {
      if (!this.isOpen) {
        this.isOpen = true;
        this.$container.addClass('is-open');
        this.$link.add(this.$spoiler).addClass('is-active');
        this.$container.trigger(this.options.eventOpen, this);

        var duration = withoutAnimation === true ? 0 : this.options.duration;
        this.$spoiler.attr('aria-hidden', 'false').slideDown(duration, function() {
          this.$container.trigger(this.options.eventOpened, this);
        }.bind(this));
      }
    },

    close: function(withoutAnimation) {
      if (this.isOpen) {
        this.isOpen = false;
        this.$container.removeClass('is-open');
        this.$link.add(this.$spoiler).removeClass('is-active');
        this.$container.trigger(this.options.eventClose, this);

        var duration = withoutAnimation === true ? 0 : this.options.duration;
        this.$spoiler.attr('aria-hidden', 'true').slideUp(duration, function() {
          this.$container.trigger(this.options.eventClosed, this);
        }.bind(this));
      }
    },

    destroy: function() {
      this.$link.off('.' + this.uid);
    }
  }
});

/**
 * Accordion plugin
 * Groups spoilers into an accordion
 *
 * @example:
 * <div class="accordion accordion--type-1 accordion--style-2" data-plugin-accordion>
 *     <div class="spoiler" data-plugin-spoiler>...</div>
 *     <div class="spoiler" data-plugin-spoiler>...</div>
 *     <div class="spoiler" data-plugin-spoiler>...</div>
 * </div>
 */
$$.jqueryPlugin('accordion', {
  api: ['open', 'destroy'],
  defaultOptions: {
    // Index of the Default active spoiler
    activeIndex: -1,

    // Only one active spoiler in the accordion
    oneActive: true
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;
      this.$spoilers = this.$container.children('[data-plugin-spoiler]');

      this.open(this.options.activeIndex, true);
      this.bindEvents();
    },

    bindEvents: function() {
      if (this.options.oneActive) {
        this.$spoilers.on('spoiler:open.' + this.uid, this.handleSpoilerOpen.bind(this));
      }
    },

    handleSpoilerOpen: function(event, spoiler) {
      this.$spoilers.each(function(i, element) {
        if (element !== spoiler.$container[0]) {
          $(element).spoiler('close');
        }
      });
    },

    open: function(index, withoutAnimation) {
      this.$spoilers.each(function(i, element) {
        var method = i === index ? 'open' : 'close';
        $(element).spoiler(method, withoutAnimation);
      });
    },

    destroy: function() {
      this.$spoilers.off('.' + this.uid);
    }
  }
});

/**
 * Category list plugin
 * Renders a list of links to all categories
 *
 * @example:
 *
 * <div data-plugin-category-list='{"linkClass": "dropdown__menuitem"}'></div>
 */
$$.jqueryPlugin('categoryList', {
  defaultOptions: {
    // Links class names
    linkClass: '',

    // Container hidden class
    hiddenClass: 'is-hidden'
  },
  methods: {
    init: function(uid, options, $container) {
      console.log('init');
      this.uid = uid;
      this.options = options;

      this.$container = $container;

      new $$.Request()
        .fetch('/api/v2/help_center/' + window.theme.locale + '/categories.json')
        .then(this.handleRequestSuccess.bind(this))
        .catch(this.handleRequestError.bind(this));
    },

    handleRequestSuccess: function(data) {
      this.$container
        .removeClass(this.options.hiddenClass)
        .html(this.getTemplate(data.categories));
    },

    handleRequestError: function(error) {
      console.error(error);
      this.$container.addClass('is-error');
    },

    getTemplate: function(categories) {
      var html = '';

      categories.forEach(function(categories) {
        html += '<a href="' + categories.html_url + '" class="' + this.options.linkClass + '">' + categories.name + '</a>';
      }.bind(this));

      return html;
    }
  }
});

/**
 * Popular searches plugin
 * Renders a list of links to articles with the "popular" label name
 *
 * @example:
 *
 * <div data-plugin-popular-searches='{"linkClass": "btn btn--xs btn--gray"}'></div>
 */
$$.jqueryPlugin('popularSearches', {
  defaultOptions: {
    // Articles label name
    label: 'popular',

    // Links class names
    linkClass: '',

    // Links limit
    limit: 3,

    // Container hidden class
    hiddenClass: 'is-hidden'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;

      new $$.Request()
        .fetch('/api/v2/help_center/' + window.theme.locale + '/articles.json', {
          label_names: this.options.label,
          per_page: this.options.limit,
          draft: false
        })
        .then(this.handleRequestSuccess.bind(this))
        .catch(this.handleRequestError.bind(this));
    },

    handleRequestSuccess: function(data) {
      this.$container
        .removeClass(this.options.hiddenClass)
        .html(this.getTemplate(data.articles));
    },

    handleRequestError: function() {
      this.$container.addClass('is-error');
    },

    getTemplate: function(articles) {
      var html = '';

      articles.forEach(function(article) {
        html += '<a href="' + article.html_url + '" class="' + this.options.linkClass + '">' + article.title + '</a>';
      }.bind(this));

      return html;
    }
  }
});

/**
 * Convert <img> to <svg>
 *
 * @example:
 *
 * <img src="/example.svg" data-plugin-inline-svg>
 */
$$.jqueryPlugin('inlineSvg', {
  methods: {
    init: function(uid, options, $container) {
      this.$container = $container;

      var url = this.$container.attr('src');

      if (!url || !/\.svg/.test(url)) return;

      $.get(url, this.handleResponseSuccess.bind(this));
    },

    handleResponseSuccess: function(svgDocument) {
      this.$container.replaceWith($(svgDocument).find('svg')[0].outerHTML);
    }
  }
});

/**
 * "Load image" event handler
 * Adds a smooth appearance to the image
 *
 * @example:
 *
 * <img src="/example.jpg" data-plugin-load-image>
 */
$$.jqueryPlugin('loadImage', {
  methods: {
    init: function(uid, options, $container) {
      this.$container = $container;

      if (this.$container[0].complete) {
        return this.handleImageLoad();
      }

      this.$container.one('load', this.handleImageLoad.bind(this));
    },

    handleImageLoad: function() {
      this.$container.addClass('is-loaded');
    }
  }
});

/**
 * "Load image" on the article page
 * Fetches a first image on the article body
 */
$$.jqueryPlugin('articleLoadImage', {
  defaultOptions: {
    // Default background image
    bg: null
  },
  methods: {
    init: function(uid, options, $container) {
      this.options = options;
      this.$container = $container;

      var $firstImage = $('[data-article-body] img').first();

      if ($firstImage.length) {
        var imgSrc = $firstImage.attr('src');
        this.$container.attr('src', imgSrc).css('filter', 'blur(4px)');
        this.$container
          .closest('.welcome__bg')
          .removeClass('welcome__bg--with-mask')
          .addClass('welcome__bg--with-mask-dark');
      }
      else {
        this.$container.attr('src', this.options.bg);
      }

      this.$container.loadImage();
    }
  }
});

/**
 * List limit plugin
 * Truncates the list to the specified limit.
 * After clicking on the button, it expands the full list
 *
 * @example:
 * <ul data-plugin-list-limit='{"limit": 2}'>
 *     <li>One</li>
 *     <li>Two</li>
 *     <li>Three</li>
 *     <li class="js-ignore-item">Four</li>
 *     <li class="js-ignore-item">
 *         <button class="is-hidden js-show-more">Show more</button>
 *     </li>
 * </ul>
 */
$$.jqueryPlugin('listLimit', {
  defaultOptions: {
    // Limit
    limit: 3,

    // Selector to be ignored
    ignoreItemSelector: '.js-ignore-item',

    // "Show more" button selector
    showMoreSelector: '.js-show-more'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;
      this.$showMore = this.$container.find(this.options.showMoreSelector);
      this.$list = this.$container.find('li').not(this.options.ignoreItemSelector);

      if (this.$list.length <= this.options.limit) return;

      this.$showMore.removeClass('is-hidden');
      for (var i = this.options.limit; i < this.$list.length; i++) {
        this.$list.eq(i).addClass('is-hidden');
      }

      this.bindEvents();
    },

    bindEvents: function() {
      var click = 'click.' + this.uid + ' enterkey.' + this.uid;
      this.$container.one(click, this.options.showMoreSelector, this.handleShowMore.bind(this));
    },

    handleShowMore: function(event) {
      event.preventDefault();
      this.destroy();
    },

    destroy: function() {
      this.$showMore.addClass('is-hidden');
      this.$list.removeClass('is-hidden');
      this.$container.off('.' + this.uid);
    }
  }
});

/**
 * Header plugin
 * Controls header color
 */
$$.jqueryPlugin('header', {
  defaultOptions: {
    // Indent from the top of the site
    indent: 0
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;
      this.$window = $(window);

      this.isFilled = false;
      this.isFixed = getComputedStyle($container[0])['position'] === 'fixed';

      this.headerIsScrolled();
      this.bindEvents();
    },

    bindEvents: function() {
      var media = window.matchMedia('(prefers-color-scheme: dark)');

      if (window.theme.prefersColorScheme && media.media !== 'not all') {
        media.addListener(function() {
          this.headerIsFilled();
        }.bind(this));
      }

      if (this.isFixed) {
        this.$window.on('scroll.' + this.uid, this.headerIsScrolled.bind(this));
      }
    },

    headerIsFilled: function() {
      if (!window.theme.darkMode) {
        var $welcome = $('[data-welcome-style]');
        var welcomeStyle = $welcome.length ? parseInt($welcome.attr('data-welcome-style')) : -1;

        var $heading = $('[data-heading-style]');
        var headingStyle = $heading.length ? parseInt($heading.attr('data-heading-style')) : -1;

        this.isFilled = welcomeStyle === 3 || headingStyle === 3 || (welcomeStyle === -1 && headingStyle === -1);
      }
      else {
        this.isFilled = false;
      }

      this.$container.toggleClass('is-filled', this.isFilled);
    },

    headerIsScrolled: function() {
      if (window.scrollY > this.options.indent && this.isFixed) {
        this.$container.addClass('is-filled');
      }
      else {
        this.headerIsFilled();
      }

    }
  }
});

/**
 * Knowledge base plugin
 * Initializes tabs or spoilers depending on the Knowledge base type
 */
$$.jqueryPlugin('knowledge', {
  defaultOptions: {
    // Type of the Knowledge base component
    type: 0,

    // Selector of the element with a category
    categorySelector: '.js-knowledge-category'
  },
  methods: {
    init: function(uid, options, $container) {
      this.uid = uid;
      this.options = options;

      this.$container = $container;

      if (options.type === 1) {
        this.bindEvents();
        this.$container.find('.js-tabs-links > a').spoiler();
        this.$container.tabs();
      }
      else if (options.type === 2) {
        this.$container.find(this.options.categorySelector).each(function(i, element) {
          $(element).spoiler({open: !i});
        });
      }
    },

    bindEvents: function() {
      this.$container.on('tabs:open.' + this.uid, this.handleTabsOpen.bind(this));
    },

    handleTabsOpen: function(event, tabs) {
      tabs.$trigger.spoiler('open');
      tabs.$lastTrigger.spoiler('close');
    }
  }
});

/**
 * Vote progress plugin
 * Watches the change in the number of votes
 */
$$.jqueryPlugin('voteProgress', {
  defaultOptions: {
    progressSelector: '.js-progress',
    countSelector: '.vote-count',
    sumSelector: '.vote-sum'
  },
  methods: {
    init: function(uid, options, $container) {
      this.options = options;

      this.$container = $container;
      this.$progress = this.$container.find(this.options.progressSelector);
      this.$count = this.$container.find(this.options.countSelector);
      this.$sum = this.$container.find(this.options.sumSelector);

      this.fetchPercent();

      var observer = new MutationObserver(this.fetchPercent.bind(this));
      observer.observe(this.$count[0], {childList: true});
    },

    fetchPercent: function() {
      var count = Number(this.$count.text());
      var sum = Number(this.$sum.text());
      var percent = (count - (count / 2 - sum / 2)) / count * 100;

      this.$progress.css('width', percent + '%');
    }
  }
});

/**
 * Styles elements from the article body
 */
$$.jqueryPlugin('articleBody', {
  methods: {
    init: function(uid, options, $container) {
      this.$container = $container;
      this.createIframe();
      this.createTable();
    },

    createIframe: function() {
      this.$container.find('iframe').each(function(i, element) {
        var $iframe = $(element);
        var height = $iframe.height() / $iframe.width() * 100;
        $iframe
          .wrap('<div class="iframe"></div>')
          .parent()
          .css('padding-bottom', height + '%');
      });
    },

    createTable: function() {
      this.$container.find('table').each(function(i, element) {
        var $table = $(element);
        var $tableContainer = $('<div class="table-container"></div>');
        $table.after($tableContainer);
        $tableContainer.append($table);
      });
    }
  }
});

/**
 * Auto submit filtering form
 */
$$.jqueryPlugin('autosubmit', {
  methods: {
    init: function(uid, options, $container) {
      $container.find('input, select').on('change', this.handleInputChange.bind(this));
    },

    handleInputChange: function(event) {
      $(event.currentTarget).closest('form').submit();
    }
  }
});

$(window).trigger('script:loaded');
