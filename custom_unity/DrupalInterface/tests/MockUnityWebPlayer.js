export default class MockUnityWebPlayer {
  constructor() {
    this.gameObjects = {};
    this.getWebPlayer = this.getWebPlayer.bind(this);
  }
  getWebPlayer() {
    return this;
  }
  addMethod(gameObject, methodName, func) {
    this.gameObjects[gameObject] || (this.gameObjects[gameObject] = {});
    this.gameObjects[gameObject][methodName] = func;
  }
  SendMessage(methodName, gameObject, message) {
    this.gameObjects[gameObject][methodName].call(null, message);
  }
}
