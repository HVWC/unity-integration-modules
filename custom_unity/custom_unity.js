/**
 * @file
 * Add Drupal Behaviors to control widgets on the environment page
 *
 8
 */

import DrupalUnityInterface from './DrupalInterface/src/DrupalUnityInterface';
$ = window.jQuery;
resize_canvas();
window.onresize = function() {
  resize_canvas();
}

  Drupal.behaviors.unityProjectInitializePageLoadDefaultValues = {
    attach: function (context, settings) {
      var drupal_interface = window.DrupalUnityInterface.DrupalInterface;
      var environment;
      resize_canvas();

      window.addEventListener('hashchange', onHashChange, false);

      var tour_id = drupal_interface.getCurrentTourId();
      var placard_id = drupal_interface.getCurrentPlacardId();
      var environment_promise = drupal_interface.getCurrentEnvironment();
      environment_promise.then((environment) => {
        if (tour_id) {
          drupal_interface.triggerEvent('update_tour_info', tour_id, placard_id);
        }
      });
      var initial_binary = $('#unity-source').val();

      drupal_interface.addEventListener('update_tour_info', function() {
        var tour_id = drupal_interface.getCurrentTourId();
        var placard_id = drupal_interface.getCurrentPlacardId();
         
          environment_promise.then((environment) => {
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

        })
        .catch((error) => {
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
    attach: function (context, settings) {
      var drupal_interface = window.DrupalUnityInterface.DrupalInterface;
      var environment_tours;

      drupal_interface.getCurrentEnvironment()
      .then((environment) => {
        $('.information-window-container').append(render_sidebar_tour_html(environment.tours));
        // Attach placards on each tour item
        $.each(environment.tours, function(key, tour_value) {
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
    attach: function (context, settings) {
      $('.world-window-container .placard-title').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.placard-dropdown-list').toggle();
        $('body').unbind('click', hidePlacardDropdownList).bind('click', hidePlacardDropdownList);
      })
    }
  }; 
  
  Drupal.behaviors.unityProjectInitializeResizableWorldWindow = {
    attach: function (context, settings) {
      // Set container to be resizable
      $('.world-window-container.split-screen').resizable({
        maxWidth: 930,
        minWidth: 611,
        handles: 'e, w',
        resize: function(event, ui) {
          resize_placard_images();
          resize_canvas();
        }
      });
    }
  };

  Drupal.behaviors.unityProjectSetCookieStoredContainerSize = {
    attach: function (context, settings) {
      // Load saved world window width from session
      if ($.cookie('world_window') != '' && $.cookie('world_window') != 'full-world' && $.cookie('world_window') != 'full-info' && $.cookie('world_window') != 'split-world' && $.cookie('world_window') != 'split-info') {
        $('.world-window-container.split-screen').width($.cookie('world_window'));
        var info_window_width = ($('#block-system-main').width() - 15) - $.cookie('world_window');
        $('.information-window-container.split-screen').width(info_window_width);
      }
      else {
        resize_window($.cookie('world_window'));
      }
    }
  };

  Drupal.behaviors.unityProjectSetContainerSizeEvents = {
    attach: function (context, settings) {
      // World window resize options
      $('.show-full-world-window-btn').click(function(e) {
        e.preventDefault();
        resize_window('full-world');
      });
      $('.show-split-screen-world-window-btn').click(function(e) {
        e.preventDefault();
        resize_window('split-world');
      });
      $('.show-full-information-window-btn').click(function(e) {
        e.preventDefault();
        resize_window('full-info');
      });
      $('.show-split-screen-information-window-btn').click(function(e) {
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

      $('.world-window-container.split-screen').on('resizestop', function( event, ui ) {
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
    $.each(placards, function(index, placard) {
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
    drupal_interface.getPlacards([pid])
    .then((placard) => {
      var placard_data = placard[0];

      set_placard_display_title(placard_data.title);
      update_tour_binary_placard(placard_data);
    });
  }
  

  function get_current_placard_item_id(placards, placard_id) {
    var current_placard_key;
    $.each(placards, function(placard_key, placard_value) {
      if (Number(placard_value.id) == placard_id) {
        current_placard_key = placard_key;
      }
    });
    return current_placard_key;
  }
  
  function render_sidebar_tour_html(tours) {
    var tour_items = [];

    $.each(tours, function(key, tour_value) {
      if (tour_value.placards[0]) {
        var default_placard_id = tour_value.placards[0].id;
        var tour_html = '<div class="tour-row tour-row-' + tour_value.id + '">' +
          '<div class="tour-row-item">' +
            '<h3><a href="#tid=' + tour_value.id + '&pid=' + default_placard_id + '" class="tour-link-item">' + tour_value.title + '</a></h3>'+
          '</div>' +
          '<div class="view-information-window"></div>' +
          '</div>';
        tour_items.push(tour_html);
      }
      else {
        console.warn('Your tour has no placards associated with it');
      }
    });

    return tour_items.join('');
  }
  
  function render_sidebar_placard_list_html(placard_container, placards, tour_id) {
    var placard_items = [];
    var drupal_interface = window.DrupalUnityInterface.DrupalInterface;

      $.each(placards, function(index, placard) {
        try {
          var image = placard.image_url ? '<img typeof="foaf:Image" src="' + placard.image_url + '">' : '';
          var placard_item_html = '<li class="views-row">' +
            '<span class="views-field views-field-title-1 placard-row">' +
              '<a href="#tid='+ tour_id + '&pid=' + placard.id + '" class="placard-row-item">' + placard.title + '</a>' +
            '</span>' +
            '<div class="views-field views-field-nothing placard-info placard-info-' + placard.id + '" style="display: none;">' +
              '<div class="placard-image">' +
               image + 
              '</div>' +
              '<div class="placard-body">' + placard.description + '</div>' +
            '</div></li>';    
          placard_items.push(placard_item_html);
        } 
        catch (e) {
          console.log(e);
        }
      });
      
      var placard_list = '<ul class="placard-list">' + placard_items.join('') + '</ul>';
      $(placard_container).append(placard_list);
  }

  function render_sidebar_placard_list_item(placard, tour_id) {
    var placard = placard[0];
    var image = placard.image_url ? '<img typeof="foaf:Image" src="' + placard.image_url + '">' : '';
    var placard_items = '<li class="views-row">' +
      '<span class="views-field views-field-title-1 placard-row">' +
        '<a href="#tid='+ tour_id + '&pid=' + placard.id + '" class="placard-row-item">' + placard.title + '</a>' +
      '</span>' +
      '<div class="views-field views-field-nothing placard-info placard-info-' + placard.id + '" style="display: none;">' +
        '<div class="placard-image">' +
          image +
        '</div>' +
        '<div class="placard-body">' + placard.description + '</div>' +
      '</div></li>';
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
    let height = width * .85;
    
    $('#canvas').width(width);
    $('#canvas').height(height);
    $('.world-window-container').height(height + 20);
  }

  function resize_placard_images() {
    var placard_container_width = $('.information-window-container').width();
    $('.placard-image img').each(function() {
      if ($(this).width() > (placard_container_width - 45)) {
        $(this).addClass('spread');
      }
      else {
        $(this).removeClass('spread');
      }
    });
  }

  function set_placard_pager(tour, placard) {
        try {
        var max_index = tour.placards.length - 1;
        var current_placard_index = getPlacardIndexFromTour(placard.id, tour);
        var next_placard_index = current_placard_index < max_index ? current_placard_index + 1 : false;
        var prev_placard_index = current_placard_index > 0 ? current_placard_index - 1 : false;

        if (next_placard_index !== false) {
          $('.placard-nav.nav-next').addClass('active');
        }
        else {
          $('.placard-nav.nav-next').removeClass('active');
        }

        if (prev_placard_index !== false) {
          $('.placard-nav.nav-prev').addClass('active');
        }
        else {
          $('.placard-nav.nav-prev').removeClass('active');
        }

        function next(e) {
          e.preventDefault();
          if (next_placard_index) {
            window.location.hash = `tid=${tour.id}&pid=${tour.placards[next_placard_index].id}`;
          }
        }

        function prev(e) {
          e.preventDefault();
          if (prev_placard_index !== false) {
            window.location.hash = `tid=${tour.id}&pid=${tour.placards[prev_placard_index].id}`;
          }
        }

        $('.placard-nav.nav-next').unbind('click').bind('click', next);
        $('.placard-nav.nav-prev').unbind('click').bind('click', prev);

        }
        catch (error) {
          console.log(error);
        }
  }

  function getPlacardIndexFromTour(placard_id, tour) {
    var placard_index;
    tour.placards.forEach((placard, index) => {
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
    var clean_query = query.replace('#','');
    var vars = clean_query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] == variable){
        return pair[1];
      }
    }
    return(false);
  }

  // Resize windows
  function resize_window(option) {
    $.cookie('world_window', option);
    switch(option) {
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

          $('.world-window-container').resizable({maxWidth: 930, minWidth: 611});
        }
        else {
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
    var scroll_distance = (placard_index * 27) + 7;
    setTimeout(function() {
      $('.view-information-window').animate({
        scrollTop: scroll_distance,
      }, 'fast');

    }, 100);
  }


