import DrupalInterface from './DrupalInterface';
import Q from 'q';

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
export default class DrupalUnityInterface {
  /**
   * @private
   */
  constructor(options = {}) {
    let default_options = {getWebPlayer: this.defaultGetWebPlayer};
    /** @private */
    this.options = Object.assign({}, default_options, options);

    if (typeof(this.options.getWebPlayer) !== 'function') {
      throw new Error('options.getWebPlayer must be a function');
    }

    /**
     * @private
     */
    this.getWebPlayer = this.options.getWebPlayer;

    let public_methods = ['getTour', 'addPlacard', 'getEnvironment', 'getCurrentEnvironment', 'getPlacards'];

    /** 
     * @type {DrupalInterface}
     * @private
     */
    this.DrupalInterface = new DrupalInterface(options);   

    public_methods.map((method_name) => {
      this.wrapMethod(this.DrupalInterface, method_name);
    });
  }

  /**
   * @private
   */
  defaultGetWebPlayer() {
    if (!unityObject) {
      throw new Error('No unity binary defined on the page!');
      return;
    }
    var web_player = unityObject.getObjectById('unityPlayer');
    if (web_player) {
      return web_player;
    }
    else {
      throw new Error('Could not connect to the Unity binary');
    }
  }

  /**
   * @private
   * Send a message (string) to a particluar Unity game_object / method
   */
  sendMessageToUnity(game_object, method, message) {
    message = JSON.stringify(message);
    console.log('Sending message "'+ message +'" to game_object "'+ game_object + '" on the method "'+ method +'"');
    let web_player = this.getWebPlayer();
    if (web_player) {
      web_player.SendMessage(game_object, method, message);
    }
    else {
      throw new Error('Could not get the Unity web player');
    }
  }

  /**
   * @private
   * Wrap methods on DrupalInterface with ones which will callback to Unity
   * Using the SendMessage function and JSON encoded args that Unity requires
   * @param {DrupalInterface} interface_obj
   * @param {string} method_name  The name of the method to wrap
   */
  wrapMethod(interface_obj, method_name) {
    //Save a reference to the original method outside function scope
    let original_method = interface_obj[method_name];

    this[method_name] = (game_object, game_object_method, arg_json) => {
      var arg;
      if (!game_object || typeof(game_object) != 'string') {
        throw new Error('You must provide a game_object (string) as the first argument to the '+ method_name +' method');
      }
      if (!game_object_method || typeof(game_object_method) != 'string') {
        throw new Error('You must provide a game_object_method (string) as the second argument to the '+ method_name +' method');
      }
      if (arg_json) {
        try {
          arg = JSON.parse(arg_json);
        }
        catch (e) {
          throw new Error(`Error decoding JSON argument sent to ${method_name} - "${arg_json}" is not valid JSON.`);
        }
      }

      let result = original_method.call(interface_obj, arg);

      this.ensurePromise(result)
      .then((resolved_value) => {
        this.sendMessageToUnity(game_object, game_object_method, resolved_value);
      });
    }
  }

  /**
   * @private
   * Ensure that a value is formatted as a promise.
   *
   * In other words, if value is a promise, return it
   * else, return a promise already resolved to that value
   */
  ensurePromise(value) {
    if (value && value.then) {
      return value;
    }
    else {
      var deferred = Q.defer();
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
  addEventListener(game_object, method_name, event_name) {
    this.DrupalInterface.addEventListener(event_name, (arg) => {
        this.sendMessageToUnity(game_object, method_name, arg);
    });
  }
  /**
   * Trigger an event on the interface.  Both page code and code in Unity have the opportunity to listen to events
   * @param {string} event_name  the name of the event to trigger on
   * @param {string} [json_encode_args]  a JSON encoded array of arguments to pass to event listeners
   */
  triggerEvent(event_name, arg) {
    var decoded_arg;
    if (typeof(arg) !== undefined) {
      try {
        decoded_arg = JSON.parse(arg); 
      }
      catch (error) {
        throw new Error('Argument sent to DrupalUnityInterface.triggerEvent must be in the form of a JSON-encoded array. Could not decode.');
      }
    }
    this.DrupalInterface.triggerEvent(event_name, decoded_arg);
  }
}

function unserializeArgs(args_json) {
  return args_json.map(json => { 
    if (typeof(json) == 'string') { 
      return JSON.parse(json); 
    }
    else {
      throw new Error('Arguments sent to the Drupal Unity Interface must be JSON strings'); 
    }
  });
}

if (typeof(window) != 'undefined') {
  window.DrupalUnityInterface = new DrupalUnityInterface();
}

