var Q = require('q');
var request = require('httpinvoke');
var queryString = require('query-string');

const DRUPAL_INTERFACE_SUCCESS = 'DRUPAL_INTERFACE_SUCCESS';
const DRUPAL_INTERFACE_FAIL    = 'DRUPAL_INTERFACE_FAIL';


/**
 * DrupalInterface provides an interface for accessing Unity world related information stored within Drupal.
 * Most methods are asynchronous and return Promises {@see https://promisesaplus.com} 
 * The return values listed below are the values to which the promises resolve
 *
 * __Note: If calling this interface from within Unity the first two arguments will always
 * be gameObject (string) and methodName (string) - and then any additional arguments, which should be first passed to JSON.stringify__
 *
 * i.e.  getTour('myGameObject', 'myCallbackMethod', 7);
 * returns the tour with an id of 7
 *
 * All Types listed are plain javascript objects with the properties listed under their type definitions
 *
 */
export default class DrupalInterface {

  /**
   * @param {object} [config]
   * @param {string} config.ajax_domain  The domain to which ajax calls will be sent.
   * If none is provided, will attempt to determine correct domain from window.location.host
   *
   */
  constructor(config = {}) {
    let default_config = {

    }
    this.config = Object.assign(default_config, config);
    this.config.ajax_domain || (this.config.ajax_domain = getCurrentDomain());
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
  addEventListener(event_name, callback) {
    this.event_listeners[event_name] || (this.event_listeners[event_name] = []);
    this.event_listeners[event_name].push(callback); 
  }

  triggerEvent(event_name, arg) {
    this.event_listeners[event_name] || (this.event_listeners[event_name] = []);
    this.event_listeners[event_name].map((callback) => {
      callback.call(null, arg);  
    });
  }

  /**
   * Get the current environment object loaded by Drupal
   *
   * @return {Environment} environment
   *
   */
  getCurrentEnvironment() {
    if (Drupal.settings.custom_unity.current_environment) {
      let environment_id = Number(Drupal.settings.custom_unity.current_environment.id);
      return this.getEnvironment(environment_id);
    }

    return false;
  }
  /**
   * @private  Helper function which retrieves the Environment structure without fully loaded tours
   *
   */
  _getEnvironment(environment_id) {
    var deferred = Q.defer();
    var environment;

    this.request('/unity-services/environment', {id: environment_id})
    .then((results) => {

      environment = results.pop();

      if (environment) {
        environment = formatEnvironment(environment);
      }
      deferred.resolve(environment);
    })
    .catch((error) => {
      console.log(`Error in _getEnvironment (${environment_id})`);
      console.log(error);
    });
    return deferred.promise;

  }

  /**
   * Returns the {@link Environment} requested by id
   * @param {number} environment_id  The environment id (Drupal node id) of the environment
   * @return {Environment} environment
   */
  getEnvironment(environment_id) {
    if (!environment_id) {
      throw new Error('environment_id sent to getEnvironment is undefined');
    }
    var deferred = Q.defer();
    var environment;

    this._getEnvironment(environment_id)
      .then((retrieved_environment) => {
        environment = retrieved_environment; 
        return this.getEnvironmentTours(environment_id);
      })
      .then((tours) => {
        environment.tours = tours;
        delete environment.tour_ids;
        environment.getTour = function (tour_id) {  
          return this.tours.filter((tour) => { return Number(tour.id) == tour_id; }).pop();
        }.bind(environment);
        deferred.resolve(environment);
      })
      .catch((error) => {
        console.log(`Error getting environment ${environment_id}`);
        console.log(error); 
      }); 

    return deferred.promise;
  }

  /**
   * Get the currently selected tour in Drupal
   * @return {number} tour_id - the Drupal node id of the current tour the using is engaging with in Drupal
   */
  getCurrentTourId() {
    return getUrlHashParam('tid') ? Number(getUrlHashParam('tid')) : undefined;  
  }
  /**
   * Get the currently selected placard in Drupal
   * @return {number} placard_id - the Drupal placard_id of the currently selected placard in Drupal
   */
  getCurrentPlacardId() {
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
  getTour(tour_id) {
    var deferred = Q.defer();

    var tour = {};

    this.request('/unity-services/specific-tour', {id: tour_id})
    .then((results) => {

      tour = results.pop();

      if (tour) {
        tour.id = Number(tour.id);
        return this.getPlacards(tour.placard_ids);
      }
      else {
        deferred.resolve(undefined);
      }
    })
    .then((placards) => {
      tour.placards = placards; 
      delete tour.placard_ids;
      deferred.resolve(tour);
    })
    .catch((error) => {
      console.log(`Error retrieving tour for tour_id: ${tour_id}`);
      console.log(error);
    });

    return deferred.promise;

  }
  /*
   * Called on the tour object tour.getPlacard(placard_id)
   */
  _tourGetPlacard(placard_id) {
    return this.placards.filter((placard) => { return Number(placard.id) == Number(placard_id); }).pop();
  }
  getEnvironmentTours(environment_id) {

    var environment_tours;

    return this.request('/unity-services/environment-tours', {id: environment_id})
    .then((tours) => {
      environment_tours = tours.map((tour) => { 
        return {
          id: Number(tour.id),
          placard_ids: tour.placards, 
          title: tour.title,
          description: tour.description,
          tags: tour.tags.map((tag) => { Number(tag.tid) }),
          unity_binary: tour.unity_binary,
        }
      });
      return environment_tours;
    })
    .then((tours) => {
      let placard_ids = this.getAllPlacardIdsFromTours(tours);
      return this.getPlacards(placard_ids);
    })
    .then((placards) => {
      return environment_tours.map((tour) => {
        tour.placards = tour.placard_ids.map((placard_id) => {
          return this.getObjectById(placards, placard_id);  
        });
        tour.getPlacard = this._tourGetPlacard.bind(tour)
        delete tour.placard_ids;
        return tour;
      });
    })
    .catch((error) => {
      console.log('Error retrieving tours for environment '+ environment_id);
      console.log(error);
    });

  }
  /*
   * @private
   * {array} objs - an array of tours or placards with an 'id' property 
   * {number} id - the relevant id to select
   *
   */
  getObjectById(objs, id) {
    return objs.filter((obj) => obj.id == id).pop();
  }
  getAllPlacardIdsFromTours(tours) {
    var placard_ids = {}; 
    tours.map((tour) => {
      tour.placard_ids.map((placard_id) => {
       placard_ids[placard_id] = placard_id;
      });
    });
    return Object.keys(placard_ids).map(placard_id => Number(placard_id));
  }

  getTours(tour_ids) {
    var deferred = Q.defer();

    var promises = [];
    var tours = [];

    tour_ids.map((tour_id) => {
      let promise = this.getTour(tour_id);
      promises.push(promise);

      promise.done((tour) => {
        tour.getPlacard = function (placard_id) {  
          return this.placards.filter((placard) => { return Number(placard.id) == placard_id; }).pop();
        }.bind(tour);
        tours.push(tour);
      });
    });

    Q.all(promises).done(() => {
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
  getPlacards(placard_ids) {
    var deferred = Q.defer();

    if (!placard_ids || placard_ids.length == 0) {
      deferred.resolve([]);
    }
    else {
      let query_ids = placard_ids.join('+');
      this.request('/unity-services/specific-placard', {id: query_ids})
      .then((placards) => {
        placards = placards.map((placard) => {
          let layer = placard.layer && placard.layer.value ? placard.layer.value : '';
          return {
            id: Number(placard.id),
            title: placard.title,
            description: placard.description,
            image_url: placard.field_image,
            location: {
              latitude: Number(placard.location.latitude),
              longitude: Number(placard.location.longitude),
              country: placard.location.country,
              elevation: Number(placard.elevation),
              orientation: Number(placard.orientation)
            },
            layer
          }
        });

        deferred.resolve(placards);
      })
      .catch((error) => {
        console.log('Error getting placards');
        console.log(`Error getting placards (${placard_ids.join(',')})`);
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
  addPlacard(placard) {
    var deferred = Q.defer();
    var query_string = '';
    for(var key in placard) {
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
  request(uri, query_args) {
    let deferred = Q.defer();
    let query_string = '?';
    for(var key in query_args) {
      query_string = query_string.concat(key + '=' + query_args[key] + '&');
    }

    let request_url = uri + query_string;
    request(request_url, 'GET')
    .then((result) => {
      try {
      if (result.statusCode == 200) {
        deferred.resolve(JSON.parse(result.body));
      }
      else {
        console.warn(`Request to ${request_url} failed`);
      }
      }
      catch (error) {
        console.log(`Error retrieving request to ${request_url}`);
        console.log(error);
      }
    });

    return deferred.promise;
  }
}

//Locally private methods (Can't be accessed from outside this file)
/*
 * @private
 */
let getCurrentDomain = function() {
  if (typeof(window) !== 'undefined') { 
    return window.location.host;
  }
}


/**
 * @private
 */
let formatEnvironment = function(environment_data) {
  return {
    id: environment_data.id,
    title: environment_data.title,
    description: environment_data.description,
    starting_location: {
      latitude: Number(environment_data.starting_location.latitude), 
      longitude: Number(environment_data.starting_location.longitude),
      orientation: environment_data.starting_location.orientation,
      elevation: environment_data.starting_location.elevation,
    },
  }
}

/**
 *  @private
 *
 *  Retrieve a value from params in the url hash
 *  i.e. for http://domain.com/uri#foo=bar  getUrlHashParam('foo') returns 'bar'
 *
 */
let getUrlHashParam = function(name) {
  var exp = "[\\#&]"+name+"=([^&]*)";
  var regexp = new RegExp( exp );
  var results = regexp.exec( window.location.href );
  if (results) {
    return results[1];
  }
}

//Export global, for now
if (typeof(window) != 'undefined') {
  window.DrupalInterface = DrupalInterface;
  window.di = new DrupalInterface();
}
