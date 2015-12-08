
### HVWC Drupal / Unity Integration Project

The project allows managing geodata in the Unity virtual world via Drupal.

To this end we've created a series of content types in Drupal which can be accessed inside Unity using the DrupalUnityInterface object.

DrupalUnityInterface is declared globally on the page so that it can be accessed from Unity.

DrupalInterface is also declared which allows applications outside of Unity (i.e. other javascript code on the page) to access the same interface.
