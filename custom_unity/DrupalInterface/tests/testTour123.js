var testTour123 = {
  title: "Test tour",
  id: 123,
  placards: [
    {
      id: 3241,
      title: "First placard in our test tour",
      latitude: 12.1212,
      longitude: 60.3455,
      elevation: 20, //Elevation in feet
      orientation: 355,  //Orienation 0 - 360 degrees, clockwise
    },
    {
      id: 3242,
      title: "Second placard in our test tour",
      latitude: 12.14,
      longitude: 60.5,
      elevation: 20, //Elevation in feet
      orientation: 15,  //Orienation 0 - 360 degrees, clockwise
    }
  ]
};

if (typeof(module) != 'undefined') {
  module.exports = testTour123;
}
