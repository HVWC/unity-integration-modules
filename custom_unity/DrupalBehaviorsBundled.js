/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _DrupalUnityInterface = __webpack_require__(1);

	var _DrupalUnityInterface2 = _interopRequireDefault(_DrupalUnityInterface);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	$ = window.jQuery; /**
	                    * @file
	                    * Add Drupal Behaviors to control widgets on the environment page
	                    *
	                    */

	resize_canvas();

	Drupal.behaviors.unityProjectInitializePageLoadDefaultValues = {
	  attach: function attach(context, settings) {
	    var drupal_interface = window.DrupalUnityInterface.DrupalInterface;
	    var environment;
	    resize_canvas();

	    window.addEventListener('hashchange', onHashChange, false);

	    var tour_id = drupal_interface.getCurrentTourId();
	    var placard_id = drupal_interface.getCurrentPlacardId();
	    var environment_promise = drupal_interface.getCurrentEnvironment();
	    environment_promise.then(function (environment) {
	      if (tour_id) {
	        drupal_interface.triggerEvent('update_tour_info', tour_id, placard_id);
	      }
	    });
	    var initial_binary = $('#unity-source').val();

	    drupal_interface.addEventListener('update_tour_info', function () {
	      var tour_id = drupal_interface.getCurrentTourId();
	      var placard_id = drupal_interface.getCurrentPlacardId();

	      environment_promise.then(function (environment) {
	        tour_id || (tour_id = environment.tours[0].id);
	        placard_id || (placard_id = environment.tours[0].placards[0].id);
	        var tour = environment.getTour(tour_id);

	        var current_placard = tour.getPlacard(placard_id);
	        drupal_interface.triggerEvent('placard_selected', current_placard);

	        var active_placard_list = '.tour-row-' + tour_id + ' .placard-list';
	        var active_placard_item = '.tour-row-' + tour_id + ' .placard-info-' + placard_id;
	        var default_active_placard_info = [active_placard_list, active_placard_item];

	        update_binary(tour.unity_binary);

	        set_window_tour_display_title(tour.title);
	        set_active_sidebar_tour_placard_list(active_placard_list);
	        set_active_sidebar_tour_placard_item(active_placard_item);
	        set_placard_pager(tour, current_placard);
	        resize_placard_images();
	        resize_canvas();
	        update_sidebar_placard_dropdown_options(tour_id, tour.placards);
	        update_current_placard(placard_id);
	        scroll_placard_to_top(active_placard_item);
	      }).catch(function (error) {
	        console.log('error in update tour info');
	        console.log(error);
	      });
	    });

	    function onHashChange() {
	      var tour_id = Number(get_query_string_val('tid'));
	      var placard_id = Number(get_query_string_val('pid'));

	      drupal_interface.triggerEvent('update_tour_info', tour_id, placard_id);
	    }
	  }
	};

	Drupal.behaviors.unityProjectAttachSidebarInfo = {
	  attach: function attach(context, settings) {
	    var drupal_interface = window.DrupalUnityInterface.DrupalInterface;
	    var environment_tours;

	    drupal_interface.getCurrentEnvironment().then(function (environment) {
	      $('.information-window-container').append(render_sidebar_tour_html(environment.tours));
	      // Attach placards on each tour item
	      $.each(environment.tours, function (key, tour_value) {
	        var placard_container = '.tour-row-' + tour_value.id + ' .view-information-window';
	        render_sidebar_placard_list_html(placard_container, tour_value.placards, tour_value.id);
	      });
	    });
	  }
	};

	function hidePlacardDropdownList(e) {
	  $('.placard-dropdown-list').hide();
	}

	Drupal.behaviors.unityProjectSidebarPlacardDropdownEvent = {
	  attach: function attach(context, settings) {
	    $('.placard-title-dropdown-container .placard-title').click(function (e) {
	      e.preventDefault();
	      e.stopPropagation();
	      $('.placard-dropdown-list').toggle();
	      $('body').unbind('click', hidePlacardDropdownList).bind('click', hidePlacardDropdownList);
	    });
	  }
	};

	Drupal.behaviors.unityProjectInitializeResizableWorldWindow = {
	  attach: function attach(context, settings) {
	    // Set container to be resizable
	    $('.world-window-container.split-screen').resizable({
	      maxWidth: 930,
	      minWidth: 611,
	      handles: 'e, w',
	      resize: function resize(event, ui) {
	        resize_placard_images();
	        resize_canvas();
	      }
	    });
	  }
	};

	Drupal.behaviors.unityProjectSetCookieStoredContainerSize = {
	  attach: function attach(context, settings) {
	    // Load saved world window width from session
	    if ($.cookie('world_window') != '' && $.cookie('world_window') != 'full-world' && $.cookie('world_window') != 'full-info' && $.cookie('world_window') != 'split-world' && $.cookie('world_window') != 'split-info') {
	      $('.world-window-container.split-screen').width($.cookie('world_window'));
	      var info_window_width = $('#block-system-main').width() - 15 - $.cookie('world_window');
	      $('.information-window-container.split-screen').width(info_window_width);
	    } else {
	      resize_window($.cookie('world_window'));
	    }
	  }
	};

	Drupal.behaviors.unityProjectSetContainerSizeEvents = {
	  attach: function attach(context, settings) {
	    // World window resize options
	    $('.show-full-world-window-btn').click(function (e) {
	      e.preventDefault();
	      resize_window('full-world');
	    });
	    $('.show-split-screen-world-window-btn').click(function (e) {
	      e.preventDefault();
	      resize_window('split-world');
	    });
	    $('.show-full-information-window-btn').click(function (e) {
	      e.preventDefault();
	      resize_window('full-info');
	    });
	    $('.show-split-screen-information-window-btn').click(function (e) {
	      e.preventDefault();
	      resize_window('split-info');
	    });

	    var world_window_width = $('.world-window-container.split-screen').width();
	    var sidebar_width = $('.information-window-container.split-screen').width();
	    $('.world-window-container.split-screen').bind('resize', function (event, ui) {
	      var width_val = world_window_width - $('.world-window-container.split-screen').width();
	      var new_sidebar_width = sidebar_width + width_val;
	      $('.information-window-container.split-screen').width(new_sidebar_width);
	    });

	    $('.world-window-container.split-screen').on('resizestop', function (event, ui) {
	      $.cookie('world_window', $('.world-window-container').width());
	    });
	  }
	};

	function getEnvironment() {
	  var deferred = Q.defer();

	  return deferred.promise;
	}

	function update_sidebar_placard_dropdown_options(tour_id, placards) {
	  $('.placard-dropdown-list').empty();
	  var placard_options = [];
	  $.each(placards, function (index, placard) {
	    placard_options.push(render_placard_option_html(tour_id, placard));
	  });
	  $('.placard-dropdown-list').append(placard_options.join(''));
	}

	function render_placard_option_html(tour_id, placard) {
	  return '<li class="placard-item"><a href="#tid=' + tour_id + '&pid=' + placard.id + '">' + placard.title + '</a></li>';
	}

	function update_binary(unity_binary) {
	  var existing_binary_file = $('#unity-source').val();
	  if (existing_binary_file != unity_binary) {
	    $('#unity-source').val(unity_binary);
	    // Update embedded unity
	    //unityObject.embedUnity('unityPlayer', unity_binary, '100%', 600, null, {'wmode' : 'opaque'});
	  }
	}

	function update_current_placard(pid) {
	  var drupal_interface = window.DrupalUnityInterface.DrupalInterface;
	  drupal_interface.getPlacards([pid]).then(function (placard) {
	    var placard_data = placard[0];

	    set_placard_display_title(placard_data.title);
	    update_tour_binary_placard(placard_data);
	  });
	}

	function get_current_placard_item_id(placards, placard_id) {
	  var current_placard_key;
	  $.each(placards, function (placard_key, placard_value) {
	    if (Number(placard_value.id) == placard_id) {
	      current_placard_key = placard_key;
	    }
	  });
	  return current_placard_key;
	}

	function render_sidebar_tour_html(tours) {
	  var tour_items = [];

	  $.each(tours, function (key, tour_value) {
	    if (tour_value.placards[0]) {
	      var default_placard_id = tour_value.placards[0].id;
	      var tour_html = '<div class="tour-row tour-row-' + tour_value.id + '">' + '<div class="tour-row-item">' + '<h3><a href="#tid=' + tour_value.id + '&pid=' + default_placard_id + '" class="tour-link-item">' + tour_value.title + '</a></h3>' + '</div>' + '<div class="view-information-window"></div>' + '</div>';
	      tour_items.push(tour_html);
	    } else {
	      console.warn('Your tour has no placards associated with it');
	    }
	  });

	  return tour_items.join('');
	}

	function render_sidebar_placard_list_html(placard_container, placards, tour_id) {
	  var placard_items = [];
	  var drupal_interface = window.DrupalUnityInterface.DrupalInterface;

	  $.each(placards, function (index, placard) {
	    try {
	      var image = placard.image_url ? '<img typeof="foaf:Image" src="' + placard.image_url + '">' : '';
	      var placard_item_html = '<li class="views-row">' + '<span class="views-field views-field-title-1 placard-row">' + '<a href="#tid=' + tour_id + '&pid=' + placard.id + '" class="placard-row-item">' + placard.title + '</a>' + '</span>' + '<div class="views-field views-field-nothing placard-info placard-info-' + placard.id + '" style="display: none;">' + '<div class="placard-image">' + image + '</div>' + '<div class="placard-body">' + placard.description + '</div>' + '</div></li>';
	      placard_items.push(placard_item_html);
	    } catch (e) {
	      console.log(e);
	    }
	  });

	  var placard_list = '<ul class="placard-list">' + placard_items.join('') + '</ul>';
	  $(placard_container).append(placard_list);
	}

	function render_sidebar_placard_list_item(placard, tour_id) {
	  var placard = placard[0];
	  var image = placard.image_url ? '<img typeof="foaf:Image" src="' + placard.image_url + '">' : '';
	  var placard_items = '<li class="views-row">' + '<span class="views-field views-field-title-1 placard-row">' + '<a href="#tid=' + tour_id + '&pid=' + placard.id + '" class="placard-row-item">' + placard.title + '</a>' + '</span>' + '<div class="views-field views-field-nothing placard-info placard-info-' + placard.id + '" style="display: none;">' + '<div class="placard-image">' + image + '</div>' + '<div class="placard-body">' + placard.description + '</div>' + '</div></li>';
	  return placard_items;
	}

	function set_placard_display_title(title) {
	  $('.placard-title').html(title);
	  $('.placard-title-dropdown-container .placard-title').show();
	}

	function set_window_tour_display_title(title) {
	  $('.tour-title').text(decodeURIComponent(title));
	}

	function resize_canvas() {
	  var width = $('.world-window-container').width();

	  $('#canvas').width(width);
	}

	function resize_placard_images() {
	  var placard_container_width = $('.information-window-container').width();
	  $('.placard-image img').each(function () {
	    if ($(this).width() > placard_container_width - 45) {
	      $(this).addClass('spread');
	    } else {
	      $(this).removeClass('spread');
	    }
	  });
	}

	function set_placard_pager(tour, placard) {
	  try {
	    var next = function next(e) {
	      e.preventDefault();
	      window.location.hash = 'tid=' + tour.id + '&pid=' + tour.placards[next_placard_index].id;
	    };

	    var prev = function prev(e) {
	      e.preventDefault();
	      window.location.hash = 'tid=' + tour.id + '&pid=' + tour.placards[prev_placard_index].id;
	    };

	    var max_index = tour.placards.length - 1;
	    var current_placard_index = getPlacardIndexFromTour(placard.id, tour);

	    var next_placard_index = current_placard_index < max_index ? current_placard_index + 1 : false;
	    var prev_placard_index = current_placard_index > 0 ? current_placard_index - 1 : false;

	    if (next_placard_index !== false) {
	      $('.placard-nav.nav-next').css({ display: 'block' });
	    } else {
	      $('.placard-nav.nav-next').hide();
	    }

	    if (prev_placard_index !== false) {
	      $('.placard-nav.nav-prev').css({ display: 'block' });
	    } else {
	      $('.placard-nav.nav-prev').hide();
	    }

	    $('.placard-nav.nav-next').unbind('click').bind('click', next);
	    $('.placard-nav.nav-prev').unbind('click').bind('click', prev);
	  } catch (error) {
	    console.log(error);
	  }
	}

	function getPlacardIndexFromTour(placard_id, tour) {
	  var placard_index;
	  tour.placards.forEach(function (placard, index) {
	    if (placard.id == placard_id) {
	      placard_index = index;
	      return false;
	    }
	  });
	  return placard_index;
	}

	// Returns query string value.
	function get_query_string_val(variable) {
	  var query = window.location.hash;
	  var clean_query = query.replace('#', '');
	  var vars = clean_query.split('&');

	  for (var i = 0; i < vars.length; i++) {
	    var pair = vars[i].split('=');
	    if (pair[0] == variable) {
	      return pair[1];
	    }
	  }
	  return false;
	}

	// Resize windows
	function resize_window(option) {
	  $.cookie('world_window', option);
	  switch (option) {
	    case 'full-world':
	      var remove_class_container = '.world-window-container.split-screen, .information-window-container.split-screen';
	      var remove_class_name = 'split-screen';
	      var add_class_container = '.world-window-container, .information-window-container';
	      var add_class_name = 'world-window-fullscreen';
	      var show_selector_name = '.show-split-screen-world-window-btn';

	      $('.show-full-world-window-btn').hide();
	      $('.show-split-screen-world-window-btn').show();
	      $('.world-window-container').width('100%');
	      break;
	    case 'full-info':
	      var remove_class_container = '.world-window-container.split-screen, .information-window-container.split-screen';
	      var remove_class_name = 'split-screen';
	      var add_class_container = '.world-window-container, .information-window-container';
	      var add_class_name = 'information-window-fullscreen';
	      var show_selector_name = '.show-split-screen-information-window-btn';

	      $('.show-full-information-window-btn').hide();
	      $('.show-split-screen-information-window-btn').show();
	      $('.information-window-container').width('100%');
	      break;
	    default:
	      $('.show-split-screen-world-window-btn').hide();
	      $('.show-split-screen-information-window-btn').hide();
	      $('.world-window-container').width('51%');
	      $('.information-window-container').width('48%');
	      if (option == 'split-world') {
	        $('.show-split-screen-world-window-btn').hide();
	        var remove_class_container = '.world-window-container.world-window-fullscreen, .information-window-container.world-window-fullscreen';
	        var remove_class_name = 'world-window-fullscreen';
	        var add_class_container = '.world-window-container, .information-window-container';
	        var add_class_name = 'split-screen';
	        var show_selector_name = '.show-full-world-window-btn';

	        $('.world-window-container').resizable({ maxWidth: 930, minWidth: 611 });
	      } else {
	        var remove_class_container = '.world-window-container.information-window-fullscreen, .information-window-container.information-window-fullscreen';
	        var remove_class_name = 'information-window-fullscreen';
	        var add_class_container = '.world-window-container, .information-window-container';
	        var add_class_name = 'split-screen';
	        var show_selector_name = '.show-full-information-window-btn';

	        $('.show-split-screen-information-window-btn').hide();
	      }
	  }
	  $(remove_class_container).removeClass(remove_class_name);
	  $(add_class_container).addClass(add_class_name);
	  $(show_selector_name).show();
	  resize_placard_images();
	  resize_canvas();
	}

	function set_active_sidebar_tour_placard_list(active_list) {
	  $('.placard-list').not(active_list).slideUp();
	  $(active_list).slideDown();
	}

	function set_active_sidebar_tour_placard_item(active_item) {
	  $('.placard-info').not(active_item).slideUp();
	  $(active_item).slideDown();
	}

	function scroll_placard_to_top(target) {
	  var placard_row = $(target).parent();
	  var placard_index = placard_row.index();
	  var placard_scroll_position = placard_index * 22;
	  $('.placard-list').animate({
	    scrollTop: placard_scroll_position
	  }, 'fast');
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _DrupalInterface = __webpack_require__(2);

	var _DrupalInterface2 = _interopRequireDefault(_DrupalInterface);

	var _q = __webpack_require__(3);

	var _q2 = _interopRequireDefault(_q);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * An Interface class designed to be defined globally and called from within Unity.
	 * It exposes methods on {@link DrupalInterface} modifying the function signatures so that 
	 * the first argument is the Unity gameObject, the 2nd is the gameObject method name to use
	 * as a callback
	 *
	 * @example  
	 *   DrupalUnityInterface.getTour('gameObject', 'methodName', JSON.stringify(tour_id));
	 *
	 * //Will call gameObject.methodName with a JSON encoded result resolved from DrupalInterface.getTour
	 *
	 */

	var DrupalUnityInterface = (function () {
	  /**
	   * @private
	   */

	  function DrupalUnityInterface() {
	    var _this = this;

	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, DrupalUnityInterface);

	    var default_options = { getWebPlayer: this.defaultGetWebPlayer };
	    /** @private */
	    this.options = Object.assign({}, default_options, options);

	    if (typeof this.options.getWebPlayer !== 'function') {
	      throw new Error('options.getWebPlayer must be a function');
	    }

	    /**
	     * @private
	     */
	    this.getWebPlayer = this.options.getWebPlayer;

	    var public_methods = ['getTour', 'addPlacard', 'getEnvironment', 'getCurrentEnvironment', 'getPlacards'];

	    /** 
	     * @type {DrupalInterface}
	     * @private
	     */
	    this.DrupalInterface = new _DrupalInterface2.default(options);

	    public_methods.map(function (method_name) {
	      _this.wrapMethod(_this.DrupalInterface, method_name);
	    });
	  }

	  /**
	   * @private
	   */

	  _createClass(DrupalUnityInterface, [{
	    key: 'defaultGetWebPlayer',
	    value: function defaultGetWebPlayer() {
	      if (!unityObject) {
	        throw new Error('No unity binary defined on the page!');
	        return;
	      }
	      var web_player = unityObject.getObjectById('unityPlayer');
	      if (web_player) {
	        return web_player;
	      } else {
	        throw new Error('Could not connect to the Unity binary');
	      }
	    }

	    /**
	     * @private
	     * Send a message (string) to a particluar Unity game_object / method
	     */

	  }, {
	    key: 'sendMessageToUnity',
	    value: function sendMessageToUnity(game_object, method, message) {
	      message = JSON.stringify(message);
	      console.log('Sending message "' + message + '" to game_object "' + game_object + '" on the method "' + method + '"');
	      //let web_player = this.getWebPlayer();
	      if (typeof SendMessage != 'undefined') {
	        SendMessage(game_object, method, message);
	      } else {
	        throw new Error('SendMessage function needed to communicate with the unity player is not defined, or not a function');
	      }
	    }

	    /**
	     * @private
	     * Wrap methods on DrupalInterface with ones which will callback to Unity
	     * Using the SendMessage function and JSON encoded args that Unity requires
	     * @param {DrupalInterface} interface_obj
	     * @param {string} method_name  The name of the method to wrap
	     */

	  }, {
	    key: 'wrapMethod',
	    value: function wrapMethod(interface_obj, method_name) {
	      var _this2 = this;

	      //Save a reference to the original method outside function scope
	      var original_method = interface_obj[method_name];

	      this[method_name] = function (game_object, game_object_method, arg_json) {
	        var arg;
	        if (!game_object || typeof game_object != 'string') {
	          throw new Error('You must provide a game_object (string) as the first argument to the ' + method_name + ' method');
	        }
	        if (!game_object_method || typeof game_object_method != 'string') {
	          throw new Error('You must provide a game_object_method (string) as the second argument to the ' + method_name + ' method');
	        }
	        if (arg_json) {
	          try {
	            arg = JSON.parse(arg_json);
	          } catch (e) {
	            throw new Error('Error decoding JSON argument sent to ' + method_name + ' - "' + arg_json + '" is not valid JSON.');
	          }
	        }

	        var result = original_method.call(interface_obj, arg);

	        _this2.ensurePromise(result).then(function (resolved_value) {
	          _this2.sendMessageToUnity(game_object, game_object_method, resolved_value);
	        });
	      };
	    }

	    /**
	     * @private
	     * Ensure that a value is formatted as a promise.
	     *
	     * In other words, if value is a promise, return it
	     * else, return a promise already resolved to that value
	     */

	  }, {
	    key: 'ensurePromise',
	    value: function ensurePromise(value) {
	      if (value && value.then) {
	        return value;
	      } else {
	        var deferred = _q2.default.defer();
	        deferred.resolve(value);
	        return deferred.promise;
	      }
	    }

	    /**
	     * Register an event listener from within unity
	     * @param {string} game_object  the name of the game object for callback on event
	     * @param {string} method_name  the name of the method on game object which will be called with an supplied args on event
	     * @param {string} event_name  the name of the event to trigger on
	     *
	     */

	  }, {
	    key: 'addEventListener',
	    value: function addEventListener(game_object, method_name, event_name) {
	      var _this3 = this;

	      this.DrupalInterface.addEventListener(event_name, function (arg) {
	        _this3.sendMessageToUnity(game_object, method_name, arg);
	      });
	    }
	    /**
	     * Trigger an event on the interface.  Both page code and code in Unity have the opportunity to listen to events
	     * @param {string} event_name  the name of the event to trigger on
	     * @param {string} [json_encode_args]  a JSON encoded array of arguments to pass to event listeners
	     */

	  }, {
	    key: 'triggerEvent',
	    value: function triggerEvent(event_name, arg) {
	      var decoded_arg;
	      if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) !== undefined) {
	        try {
	          decoded_arg = JSON.parse(arg);
	        } catch (error) {
	          throw new Error('Argument sent to DrupalUnityInterface.triggerEvent must be in the form of a JSON-encoded array. Could not decode.');
	        }
	      }
	      this.DrupalInterface.triggerEvent(event_name, decoded_arg);
	    }
	  }]);

	  return DrupalUnityInterface;
	})();

	exports.default = DrupalUnityInterface;

	function unserializeArgs(args_json) {
	  return args_json.map(function (json) {
	    if (typeof json == 'string') {
	      return JSON.parse(json);
	    } else {
	      throw new Error('Arguments sent to the Drupal Unity Interface must be JSON strings');
	    }
	  });
	}

	if (typeof window != 'undefined') {
	  window.DrupalUnityInterface = new DrupalUnityInterface();
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Q = __webpack_require__(3);
	var _request = __webpack_require__(6);
	var queryString = __webpack_require__(11);

	var DRUPAL_INTERFACE_SUCCESS = 'DRUPAL_INTERFACE_SUCCESS';
	var DRUPAL_INTERFACE_FAIL = 'DRUPAL_INTERFACE_FAIL';

	/**
	 * DrupalInterface provides an interface for accessing Unity world related information stored within Drupal.
	 * Most methods are asynchronous and return Promises {@see https://promisesaplus.com} 
	 * The return values listed below are the values to which the promises resolve
	 *
	 * __Note: If calling this interface from within Unity you should use {@link DrupalUnityInterface} instead. The first two arguments will always
	 * be gameObject (string) and methodName (string) - and then one additional argument, which should be first passed to JSON.stringify__
	 *
	 * i.e.  getTour('myGameObject', 'myCallbackMethod', 7);
	 * returns the tour with an id of 7
	 *
	 * All Types listed are plain javascript objects with the properties listed under their type definitions
	 *
	 */

	var DrupalInterface = (function () {

	  /**
	   * @param {object} [config]
	   * @param {string} config.ajax_domain  The domain to which ajax calls will be sent.
	   * If none is provided, will attempt to determine correct domain from window.location.host
	   *
	   */

	  function DrupalInterface() {
	    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, DrupalInterface);

	    var default_config = {};
	    /** @private */
	    this.config = Object.assign(default_config, config);
	    this.config.ajax_domain || (this.config.ajax_domain = getCurrentDomain());

	    /** @private */
	    this.event_listeners = {};
	  }

	  /**
	   * @param {string} event_name - i.e. 'placard_selected' 
	   * @param {function} [callback]
	   * 
	   * Callback will be called on event, with relevant data
	   * Note: from the Unity binary, this will instead take the form
	   * DrupalUnityInterface.addEventListener('gameObject', 'methodName', 'eventName');
	   *
	   */

	  _createClass(DrupalInterface, [{
	    key: 'addEventListener',
	    value: function addEventListener(event_name, callback) {
	      this.event_listeners[event_name] || (this.event_listeners[event_name] = []);
	      this.event_listeners[event_name].push(callback);
	    }

	    /**
	     * @param {string} event_name - The name of the event to trigger i.e. placard_selected
	     * @param arg - a single argument to pass to the event handlers
	     */

	  }, {
	    key: 'triggerEvent',
	    value: function triggerEvent(event_name, arg) {
	      this.event_listeners[event_name] || (this.event_listeners[event_name] = []);
	      this.event_listeners[event_name].map(function (callback) {
	        callback.call(null, arg);
	      });
	    }

	    /**
	     * Get the current environment object loaded by Drupal
	     *
	     * @return {Environment} environment
	     *
	     */

	  }, {
	    key: 'getCurrentEnvironment',
	    value: function getCurrentEnvironment() {
	      if (typeof Drupal == 'undefined') {
	        var deferred = Q.defer();
	        return deferred.promise;
	      }

	      if (Drupal.settings.custom_unity.current_environment) {
	        var environment_id = Number(Drupal.settings.custom_unity.current_environment.id);
	        return this.getEnvironment(environment_id);
	      }

	      return false;
	    }
	    /**
	     * @private  Helper function which retrieves the Environment structure without fully loaded tours
	     *
	     */

	  }, {
	    key: '_getEnvironment',
	    value: function _getEnvironment(environment_id) {
	      var deferred = Q.defer();
	      var environment;

	      this.request('/unity-services/environment', { id: environment_id }).then(function (results) {

	        environment = results.pop();

	        if (environment) {
	          environment = formatEnvironment(environment);
	        }
	        deferred.resolve(environment);
	      }).catch(function (error) {
	        console.log('Error in _getEnvironment (' + environment_id + ')');
	        console.log(error);
	      });
	      return deferred.promise;
	    }

	    /**
	     * Returns the {@link Environment} requested by id
	     * @param {number} environment_id  The environment id (Drupal node id) of the environment
	     * @return {Environment} environment
	     */

	  }, {
	    key: 'getEnvironment',
	    value: function getEnvironment(environment_id) {
	      var _this = this;

	      if (!environment_id) {
	        throw new Error('environment_id sent to getEnvironment is undefined');
	      }
	      var deferred = Q.defer();
	      var environment;

	      this._getEnvironment(environment_id).then(function (retrieved_environment) {
	        environment = retrieved_environment;
	        return _this.getEnvironmentTours(environment_id);
	      }).then(function (tours) {
	        environment.tours = tours;
	        delete environment.tour_ids;
	        environment.getTour = (function (tour_id) {
	          return this.tours.filter(function (tour) {
	            return Number(tour.id) == tour_id;
	          }).pop();
	        }).bind(environment);
	        deferred.resolve(environment);
	      }).catch(function (error) {
	        console.log('Error getting environment ' + environment_id);
	        console.log(error);
	      });

	      return deferred.promise;
	    }

	    /**
	     * Get the currently selected tour in Drupal
	     * @return {number} tour_id - the Drupal node id of the current tour the using is engaging with in Drupal
	     */

	  }, {
	    key: 'getCurrentTourId',
	    value: function getCurrentTourId() {
	      return getUrlHashParam('tid') ? Number(getUrlHashParam('tid')) : undefined;
	    }
	    /**
	     * Get the currently selected placard in Drupal
	     * @return {number} placard_id - the Drupal placard_id of the currently selected placard in Drupal
	     */

	  }, {
	    key: 'getCurrentPlacardId',
	    value: function getCurrentPlacardId() {
	      return getUrlHashParam('pid') ? Number(getUrlHashParam('pid')) : undefined;
	    }

	    /**
	     * Return the tour specified by the given tour_id
	     *
	     * @param {number} tour_id - Numerical tour id from which to retrieve tours
	     *
	     * @return {Tour} tour
	     *
	     */

	  }, {
	    key: 'getTour',
	    value: function getTour(tour_id) {
	      var _this2 = this;

	      var deferred = Q.defer();

	      var tour = {};

	      this.cached_tours || (this.cached_tours = {});

	      if (typeof this.cached_tours[tour_id] == 'undefined') {

	        this.request('/unity-services/specific-tour', { id: tour_id }).then(function (results) {

	          tour = results.pop();

	          if (tour) {
	            tour.id = Number(tour.id);
	            return _this2.getPlacards(tour.placard_ids);
	          } else {
	            deferred.resolve(undefined);
	          }
	        }).then(function (placards) {
	          tour.placards = placards;
	          delete tour.placard_ids;
	          tour = formatTour(tour);
	          _this2.cached_tours[tour_id] = tour;
	          deferred.resolve(tour);
	        }).catch(function (error) {
	          console.log('Error retrieving tour for tour_id: ' + tour_id);
	          console.log(error);
	        });
	      } else {
	        deferred.resolve(this.cached_tours[tour_id]);
	      }

	      return deferred.promise;
	    }
	    /*
	     * Called on the tour object tour.getPlacard(placard_id)
	     */

	  }, {
	    key: '_tourGetPlacard',
	    value: function _tourGetPlacard(placard_id) {
	      return this.placards.filter(function (placard) {
	        return Number(placard.id) == Number(placard_id);
	      }).pop();
	    }
	    /**
	     * @private
	     */

	  }, {
	    key: 'getEnvironmentTours',
	    value: function getEnvironmentTours(environment_id) {
	      var _this3 = this;

	      var environment_tours;

	      return this.request('/unity-services/environment-tours', { id: environment_id }).then(function (tours) {
	        environment_tours = tours.map(function (tour) {
	          return {
	            id: Number(tour.id),
	            placard_ids: tour.placards,
	            title: tour.title,
	            description: tour.description,
	            tags: tour.tags.map(function (tag) {
	              Number(tag.tid);
	            }),
	            unity_binary: tour.unity_binary
	          };
	        });
	        return environment_tours;
	      }).then(function (tours) {
	        var placard_ids = _this3.getAllPlacardIdsFromTours(tours);
	        return _this3.getPlacards(placard_ids);
	      }).then(function (placards) {
	        return environment_tours.map(function (tour) {
	          tour.placards = tour.placard_ids.map(function (placard_id) {
	            return _this3.getObjectById(placards, placard_id);
	          });
	          tour = formatTour(tour);
	          tour.getPlacard = _this3._tourGetPlacard.bind(tour);
	          return tour;
	        });
	      }).catch(function (error) {
	        console.log('Error retrieving tours for environment ' + environment_id);
	        console.log(error);
	      });
	    }
	    /**
	     * @private
	     * {array} objs - an array of tours or placards with an 'id' property 
	     * {number} id - the relevant id to select
	     *
	     */

	  }, {
	    key: 'getObjectById',
	    value: function getObjectById(objs, id) {
	      return objs.filter(function (obj) {
	        return obj.id == id;
	      }).pop();
	    }
	    /**
	     * @private
	     */

	  }, {
	    key: 'getAllPlacardIdsFromTours',
	    value: function getAllPlacardIdsFromTours(tours) {
	      var placard_ids = {};
	      tours.map(function (tour) {
	        tour.placard_ids.map(function (placard_id) {
	          placard_ids[placard_id] = placard_id;
	        });
	      });
	      return Object.keys(placard_ids).map(function (placard_id) {
	        return Number(placard_id);
	      });
	    }

	    /**
	     * @param {number[]} tour_ids an array of tour ids
	     * @return {Tour[]} tours - returns promise that resolves to an array of tours
	     *
	     */

	  }, {
	    key: 'getTours',
	    value: function getTours(tour_ids) {
	      var _this4 = this;

	      var deferred = Q.defer();

	      var promises = [];
	      var tours = [];

	      tour_ids.map(function (tour_id) {
	        var promise = _this4.getTour(tour_id);
	        promises.push(promise);

	        promise.done(function (tour) {
	          tour.getPlacard = (function (placard_id) {
	            return this.placards.filter(function (placard) {
	              return Number(placard.id) == placard_id;
	            }).pop();
	          }).bind(tour);
	          tours.push(tour);
	        });
	      });

	      Q.all(promises).done(function () {
	        deferred.resolve(tours);
	      });

	      return deferred.promise;
	    }

	    /**
	     *
	     * Return a list of placards, given an array of placard ids
	     * @param {number[]} placard_ids  An array of placard id's (integers)
	     * @return {Placard[]} placards An array of fully loaded placards
	     *
	     */

	  }, {
	    key: 'getPlacards',
	    value: function getPlacards(placard_ids) {
	      var deferred = Q.defer();

	      if (!placard_ids || placard_ids.length == 0) {
	        deferred.resolve([]);
	      } else {
	        var query_ids = placard_ids.join('+');
	        this.request('/unity-services/specific-placard', { id: query_ids }).then(function (placards) {
	          placards = placards.map(function (placard) {
	            return formatPlacard(placard);
	          });

	          deferred.resolve(placards);
	        }).catch(function (error) {
	          console.log('Error getting placards');
	          console.log('Error getting placards (' + placard_ids.join(',') + ')');
	          console.log(error);
	        });
	      }

	      return deferred.promise;
	    }

	    /**
	     *
	     * Prepopulates a create placard page in Drupal with information from the supplied placard
	     *
	     * @param {Placard} placard - the placard to be added
	     * @return {boolean} success - True if no errors where encountered 
	     *
	     */

	  }, {
	    key: 'addPlacard',
	    value: function addPlacard(placard) {
	      var deferred = Q.defer();
	      var query_string = '';
	      for (var key in placard) {
	        query_string = query_string.concat(key + '=' + placard[key] + '&');
	      }
	      window.open('node/add/placard?' + query_string, '_blank');
	      deferred.resolve(true);
	      return deferred.promise;
	    }

	    /**
	     * @private
	     * HTTP request
	     */

	  }, {
	    key: 'request',
	    value: function request(uri, query_args) {
	      var deferred = Q.defer();
	      var query_string = '?';
	      for (var key in query_args) {
	        query_string = query_string.concat(key + '=' + query_args[key] + '&');
	      }

	      var request_url = uri + query_string;
	      _request(request_url, 'GET').then(function (result) {
	        try {
	          if (result.statusCode == 200) {
	            deferred.resolve(JSON.parse(result.body));
	          } else {
	            console.warn('Request to ' + request_url + ' failed');
	          }
	        } catch (error) {
	          console.log('Error retrieving request to ' + request_url);
	          console.log(error);
	        }
	      });

	      return deferred.promise;
	    }
	  }]);

	  return DrupalInterface;
	})();

	//Locally private methods (Can't be accessed from outside this file)
	/*
	 * @private
	 */

	exports.default = DrupalInterface;
	var getCurrentDomain = function getCurrentDomain() {
	  if (typeof window !== 'undefined') {
	    return window.location.host;
	  }
	};

	/**
	 * @private
	 */
	var formatEnvironment = function formatEnvironment(environment_data) {
	  var starting_location = environment_data.starting_location;
	  starting_location.elevation = environment_data.elevation;
	  starting_location.orientation = environment_data.orientation;
	  return {
	    id: Number(environment_data.id),
	    title: formatString(environment_data.title),
	    description: formatString(environment_data.description),
	    starting_location: formatLocation(starting_location)
	  };
	};

	var formatTour = function formatTour(tour) {
	  return {
	    id: formatNumber(tour.id),
	    title: formatString(tour.title),
	    description: formatString(tour.description),
	    unity_binary: formatString(tour.unity_binary),
	    placards: tour.placards
	  };
	};

	var formatPlacard = function formatPlacard(placard) {
	  var layer = placard.layer && placard.layer.value ? String(placard.layer.value) : '';
	  var image_url = !placard.field_image || isEmptyArray(placard.field_image) ? '' : String(placard.field_image);
	  var location = placard.location;
	  location.elevation = placard.elevation;
	  location.orientation = placard.orientation;
	  return {
	    id: formatNumber(placard.id),
	    title: formatString(placard.title),
	    description: formatString(placard.description),
	    image_url: image_url,
	    location: formatLocation(location),
	    layer: layer
	  };
	};

	var formatLocation = function formatLocation(location) {
	  return {
	    latitude: formatNumber(location.latitude),
	    longitude: formatNumber(location.longitude),
	    orientation: formatNumber(location.orientation),
	    elevation: formatNumber(location.elevation)
	  };
	};

	var formatNumber = function formatNumber(mixed) {
	  var number = mixed ? Number(mixed) : 0;
	  if (isNaN(number)) {
	    console.warn('Received invalid number \'' + mixed + '\'');
	    return 0;
	  }
	  return number;
	};

	var formatString = function formatString(mixed) {
	  return mixed ? String(mixed) : '';
	};

	/**
	 *  @private
	 *
	 *  Retrieve a value from params in the url hash
	 *  i.e. for http://domain.com/uri#foo=bar  getUrlHashParam('foo') returns 'bar'
	 *
	 */
	var getUrlHashParam = function getUrlHashParam(name) {
	  var exp = "[\\#&]" + name + "=([^&]*)";
	  var regexp = new RegExp(exp);
	  var results = regexp.exec(window.location.href);
	  if (results) {
	    return results[1];
	  }
	};

	var isEmptyArray = function isEmptyArray(arg) {
	  return typeof arg.length != 'undefined' && arg.length === 0;
	};

	//Export global, for now
	if (typeof window != 'undefined') {
	  window.DrupalInterface = DrupalInterface;
	  window.di = new DrupalInterface();
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	(function (definition) {
	    "use strict";

	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.

	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);

	    // CommonJS
	    } else if (true) {
	        module.exports = definition();

	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);

	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }

	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;

	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();

	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };

	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }

	})(function () {
	"use strict";

	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}

	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;

	// shims

	// used for fallback in "allResolved"
	var noop = function () {};

	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];

	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;

	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;

	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);

	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();

	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!

	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }

	                throw e;

	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }

	        if (domain) {
	            domain.exit();
	        }
	    }

	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };

	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };

	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;

	        requestTick = function () {
	            process.nextTick(flush);
	        };

	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }

	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };

	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();

	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis

	var array_slice = uncurryThis(Array.prototype.slice);

	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);

	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);

	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);

	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};

	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};

	var object_toString = uncurryThis(Object.prototype.toString);

	function isObject(value) {
	    return value === Object(value);
	}

	// generator related shims

	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}

	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}

	// long stack traces

	var STACK_JUMP_SEPARATOR = "From previous event:";

	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);

	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}

	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];

	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}

	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}

	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }

	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }

	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}

	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

	    if (!fileNameAndLineNumber) {
	        return false;
	    }

	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];

	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}

	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }

	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }

	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}

	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}

	// end of shims
	// beginning of real work

	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }

	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;

	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;

	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;

	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}

	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;

	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };

	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };

	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };

	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }

	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;

	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);

	        messages = void 0;
	        progressListeners = void 0;
	    }

	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(Q(value));
	    };

	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }

	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };

	    return deferred;
	}

	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};

	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}

	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6

	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};

	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};

	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};

	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};

	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}

	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};

	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }

	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };

	    promise.inspect = inspect;

	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }

	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }

	    return promise;
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks

	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }

	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }

	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }

	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_rejected(exception));
	        }]);
	    });

	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }

	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);

	    return deferred.promise;
	};

	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};

	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);

	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};

	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}

	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};

	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};

	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};

	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};

	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */

	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}

	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}

	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}

	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}

	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};

	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}

	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};

	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}

	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};

	//// BEGIN UNHANDLED REJECTION TRACKING

	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;

	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;

	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}

	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }

	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}

	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }

	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}

	Q.resetUnhandledRejections = resetUnhandledRejections;

	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};

	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};

	resetUnhandledRejections();

	//// END UNHANDLED REJECTION TRACKING

	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });

	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);

	    return rejection;
	}

	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}

	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}

	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}

	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}

	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};

	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;

	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.

	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}

	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}

	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}

	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}

	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}

	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};

	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};

	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};

	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};

	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};

	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};

	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};

	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};

	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};

	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};

	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};

	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};

	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};

	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};

	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};

	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};

	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}

	Promise.prototype.all = function () {
	    return all(this);
	};

	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;

	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }

	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];

	        pendingCount++;

	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);

	    return deferred.promise;
	}

	Promise.prototype.any = function () {
	    return any(this);
	};

	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}

	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};

	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}

	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};

	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};

	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};

	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}

	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};

	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};

	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};

	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};

	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };

	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;

	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }

	    promise.then(void 0, onUnhandledError);
	};

	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};

	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);

	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);

	    return deferred.promise;
	};

	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};

	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};

	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};

	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}

	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};

	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};

	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();

	return Q;

	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(5).setImmediate))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(4).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).setImmediate, __webpack_require__(5).clearImmediate))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(Buffer) {(function (root, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.httpinvoke = factory();
	  }
	}(this, /* jshint -W030 */
	/* jshint -W033 */
	/* jshint -W068 */
	(function() {
	/* jshint +W030 */
	/* jshint +W033 */
	/* jshint +W068 */
	    'use strict';
	    var global;
	    /* jshint unused:true */
	    ;global = window;;var resolve = 0, reject = 1, progress = 2, chain = function(a, b) {
	    /* jshint expr:true */
	    if(a && a.then) {
	        a.then(function() {
	            b[resolve].apply(null, arguments);
	        }, function() {
	            b[reject].apply(null, arguments);
	        }, function() {
	            b[progress].apply(null, arguments);
	        });
	    } else {
	        b[resolve](a);
	    }
	    /* jshint expr:false */
	}, nextTick = (global.process && global.process.nextTick) || global.setImmediate || global.setTimeout, mixInPromise = function(o) {
	    var value, queue = [], state = progress;
	    var makeState = function(newstate) {
	        o[newstate] = function() {
	            var i, p;
	            if(queue) {
	                value = [].slice.call(arguments);
	                state = newstate;

	                for(i = 0; i < queue.length; i += 1) {
	                    if(typeof queue[i][state] === 'function') {
	                        try {
	                            p = queue[i][state].apply(null, value);
	                            if(state < progress) {
	                                chain(p, queue[i]._);
	                            }
	                        } catch(err) {
	                            queue[i]._[reject](err);
	                        }
	                    } else if(state < progress) {
	                        queue[i]._[state].apply(null, value);
	                    }
	                }
	                if(state < progress) {
	                    queue = null;
	                }
	            }
	        };
	    };
	    makeState(progress);
	    makeState(resolve);
	    makeState(reject);
	    o.then = function() {
	        var item = [].slice.call(arguments);
	        item._ = mixInPromise({});
	        if(queue) {
	            queue.push(item);
	        } else if(typeof item[state] === 'function') {
	            nextTick(function() {
	                chain(item[state].apply(null, value), item._);
	            });
	        }
	        return item._;
	    };
	    return o;
	}, isArrayBufferView = /* jshint undef:false */function(input) {
	    return typeof input === 'object' && input !== null && (
	        (global.ArrayBufferView && input instanceof ArrayBufferView) ||
	        (global.Int8Array && input instanceof Int8Array) ||
	        (global.Uint8Array && input instanceof Uint8Array) ||
	        (global.Uint8ClampedArray && input instanceof Uint8ClampedArray) ||
	        (global.Int16Array && input instanceof Int16Array) ||
	        (global.Uint16Array && input instanceof Uint16Array) ||
	        (global.Int32Array && input instanceof Int32Array) ||
	        (global.Uint32Array && input instanceof Uint32Array) ||
	        (global.Float32Array && input instanceof Float32Array) ||
	        (global.Float64Array && input instanceof Float64Array)
	    );
	}/* jshint undef:true */, isArray = function(object) {
	    return Object.prototype.toString.call(object) === '[object Array]';
	}, isFormData = function(input) {
	    return typeof input === 'object' && input !== null && global.FormData &&
	        input instanceof global.FormData;
	}, isByteArray = /* jshint undef:false */function(input) {
	    return typeof input === 'object' && input !== null && (
	        (global.Buffer && input instanceof Buffer) ||
	        (global.Blob && input instanceof Blob) ||
	        (global.File && input instanceof File) ||
	        (global.ArrayBuffer && input instanceof ArrayBuffer) ||
	        isArrayBufferView(input) ||
	        isArray(input)
	    );
	}/* jshint undef:true */, supportedMethods = ',GET,HEAD,PATCH,POST,PUT,DELETE,', pass = function(value) {
	    return value;
	}, _undefined, absoluteURLRegExp = /^[a-z][a-z0-9.+-]*:/i, addHook = function(type, hook) {
	    'use strict';
	    if(typeof hook !== 'function') {
	        throw new Error('TODO error');
	    }
	    if(!this._hooks[type]) {
	        throw new Error('TODO error');
	    }
	    var httpinvoke = build();
	    for(var i in this._hooks) {
	        if(this._hooks.hasOwnProperty(i)) {
	            httpinvoke._hooks[i].push.apply(httpinvoke._hooks[i], this._hooks[i]);
	        }
	    }
	    httpinvoke._hooks[type].push(hook);
	    return httpinvoke;
	}, initHooks = function() {
	    return {
	        finished:[],
	        downloading:[],
	        uploading:[],
	        gotStatus:[]
	    };
	};
	;
	    /* jshint unused:false */
	    // this could be a simple map, but with this "compression" we save about 100 bytes, if minified (50 bytes, if also gzipped)
	    var statusTextToCode = (function() {
	        for(var group = arguments.length, map = {};group--;) {
	            for(var texts = arguments[group].split(','), index = texts.length;index--;) {
	                map[texts[index]] = (group + 1) * 100 + index;
	            }
	        }
	        return map;
	    })(
	        'Continue,Switching Protocols',
	        'OK,Created,Accepted,Non-Authoritative Information,No Content,Reset Content,Partial Content',
	        'Multiple Choices,Moved Permanently,Found,See Other,Not Modified,Use Proxy,_,Temporary Redirect',
	        'Bad Request,Unauthorized,Payment Required,Forbidden,Not Found,Method Not Allowed,Not Acceptable,Proxy Authentication Required,Request Timeout,Conflict,Gone,Length Required,Precondition Failed,Request Entity Too Large,Request-URI Too Long,Unsupported Media Type,Requested Range Not Satisfiable,Expectation Failed',
	        'Internal Server Error,Not Implemented,Bad Gateway,Service Unavailable,Gateway Time-out,HTTP Version Not Supported'
	    );
	    var upgradeByteArray = global.Uint8Array ? function(array) {
	        return new Uint8Array(array);
	    } : pass;
	    var binaryStringToByteArray = function(str, bytearray) {
	        for(var i = bytearray.length; i < str.length;) {
	            /* jshint bitwise:false */
	            bytearray.push(str.charCodeAt(i++) & 255);
	            /* jshint bitwise:true */
	        }
	        return bytearray;
	    };
	    var countStringBytes = function(string) {
	        for(var c, n = 0, i = string.length;i--;) {
	            c = string.charCodeAt(i);
	            n += c < 128 ? 1 : (c < 2048 ? 2 : 3);
	        }
	        return n;
	    };
	    var responseBodyToBytes, responseBodyLength;
	    try {
	        /* jshint evil:true */
	        execScript('Function httpinvoke0(B,A,C)\r\nDim i\r\nFor i=C to LenB(B)\r\nA.push(AscB(MidB(B,i,1)))\r\nNext\r\nEnd Function\r\nFunction httpinvoke1(B)\r\nhttpinvoke1=LenB(B)\r\nEnd Function', 'vbscript');
	        /* jshint evil:false */
	        responseBodyToBytes = function(binary, bytearray) {
	            // that vbscript counts from 1, not from 0
	            httpinvoke0(binary, bytearray, bytearray.length + 1);
	            return bytearray;
	        };
	        // cannot just assign the function, because httpinvoke1 is not a javascript 'function'
	        responseBodyLength = function(binary) {
	            return httpinvoke1(binary);
	        };
	    } catch(err) {
	    }
	    var responseByteArray = function(xhr, bytearray) {
	        // If response body has bytes out of printable ascii character range, then
	        // accessing xhr.responseText on Internet Explorer throws "Could not complete the operation due to error c00ce514".
	        // Therefore, try getting the bytearray from xhr.responseBody.
	        // Also responseBodyToBytes on some Internet Explorers is not defined, because of removed vbscript support.
	        return 'responseBody' in xhr && responseBodyToBytes ? responseBodyToBytes(xhr.responseBody, bytearray) : binaryStringToByteArray(xhr.responseText, bytearray);
	    };
	    var responseByteArrayLength = function(xhr) {
	        return 'responseBody' in xhr && responseBodyLength ? responseBodyLength(xhr.responseBody) : xhr.responseText.length;
	    };
	    var fillOutputHeaders = function(xhr, outputHeaders) {
	        var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
	        var atLeastOne = false;
	        for(var i = headers.length, colon, header; i--;) {
	            if((colon = headers[i].indexOf(':')) >= 0) {
	                outputHeaders[headers[i].substr(0, colon).toLowerCase()] = headers[i].substr(colon + 2);
	                atLeastOne = true;
	            }
	        }
	        return atLeastOne;
	    };

	    var urlPartitioningRegExp = /^(?:([a-z][a-z0-9.+-]*:)|)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
	    var isCrossDomain = function(location, url) {
	        if(!absoluteURLRegExp.test(url) && url.substr(0, 2) !== '//') {
	            return false;
	        }
	        url = urlPartitioningRegExp.exec(url.toLowerCase());
	        location = urlPartitioningRegExp.exec(location.toLowerCase()) || [];
	        var locationPort = location[3] || (location[1] === 'http:' ? '80' : '443');
	        return !!((url[1] && url[1] !== location[1]) || url[2] !== location[2] || (url[3] || (url[1] ? (url[1] === 'http:' ? '80' : '443') : locationPort)) !== locationPort);
	    };

	var build = function() {
	    var createXHR;
	    var httpinvoke = function(url, method, options, cb) {
	        /* jshint unused:true */
	        ;/* global httpinvoke, url, method, options, cb */
	/* global nextTick, mixInPromise, pass, progress, reject, resolve, supportedMethods, isArray, isArrayBufferView, isFormData, isByteArray, _undefined, absoluteURLRegExp */
	/* global setTimeout */
	/* global crossDomain */// this one is a hack, because when in nodejs this is not really defined, but it is never needed
	/* jshint -W020 */
	var hook, promise, failWithoutRequest, uploadProgressCb, downloadProgressCb, inputLength, inputHeaders, statusCb, outputHeaders, exposedHeaders, status, outputBinary, input, outputLength, outputConverter, protocol, anonymous, system;
	hook = function(type, args) {
	    var hooks = httpinvoke._hooks[type];
	    for(var i = 0; i < hooks.length; i += 1) {
	        args = hooks[i].apply(null, args);
	    }
	    return args;
	};
	/*************** COMMON initialize parameters **************/
	var downloadTimeout, uploadTimeout, timeout;
	if(!method) {
	    // 1 argument
	    // method, options, cb skipped
	    method = 'GET';
	    options = {};
	} else if(!options) {
	    // 2 arguments
	    if(typeof method === 'string') {
	        // options. cb skipped
	        options = {};
	    } else if(typeof method === 'object') {
	        // method, cb skipped
	        options = method;
	        method = 'GET';
	    } else {
	        // method, options skipped
	        options = {
	            finished: method
	        };
	        method = 'GET';
	    }
	} else if(!cb) {
	    // 3 arguments
	    if(typeof method === 'object') {
	        // method skipped
	        method.finished = options;
	        options = method;
	        method = 'GET';
	    } else if(typeof options === 'function') {
	        // options skipped
	        options = {
	            finished: options
	        };
	    }
	    // cb skipped
	} else {
	    // 4 arguments
	    options.finished = cb;
	}
	var safeCallback = function(name, aspectBefore, aspectAfter) {
	    return function() {
	        var args = [], _cb, failedOnHook = false, fail = function(err, args) {
	            _cb = cb;
	            cb = null;
	            nextTick(function() {
	                /* jshint expr:true */
	                _cb && _cb(err);
	                /* jshint expr:false */
	                promise();
	                if(!_cb && !failedOnHook) {
	                    throw err;
	                }
	            });
	            return name === 'finished' ? [err] : args;
	        };
	        aspectBefore.apply(null, args);
	        try {
	            args = hook(name, [].slice.call(arguments));
	        } catch(err) {
	            failedOnHook = true;
	            args = fail(err, args);
	        }
	        if(options[name]) {
	            try {
	                options[name].apply(null, args);
	            } catch(err) {
	                args = fail(err, args);
	            }
	        }
	        aspectAfter.apply(null, args);
	    };
	};
	failWithoutRequest = function(cb, err) {
	    if(!(err instanceof Error)) {
	        // create error here, instead of nextTick, to preserve stack
	        err = new Error('Error code #' + err +'. See https://github.com/jakutis/httpinvoke#error-codes');
	    }
	    nextTick(function() {
	        if(cb === null) {
	            return;
	        }
	        cb(err);
	    });
	    promise = function() {
	    };
	    return mixInPromise(promise);
	};

	uploadProgressCb = safeCallback('uploading', pass, function(current, total) {
	    promise[progress]({
	        type: 'upload',
	        current: current,
	        total: total
	    });
	});
	downloadProgressCb = safeCallback('downloading', pass, function(current, total, partial) {
	    promise[progress]({
	        type: 'download',
	        current: current,
	        total: total,
	        partial: partial
	    });
	});
	statusCb = safeCallback('gotStatus', function() {
	    statusCb = null;
	    if(downloadTimeout) {
	        setTimeout(function() {
	            if(cb) {
	                cb(new Error('download timeout'));
	                promise();
	            }
	        }, downloadTimeout);
	    }
	}, function(statusCode, headers) {
	    promise[progress]({
	        type: 'headers',
	        statusCode: statusCode,
	        headers: headers
	    });
	});
	cb = safeCallback('finished', function() {
	    cb = null;
	    promise();
	}, function(err, body, statusCode, headers) {
	    var res = {
	        body: body,
	        statusCode: statusCode,
	        headers: headers
	    };
	    if(err) {
	        return promise[reject](err, res);
	    }
	    promise[resolve](res);
	});
	var converters = options.converters || {};
	var inputConverter;
	inputHeaders = (function(input) {
	    var output = {};
	    for(var i in input) {
	        if(input.hasOwnProperty(i)) {
	            output[i] = input[i];
	        }
	    }
	    return output;
	})(options.headers || {});
	outputHeaders = {};
	exposedHeaders = options.corsExposedHeaders || [];
	exposedHeaders.push.apply(exposedHeaders, ['Cache-Control', 'Content-Language', 'Content-Type', 'Content-Length', 'Expires', 'Last-Modified', 'Pragma', 'Content-Range', 'Content-Encoding']);
	/*************** COMMON convert and validate parameters **************/
	var validateInputHeaders = function(headers) {
	    var noSec = httpinvoke.forbiddenInputHeaders.indexOf('sec-*') >= 0;
	    var noProxy = httpinvoke.forbiddenInputHeaders.indexOf('proxy-*') >= 0;
	    for(var header in headers) {
	        if(headers.hasOwnProperty(header)) {
	            var headerl = header.toLowerCase();
	            if(httpinvoke.forbiddenInputHeaders.indexOf(headerl) >= 0) {
	                throw [14, header];
	            }
	            if(noProxy && headerl.substr(0, 'proxy-'.length) === 'proxy-') {
	                throw [15, header];
	            }
	            if(noSec && headerl.substr(0, 'sec-'.length) === 'sec-') {
	                throw [16, header];
	            }
	        }
	    }
	};
	try {
	    validateInputHeaders(inputHeaders);
	} catch(err) {
	    return failWithoutRequest(cb, err);
	}
	if(!httpinvoke.relativeURLs && !absoluteURLRegExp.test(url)) {
	    return failWithoutRequest(cb, [26, url]);
	}
	protocol = url.substr(0, url.indexOf(':'));
	if(absoluteURLRegExp.test(url) && protocol !== 'http' && protocol !== 'https') {
	    return failWithoutRequest(cb, [25, protocol]);
	}
	anonymous = typeof options.anonymous === 'undefined' ? httpinvoke.anonymousByDefault : options.anonymous;
	system = typeof options.system === 'undefined' ? httpinvoke.systemByDefault : options.system;
	if(typeof options.system !== 'undefined' && system) {
	    anonymous = true;
	}
	var partialOutputMode = options.partialOutputMode || 'disabled';
	if(partialOutputMode.indexOf(',') >= 0 || ',disabled,chunked,joined,'.indexOf(',' + partialOutputMode + ',') < 0) {
	    return failWithoutRequest(cb, [3]);
	}
	if(method.indexOf(',') >= 0 || !httpinvoke.anyMethod && supportedMethods.indexOf(',' + method + ',') < 0) {
	    return failWithoutRequest(cb, [4, method]);
	}
	var optionsOutputType = options.outputType;
	outputBinary = optionsOutputType === 'bytearray';
	if(!optionsOutputType || optionsOutputType === 'text' || outputBinary) {
	    outputConverter = pass;
	} else if(converters['text ' + optionsOutputType]) {
	    outputConverter = converters['text ' + optionsOutputType];
	    outputBinary = false;
	} else if(converters['bytearray ' + optionsOutputType]) {
	    outputConverter = converters['bytearray ' + optionsOutputType];
	    outputBinary = true;
	} else {
	    return failWithoutRequest(cb, [5, optionsOutputType]);
	}
	inputConverter = pass;
	var optionsInputType = options.inputType;
	input = options.input;
	if(input !== _undefined) {
	    if(!optionsInputType || optionsInputType === 'auto') {
	        if(typeof input !== 'string' && !isByteArray(input) && !isFormData(input)) {
	            return failWithoutRequest(cb, [6]);
	        }
	    } else if(optionsInputType === 'text') {
	        if(typeof input !== 'string') {
	            return failWithoutRequest(cb, [7]);
	        }
	    } else if (optionsInputType === 'formdata') {
	        if(!isFormData(input)) {
	            return failWithoutRequest(cb, [8]);
	        }
	    } else if (optionsInputType === 'bytearray') {
	        if(!isByteArray(input)) {
	            return failWithoutRequest(cb, [9]);
	        }
	    } else if(converters[optionsInputType + ' text']) {
	        inputConverter = converters[optionsInputType + ' text'];
	    } else if(converters[optionsInputType + ' bytearray']) {
	        inputConverter = converters[optionsInputType + ' bytearray'];
	    } else if(converters[optionsInputType + ' formdata']) {
	        inputConverter = converters[optionsInputType + ' formdata'];
	    } else {
	        return failWithoutRequest(cb, [10, optionsInputType]);
	    }
	    if(typeof input === 'object' && !isFormData(input)) {
	        if(global.ArrayBuffer && input instanceof global.ArrayBuffer) {
	            input = new global.Uint8Array(input);
	        } else if(isArrayBufferView(input)) {
	            input = new global.Uint8Array(input.buffer, input.byteOffset, input.byteLength);
	        }
	    }
	    try {
	        input = inputConverter(input);
	    } catch(err) {
	        return failWithoutRequest(cb, err);
	    }
	} else {
	    if(optionsInputType && optionsInputType !== 'auto') {
	        return failWithoutRequest(cb, [11]);
	    }
	    if(inputHeaders['Content-Type']) {
	        return failWithoutRequest(cb, [12]);
	    }
	}
	var isValidTimeout = function(timeout) {
	    return timeout > 0 && timeout < 1073741824;
	};
	var optionsTimeout = options.timeout;
	if(optionsTimeout !== _undefined) {
	    if(typeof optionsTimeout === 'number' && isValidTimeout(optionsTimeout)) {
	        timeout = optionsTimeout;
	    } else if(isArray(optionsTimeout) && optionsTimeout.length === 2 && isValidTimeout(optionsTimeout[0]) && isValidTimeout(optionsTimeout[1])) {
	        if(httpinvoke.corsFineGrainedTimeouts || !crossDomain) {
	            uploadTimeout = optionsTimeout[0];
	            downloadTimeout = optionsTimeout[1];
	        } else {
	            timeout = optionsTimeout[0] + optionsTimeout[1];
	        }
	    } else {
	        return failWithoutRequest(cb, [13]);
	    }
	}
	if(uploadTimeout) {
	    setTimeout(function() {
	        if(statusCb) {
	            cb(new Error('upload timeout'));
	            promise();
	        }
	    }, uploadTimeout);
	}
	if(timeout) {
	    setTimeout(function() {
	        if(cb) {
	            cb(new Error('timeout'));
	            promise();
	        }
	    }, timeout);
	}

	;
	        /* jshint unused:false */
	        /*************** initialize helper variables **************/
	        var xhr, i, j, currentLocation, crossDomain, output,
	            uploadProgressCbCalled = false,
	            partialPosition = 0,
	            partialBuffer = partialOutputMode === 'disabled' ? _undefined : (outputBinary ? [] : ''),
	            partial = partialBuffer,
	            partialUpdate = function() {
	                if(partialOutputMode === 'disabled') {
	                    return;
	                }
	                if(outputBinary) {
	                    responseByteArray(xhr, partialBuffer);
	                } else {
	                    partialBuffer = xhr.responseText;
	                }
	                partial = partialOutputMode === 'joined' ? partialBuffer : partialBuffer.slice(partialPosition);
	                partialPosition = partialBuffer.length;
	            };
	        var uploadProgress = function(uploaded) {
	            if(!uploadProgressCb) {
	                return;
	            }
	            if(!uploadProgressCbCalled) {
	                uploadProgressCbCalled = true;
	                uploadProgressCb(0, inputLength);
	                if(!cb) {
	                    return;
	                }
	            }
	            uploadProgressCb(uploaded, inputLength);
	            if(uploaded === inputLength) {
	                uploadProgressCb = null;
	            }
	        };
	        try {
	            // IE may throw an exception when accessing
	            // a field from location if document.domain has been set
	            currentLocation = location.href;
	        } catch(_) {
	            // Use the href attribute of an A element
	            // since IE will modify it given document.location
	            currentLocation = document.createElement('a');
	            currentLocation.href = '';
	            currentLocation = currentLocation.href;
	        }
	        crossDomain = isCrossDomain(currentLocation, url);
	        /*************** start XHR **************/
	        if(typeof input === 'object' && !isFormData(input) && httpinvoke.requestTextOnly) {
	            return failWithoutRequest(cb, [17]);
	        }
	        if(crossDomain && !httpinvoke.cors) {
	            return failWithoutRequest(cb, [18]);
	        }
	        for(j = ['DELETE', 'PATCH', 'PUT', 'HEAD'], i = j.length;i-- > 0;) {
	            if(crossDomain && method === j[i] && !httpinvoke['cors' + j[i]]) {
	                return failWithoutRequest(cb, [19, method]);
	            }
	        }
	        if(method === 'PATCH' && !httpinvoke.PATCH) {
	            return failWithoutRequest(cb, [20]);
	        }
	        if(!createXHR) {
	            return failWithoutRequest(cb, [21]);
	        }
	        xhr = createXHR(crossDomain, {
	            mozAnon: anonymous,
	            mozSystem: system
	        });
	        try {
	            xhr.open(method, url, true);
	        } catch(e) {
	            return failWithoutRequest(cb, [22, url]);
	        }
	        if(httpinvoke.corsCredentials) {
	            if((typeof options.anonymous !== 'undefined' && !anonymous) || (options.corsCredentials && typeof xhr.withCredentials === 'boolean')) {
	                xhr.withCredentials = true;
	            }
	        }
	        if(crossDomain && options.corsOriginHeader) {
	            // on some Android devices CORS implementations are buggy
	            // that is why there needs to be two workarounds:
	            // 1. custom header with origin has to be passed, because they do not send Origin header on the actual request
	            // 2. caching must be avoided, because of unknown reasons
	            // read more: http://www.kinvey.com/blog/107/how-to-build-a-service-that-supports-every-android-browser

	            // workaraound for #1: sending origin in custom header, also see the server-side part of the workaround in dummyserver.js
	            inputHeaders[options.corsOriginHeader] = location.protocol + '//' + location.host;
	        }

	        /*************** bind XHR event listeners **************/
	        var abOrZero = function(object, propertyA, propertyB) {
	            if(typeof object[propertyA] !== 'undefined') {
	                return object[propertyA];
	            }
	            if(typeof object[propertyB] !== 'undefined') {
	                return object[propertyB];
	            }
	            return 0;
	        };
	        var onuploadprogress = function(progressEvent) {
	            if(cb && progressEvent.lengthComputable) {
	                if(inputLength === _undefined) {
	                    inputLength = abOrZero(progressEvent, 'total', 'totalSize');
	                    uploadProgress(0);
	                }
	                uploadProgress(abOrZero(progressEvent, 'loaded', 'position'));
	            }
	        };
	        if('upload' in xhr) {
	            xhr.upload.onerror = function() {
	                received.error = true;
	                // must check, because some callbacks are called synchronously, thus throwing exceptions and breaking code
	                /* jshint expr:true */
	                cb && cb(new Error('network error'));
	                /* jshint expr:false */
	            };
	            xhr.upload.onprogress = onuploadprogress;
	        } else if('onuploadprogress' in xhr) {
	            xhr.onuploadprogress = onuploadprogress;
	        }

	        if('onerror' in xhr) {
	            xhr.onerror = function() {
	                received.error = true;
	                //inspect('onerror', arguments[0]);
	                //dbg('onerror');
	                // For 4XX and 5XX response codes Firefox 3.6 cross-origin request ends up here, but has correct statusText, but no status and headers
	                onLoad();
	            };
	        }
	        var ondownloadprogress = function(progressEvent) {
	            onHeadersReceived(false);
	            // There is a bug in Chrome 10 on 206 response with Content-Range=0-4/12 - total must be 5
	            // 'total', 12, 'totalSize', 12, 'loaded', 5, 'position', 5, 'lengthComputable', true, 'status', 206
	            // console.log('total', progressEvent.total, 'totalSize', progressEvent.totalSize, 'loaded', progressEvent.loaded, 'position', progressEvent.position, 'lengthComputable', progressEvent.lengthComputable, 'status', status);
	            // httpinvoke does not work around this bug, because Chrome 10 is practically not used at all, as Chrome agressively auto-updates itself to latest version
	            try {
	                var current = abOrZero(progressEvent, 'loaded', 'position');
	                if(progressEvent.lengthComputable) {
	                    outputLength = abOrZero(progressEvent, 'total', 'totalSize');
	                }

	                // Opera 12 progress events has a bug - .loaded can be higher than .total
	                // see http://dev.opera.com/articles/view/xhr2/#comment-96081222
	                /* jshint expr:true */
	                cb && current <= outputLength && !statusCb && (partialUpdate(), downloadProgressCb(current, outputLength, partial));
	                /* jshint expr:false */
	            } catch(_) {
	            }
	        };
	        if('onloadstart' in xhr) {
	            xhr.onloadstart = ondownloadprogress;
	        }
	        if('onloadend' in xhr) {
	            xhr.onloadend = ondownloadprogress;
	        }
	        if('onprogress' in xhr) {
	            xhr.onprogress = ondownloadprogress;
	        }
	        /*
	        var inspect = function(name, obj) {
	            return;
	            console.log('INSPECT ----- ', name, url);
	            for(var i in obj) {
	                try {
	                    console.log(name, 'PASS', i, typeof obj[i], typeof obj[i] === 'function' ? '[code]' : obj[i]);
	                } catch(_) {
	                    console.log(name, 'FAIL', i);
	                }
	            }
	        };
	        var dbg = function(name) {
	            console.log('DBG ----- ', name, url);
	            inspect('xhr', xhr);
	            try {
	                console.log('PASS', 'headers', xhr.getAllResponseHeaders());
	            } catch(_) {
	                console.log('FAIL', 'headers');
	            }
	            try {
	                console.log('PASS', 'cache-control', xhr.getResponseHeader('Cache-Control'));
	            } catch(_) {
	                console.log('FAIL', 'cache-control');
	            }
	        };
	        */
	        var received = {};
	        var mustBeIdentity;
	        var tryHeadersAndStatus = function(lastTry) {
	            try {
	                if(xhr.status) {
	                    received.status = true;
	                }
	            } catch(_) {
	            }
	            try {
	                if(xhr.statusText) {
	                    received.status = true;
	                }
	            } catch(_) {
	            }
	            try {
	                if(xhr.responseText) {
	                    received.entity = true;
	                }
	            } catch(_) {
	            }
	            try {
	                if(xhr.response) {
	                    received.entity = true;
	                }
	            } catch(_) {
	            }
	            try {
	                if(responseBodyLength(xhr.responseBody)) {
	                    received.entity = true;
	                }
	            } catch(_) {
	            }

	            if(!statusCb) {
	                return;
	            }

	            if(received.status || received.entity || received.success || lastTry) {
	                if(typeof xhr.contentType === 'string' && xhr.contentType) {
	                    if(xhr.contentType !== 'text/html' || xhr.responseText !== '') {
	                        // When no entity body and/or no Content-Type header is sent,
	                        // XDomainRequest on IE-8 defaults to text/html xhr.contentType.
	                        // Also, empty string is not a valid 'text/html' entity.
	                        outputHeaders['content-type'] = xhr.contentType;
	                        received.headers = true;
	                    }
	                }
	                for(var i = 0; i < exposedHeaders.length; i++) {
	                    var header;
	                    try {
	                        /* jshint boss:true */
	                        if(header = xhr.getResponseHeader(exposedHeaders[i])) {
	                        /* jshint boss:false */
	                            outputHeaders[exposedHeaders[i].toLowerCase()] = header;
	                            received.headers = true;
	                        }
	                    } catch(err) {
	                    }
	                }
	                try {
	                    // note - on Opera 11.10 and 11.50 calling getAllResponseHeaders may introduce side effects on xhr and responses will timeout when server responds with some HTTP status codes
	                    if(fillOutputHeaders(xhr, outputHeaders)) {
	                        received.headers = true;
	                    }
	                } catch(err) {
	                }

	                mustBeIdentity = outputHeaders['content-encoding'] === 'identity' || (!crossDomain && !outputHeaders['content-encoding']);
	                if(mustBeIdentity && 'content-length' in outputHeaders) {
	                    outputLength = Number(outputHeaders['content-length']);
	                }

	                if(!status && (!crossDomain || httpinvoke.corsStatus)) {
	                    // Sometimes on IE 9 accessing .status throws an error, but .statusText does not.
	                    try {
	                        if(xhr.status) {
	                            status = xhr.status;
	                        }
	                    } catch(_) {
	                    }
	                    if(!status) {
	                        try {
	                            status = statusTextToCode[xhr.statusText];
	                        } catch(_) {
	                        }
	                    }
	                    // sometimes IE returns 1223 when it should be 204
	                    if(status === 1223) {
	                        status = 204;
	                    }
	                    // IE (at least version 6) returns various detailed network
	                    // connection error codes (concretely - WinInet Error Codes).
	                    // For references of their meaning, see http://support.microsoft.com/kb/193625
	                    if(status >= 12001 && status <= 12156) {
	                        status = _undefined;
	                    }
	                }
	            }
	        };
	        var onHeadersReceived = function(lastTry) {
	            if(!cb) {
	                return;
	            }

	            if(!lastTry) {
	                tryHeadersAndStatus(false);
	            }

	            if(!statusCb || (!lastTry && !(received.status && received.headers))) {
	                return;
	            }

	            if(inputLength === _undefined) {
	                inputLength = 0;
	                uploadProgress(0);
	            }
	            uploadProgress(inputLength);
	            if(!cb) {
	                return;
	            }

	            statusCb(status, outputHeaders);
	            if(!cb) {
	                return;
	            }

	            downloadProgressCb(0, outputLength, partial);
	            if(!cb) {
	                return;
	            }
	            if(method === 'HEAD') {
	                downloadProgressCb(0, 0, partial);
	                return cb && cb(null, _undefined, status, outputHeaders);
	            }
	        };
	        var onLoad = function() {
	            if(!cb) {
	                return;
	            }

	            tryHeadersAndStatus(true);

	            var length;
	            try {
	                length =
	                    partialOutputMode !== 'disabled' ?
	                    responseByteArrayLength(xhr) :
	                    (
	                        outputBinary ?
	                        (
	                            'response' in xhr ?
	                            (
	                                xhr.response ?
	                                xhr.response.byteLength :
	                                0
	                            ) :
	                            responseByteArrayLength(xhr)
	                        ) :
	                        countStringBytes(xhr.responseText)
	                    );
	            } catch(_) {
	                length = 0;
	            }
	            if(outputLength !== _undefined) {
	                if(mustBeIdentity) {
	                    if(length !== outputLength && method !== 'HEAD') {
	                        return cb(new Error('network error'));
	                    }
	                } else {
	                    if(received.error) {
	                        return cb(new Error('network error'));
	                    }
	                }
	            } else {
	                outputLength = length;
	            }

	            var noentity = !received.entity && outputLength === 0 && outputHeaders['content-type'] === _undefined;

	            if((noentity && status === 200) || (!received.success && !status && (received.error || ('onreadystatechange' in xhr && !received.readyStateLOADING)))) {
	                /*
	                 * Note: on Opera 10.50, TODO there is absolutely no difference
	                 * between a non 2XX response and an immediate socket closing on
	                 * server side - both give no headers, no status, no entity, and
	                 * end up in 'onload' event. Thus some network errors will end
	                 * up calling "finished" without Error.
	                 */
	                return cb(new Error('network error'));
	            }

	            onHeadersReceived(true);
	            if(!cb) {
	                return;
	            }

	            if(noentity) {
	                downloadProgressCb(0, 0, partial);
	                return cb(null, _undefined, status, outputHeaders);
	            }

	            partialUpdate();
	            downloadProgressCb(outputLength, outputLength, partial);
	            if(!cb) {
	                return;
	            }

	            try {
	                // If XHR2 (there is xhr.response), then there must also be Uint8Array.
	                // But Uint8Array might exist even if not XHR2 (on Firefox 4).
	                cb(null, outputConverter(
	                    partialBuffer || (
	                        outputBinary ?
	                        upgradeByteArray(
	                            'response' in xhr ?
	                            xhr.response || [] :
	                            responseByteArray(xhr, [])
	                        ) :
	                        xhr.responseText
	                    )
	                ), status, outputHeaders);
	            } catch(err) {
	                cb(err);
	            }
	        };
	        var onloadBound = 'onload' in xhr;
	        if(onloadBound) {
	            xhr.onload = function() {
	                received.success = true;
	                //dbg('onload');
	                onLoad();
	            };
	        }
	        if('onreadystatechange' in xhr) {
	            xhr.onreadystatechange = function() {
	                //dbg('onreadystatechange ' + xhr.readyState);
	                if(xhr.readyState === 2) {
	                    // HEADERS_RECEIVED
	                    onHeadersReceived(false);
	                } else if(xhr.readyState === 3) {
	                    // LOADING
	                    received.readyStateLOADING = true;
	                    onHeadersReceived(false);
	                // Instead of 'typeof xhr.onload === "undefined"', we must use
	                // onloadBound variable, because otherwise Firefox 3.5 synchronously
	                // throws a "Permission denied for <> to create wrapper for
	                // object of class UnnamedClass" error
	                } else if(xhr.readyState === 4 && !onloadBound) {
	                    // DONE
	                    onLoad();
	                }
	            };
	        }

	        /*************** set XHR request headers **************/
	        if(!crossDomain || httpinvoke.corsRequestHeaders) {
	            for(var inputHeaderName in inputHeaders) {
	                if(inputHeaders.hasOwnProperty(inputHeaderName)) {
	                    try {
	                        xhr.setRequestHeader(inputHeaderName, inputHeaders[inputHeaderName]);
	                    } catch(err) {
	                        return failWithoutRequest(cb, [23, inputHeaderName]);
	                    }
	                }
	            }
	        }
	        /*************** invoke XHR request process **************/
	        nextTick(function() {
	            if(!cb) {
	                return;
	            }
	            if(outputBinary) {
	                try {
	                    if(partialOutputMode === 'disabled' && 'response' in xhr) {
	                        xhr.responseType = 'arraybuffer';
	                    } else {
	                        // mime type override must be done before receiving headers - at least for Safari 5.0.4
	                        xhr.overrideMimeType('text/plain; charset=x-user-defined');
	                    }
	                } catch(_) {
	                }
	            }
	            if(isFormData(input)) {
	                try {
	                    xhr.send(input);
	                } catch(err) {
	                    return failWithoutRequest(cb, [24]);
	                }
	            } else if(typeof input === 'object') {
	                var triedSendArrayBufferView = false;
	                var triedSendBlob = false;
	                var triedSendBinaryString = false;

	                var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || global.MSBlobBuilder;
	                if(isArray(input)) {
	                    input = global.Uint8Array ? new Uint8Array(input) : String.fromCharCode.apply(String, input);
	                }
	                var toBlob = BlobBuilder ? function() {
	                    var bb = new BlobBuilder();
	                    bb.append(input);
	                    input = bb.getBlob(inputHeaders['Content-Type'] || 'application/octet-stream');
	                } : function() {
	                    try {
	                        input = new Blob([input], {
	                            type: inputHeaders['Content-Type'] || 'application/octet-stream'
	                        });
	                    } catch(_) {
	                        triedSendBlob = true;
	                    }
	                };
	                var go = function() {
	                    var reader;
	                    if(triedSendBlob && triedSendArrayBufferView && triedSendBinaryString) {
	                        return failWithoutRequest(cb, [24]);
	                    }
	                    if(isArrayBufferView(input)) {
	                        if(triedSendArrayBufferView) {
	                            if(!triedSendBinaryString) {
	                                try {
	                                    input = String.fromCharCode.apply(String, input);
	                                } catch(_) {
	                                    triedSendBinaryString = true;
	                                }
	                            } else if(!triedSendBlob) {
	                                toBlob();
	                            }
	                        } else {
	                            inputLength = input.byteLength;
	                            try {
	                                // if there is ArrayBufferView, then the browser supports sending instances of subclasses of ArayBufferView, otherwise we must send an ArrayBuffer
	                                xhr.send(
	                                    global.ArrayBufferView ?
	                                    input :
	                                    (
	                                        input.byteOffset === 0 && input.length === input.buffer.byteLength ?
	                                        input.buffer :
	                                        (
	                                            input.buffer.slice ?
	                                            input.buffer.slice(input.byteOffset, input.byteOffset + input.length) :
	                                            new Uint8Array([].slice.call(new Uint8Array(input.buffer), input.byteOffset, input.byteOffset + input.length)).buffer
	                                        )
	                                    )
	                                );
	                                return;
	                            } catch(_) {
	                            }
	                            triedSendArrayBufferView = true;
	                        }
	                    } else if(global.Blob && input instanceof Blob) {
	                        if(triedSendBlob) {
	                            if(!triedSendArrayBufferView) {
	                                try {
	                                    reader = new FileReader();
	                                    reader.onerror = function() {
	                                        triedSendArrayBufferView = true;
	                                        go();
	                                    };
	                                    reader.onload = function() {
	                                        try {
	                                            input = new Uint8Array(reader.result);
	                                        } catch(_) {
	                                            triedSendArrayBufferView = true;
	                                        }
	                                        go();
	                                    };
	                                    reader.readAsArrayBuffer(input);
	                                    return;
	                                } catch(_) {
	                                    triedSendArrayBufferView = true;
	                                }
	                            } else if(!triedSendBinaryString) {
	                                try {
	                                    reader = new FileReader();
	                                    reader.onerror = function() {
	                                        triedSendBinaryString = true;
	                                        go();
	                                    };
	                                    reader.onload = function() {
	                                        input = reader.result;
	                                        go();
	                                    };
	                                    reader.readAsBinaryString(input);
	                                    return;
	                                } catch(_) {
	                                    triedSendBinaryString = true;
	                                }
	                            }
	                        } else {
	                            try {
	                                inputLength = input.size;
	                                xhr.send(input);
	                                return;
	                            } catch(_) {
	                                triedSendBlob = true;
	                            }
	                        }
	                    } else {
	                        if(triedSendBinaryString) {
	                            if(!triedSendArrayBufferView) {
	                                try {
	                                    input = binaryStringToByteArray(input, []);
	                                } catch(_) {
	                                    triedSendArrayBufferView = true;
	                                }
	                            } else if(!triedSendBlob) {
	                                toBlob();
	                            }
	                        } else {
	                            try {
	                                inputLength = input.length;
	                                xhr.sendAsBinary(input);
	                                return;
	                            } catch(_) {
	                                triedSendBinaryString = true;
	                            }
	                        }
	                    }
	                    nextTick(go);
	                };
	                go();
	                uploadProgress(0);
	            } else {
	                try {
	                    if(typeof input === 'string') {
	                        inputLength = countStringBytes(input);
	                        xhr.send(input);
	                    } else {
	                        inputLength = 0;
	                        xhr.send(null);
	                    }
	                } catch(err) {
	                    return failWithoutRequest(cb, [24]);
	                }
	                uploadProgress(0);
	            }
	        });

	        /*************** return "abort" function **************/
	        promise = function() {
	            /* jshint expr:true */
	            cb && cb(new Error('abort'));
	            /* jshint expr:false */
	            try {
	                xhr.abort();
	            } catch(err){
	            }
	        };
	        return mixInPromise(promise);
	    };
	    httpinvoke.corsResponseContentTypeOnly = false;
	    httpinvoke.corsRequestHeaders = false;
	    httpinvoke.corsCredentials = false;
	    httpinvoke.cors = false;
	    httpinvoke.corsDELETE = false;
	    httpinvoke.corsHEAD = false;
	    httpinvoke.corsPATCH = false;
	    httpinvoke.corsPUT = false;
	    httpinvoke.corsStatus = false;
	    httpinvoke.corsResponseTextOnly = false;
	    httpinvoke.corsFineGrainedTimeouts = true;
	    httpinvoke.requestTextOnly = false;
	    httpinvoke.anyMethod = false;
	    httpinvoke.relativeURLs = true;
	    (function() {
	        try {
	            createXHR = function(cors, xhrOptions) {
	                return new XMLHttpRequest(xhrOptions);
	            };
	            var tmpxhr = createXHR();
	            httpinvoke.requestTextOnly = !global.Uint8Array && !tmpxhr.sendAsBinary;
	            httpinvoke.cors = 'withCredentials' in tmpxhr;
	            if(httpinvoke.cors) {
	                httpinvoke.corsRequestHeaders = true;
	                httpinvoke.corsCredentials = true;
	                httpinvoke.corsDELETE = true;
	                httpinvoke.corsPATCH = true;
	                httpinvoke.corsPUT = true;
	                httpinvoke.corsHEAD = true;
	                httpinvoke.corsStatus = true;
	                return;
	            }
	        } catch(err) {
	        }
	        try {
	            if(global.XDomainRequest === _undefined) {
	                createXHR = function(cors, xhrOptions) {
	                    return new XMLHttpRequest(xhrOptions);
	                };
	                createXHR();
	            } else {
	                createXHR = function(cors, xhrOptions) {
	                    return cors ? new XDomainRequest() : new XMLHttpRequest(xhrOptions);
	                };
	                createXHR(true);
	                httpinvoke.cors = true;
	                httpinvoke.corsResponseContentTypeOnly = true;
	                httpinvoke.corsResponseTextOnly = true;
	                httpinvoke.corsFineGrainedTimeouts = false;
	            }
	            return;
	        } catch(err) {
	        }
	        try {
	            createXHR();
	            return;
	        } catch(err) {
	        }
	        var candidates = ['Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP'];
	        for(var i = candidates.length; i--;) {
	            try {
	                /* jshint loopfunc:true */
	                createXHR = function() {
	                    return new ActiveXObject(candidates[i]);
	                };
	                /* jshint loopfunc:true */
	                createXHR();
	                httpinvoke.requestTextOnly = true;
	                return;
	            } catch(err) {
	            }
	        }
	        createXHR = _undefined;
	    })();
	    httpinvoke.PATCH = !!(function() {
	        try {
	            createXHR().open('PATCH', location.href, true);
	            return 1;
	        } catch(_) {
	        }
	    })();
	    httpinvoke._hooks = initHooks();
	    httpinvoke.hook = addHook;
	    httpinvoke.anonymousOption = (function() {
	        try {
	            return createXHR(true, {mozAnon: true}).mozAnon === true &&
	                   createXHR(true, {mozAnon: false}).mozAnon === false &&
	                   createXHR(false, {mozAnon: true}).mozAnon === true &&
	                   createXHR(false, {mozAnon: false}).mozAnon === false;
	        } catch(_) {
	            return false;
	        }
	    })();
	    httpinvoke.anonymousByDefault = false;
	    httpinvoke.systemOption = (function() {
	        try {
	            return createXHR(true, {mozAnon: true, mozSystem: true}).mozSystem === true &&
	                   createXHR(true, {mozAnon: true, mozSystem: false}).mozSystem === false &&
	                   createXHR(false, {mozAnon: true, mozSystem: true}).mozSystem === true &&
	                   createXHR(false, {mozAnon: true, mozSystem: false}).mozSystem === false;
	        } catch(_) {
	            return false;
	        }
	    })();
	    httpinvoke.systemByDefault = false;
	    // http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
	    httpinvoke.forbiddenInputHeaders = ['proxy-*', 'sec-*', 'accept-charset', 'accept-encoding', 'access-control-request-headers', 'access-control-request-method', 'connection', 'content-length', 'content-transfer-encoding', 'cookie', 'cookie2', 'date', 'dnt', 'expect', 'host', 'keep-alive', 'origin', 'referer', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'user-agent', 'via'];

	    return httpinvoke;
	};
	    return build();
	})
	));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).Buffer))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	var base64 = __webpack_require__(8)
	var ieee754 = __webpack_require__(9)
	var isArray = __webpack_require__(10)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  this.length = 0
	  this.parent = undefined

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).Buffer, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 9 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(12);

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return {};
		}

		return str.split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	exports.stringify = function (obj) {
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return key;
			}

			if (Array.isArray(val)) {
				return val.sort().map(function (val2) {
					return strictUriEncode(key) + '=' + strictUriEncode(val2);
				}).join('&');
			}

			return strictUriEncode(key) + '=' + strictUriEncode(val);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	};


/***/ }
/******/ ]);