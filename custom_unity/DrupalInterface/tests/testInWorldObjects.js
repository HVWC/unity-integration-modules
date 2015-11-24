var testInWorldObjects = [
  {
    id: 2344,
    title: "First in-world object",
    latitude: 12.1212,
    longitude: 60.3455,
    elevation: 20, //Elevation in feet
    orientation: 355,  //Orienation 0 - 360 degrees, clockwise
  },
  {
    id: 4466,
    title: "Second in-world object",
    latitude: 12.14,
    longitude: 60.5,
    elevation: 45, //Elevation in feet
    orientation: 15,  //Orienation 0 - 360 degrees, clockwise
  }
];



if (typeof(module) != 'undefined') {
  module.exports = testInWorldObjects;
}
