<?php
/**
 * @file
 * unity_content_types.features.inc
 */

/**
 * Implements hook_node_info().
 */
function unity_content_types_node_info() {
  $items = array(
    'placard' => array(
      'name' => t('Placard'),
      'base' => 'node_content',
      'description' => t('A specific site (geo coordinates) within the unity world with text and image data associated with it'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'tour' => array(
      'name' => t('Tour'),
      'base' => 'node_content',
      'description' => t('An ordered list of placards composing a tour within the Unity world'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'unity_environment' => array(
      'name' => t('Unity Environment'),
      'base' => 'node_content',
      'description' => t('Consists of a Unity Environment a list of associated Tours and placards to display on single page to user'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
