var DrupalInterface = require('../src/DrupalInterface');
var assert = require('assert');
var TestInterface = new DrupalInterface({ajax_domain: 'http://unity.localhost'});

var expect = require('chai').expect;
var skip = function() { };


describe('DrupalInterface', function() {
  this.timeout(10000);

  var testTour123 = require('./testTour123.js');

  it('Should register and trigger events', function() {
    TestInterface = new DrupalInterface();
    TestInterface.addEventListener('test_event', function(test_arg) {
      expect(test_arg).to.equal('TEST VALUE');
    });
    TestInterface.triggerEvent('test_event', 'TEST VALUE');

  });

  it('Should not call events that were not triggered', function() {
    TestInterface = new DrupalInterface();
    TestInterface.addEventListener('test_event', function(test_arg) {
      expect(test_arg).to.equal('TEST VALUE');
    });
    TestInterface.addEventListener('uncalled_event', function(test_arg) {
      expect(false).to.equal(true);
    });

    TestInterface.triggerEvent('test_event', 'TEST VALUE');

  });

  it('Should support multiple arguments on trigger', function() {
    TestInterface = new DrupalInterface();
    TestInterface.addEventListener('test_event', function(test_arg, person, overpaid) {
      expect(test_arg).to.equal('TEST VALUE');
      expect(person).to.deep.equal({name: 'John'});
      expect(overpaid).to.equal(false);
    });

    TestInterface.triggerEvent('test_event', 'TEST VALUE', {name: 'John'}, false);

  });


  /*it('Should return correct tour with placards', function(done) {
    var test_tour = DrupalInterface.getTour(123);
    console.log(test_tour);
    DrupalInterface.getTour(123)
      .done(function(tour) {

        assert.deepEqual(tour, testTour123);
        done();
      });
  });*/

  skip('Should return tour data', function(done) {
    TestInterface.getTour(4).done(function(tour_data){
      console.log(tour_data);
      done();
    });
  });

  var testInWorldObjects = require('./testInWorldObjects');

  skip('Should return correct in-world objects', function(done) {
    TestInterface.getInWorldObjects(420)
      .done(function(tour) {
        assert.deepEqual(tour, testInWorldObjects);
        done();
      });
  });
});


describe('DrupalUnityInterface', function() {

  var DrupalUnityInterface, MockUnityWebPlayer, TestWebPlayer;

  before(function() {
    DrupalUnityInterface = require('../src/DrupalUnityInterface');
    MockUnityWebPlayer = require('./MockUnityWebPlayer');
    TestWebPlayer = new MockUnityWebPlayer();

  });

  it('Should be able to register an event listener', function(done) {
    this.timeout(2000);
    TestWebPlayer.addMethod('testGameObject', 'testMethod', function(message) {
      var args = JSON.parse(message);
      let first_name = args[0];
      let last_name  = args[1];
      let obj        = args[2];

      expect(first_name).to.equal('Greatest');
      expect(last_name).to.equal('Ever');
      expect(obj.more_money).to.equal('more problems');
      done();
    });
    var TestInterface = new DrupalUnityInterface({getWebPlayer: TestWebPlayer.getWebPlayer});

    TestInterface.addEventListener('testGameObject', 'testMethod', 'addPerson');

    var args = JSON.stringify(['Greatest', 'Ever', { more_money: 'more problems', the_motto: 'yolo'}]);
    TestInterface.triggerEvent('addPerson', args);
  });

});


