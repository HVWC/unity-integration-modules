/** TYPE DEFINITIONS */
/**
 * @typedef {object} Location
 * @property {number} latitude - latitude coordinate
 * @property {number} longitude - longitude coordinate
 * @property {number} elevation - an elevation in feet
 * @property {number} orientation - a number in degrees (0 - 359) representing an orientation of where the user should be looking
 *
 */

/**
 * @typedef {object} Placard 
 * @desc A placard represents a {@link Location} in the Unity world which is associated with a information (text, images, other media) 
 * An example of a placard might be a specific location in the world where a historical battle occured, linked with images and information about the battle
 *
 * @property {number} id  the id of the placard, which corresponds to a node id in Drupal
 * @property {string} title  the title of the placard i.e. "The Roman Colosseum"
 * @property {string} description  a description of the placard i.e. "The Roman Colosseum hosted blood sport as well as organic farmer's markets"
 * @property {Location} location the location where the placard exists
 *
 */

/**
 * @typedef {object} Tour
 * @desc A Tour is an ordered list of {@link Placard} objects through which a user can navigate
 *
 * @property {number} id  the id of the tour, which corresponds to a node id in Drupal
 * @property {string} title  the title of the tour i.e. "Roman Battles"
 * @property {string} description  a description of the tour i.e. "This tour explores historic battle sites around Rome."
 * @property {Placard[]} placards  an ordered array of Placards
 * @property {string} [unity_binary] the unity binary associated with a tour in a given environment (The same tour can be associated with multiple binaries in different environments so {@link DrupalInterface.getTour will not return a unity_binary for the tour}
 * 
 */


/**
 * @typedef {object} Environment
 * @desc An Environment contains a collection of {@link Tour} objects, each associated in Drupal with it's own Unity binary file
 *
 * @property {number} id  the id of the environment, which corresponds to a node id in Drupal
 * @property {string} title  the title of the environment i.e. "Moving Arena"
 * @property {string} description  a description of the environment i.e. "This project allows multiple users to try different placements for a movable arena within the Roman Forum"
 * @property {Location} starting_location the place in world were the user will be located on start
 * @property {Tour[]} tours an ordered array of Placards
 * 
 */
