<?php
/**
 * @file
 * unity_research.features.inc
 */

/**
 * Implements hook_views_api().
 */
function unity_research_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_node_info().
 */
function unity_research_node_info() {
  $items = array(
    'unity_research' => array(
      'name' => t('Research'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
