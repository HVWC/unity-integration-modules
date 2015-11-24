<?php
/**
 * @file
 * unity_team.features.inc
 */

/**
 * Implements hook_node_info().
 */
function unity_team_node_info() {
  $items = array(
    'unity_team' => array(
      'name' => t('team'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Full Name'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
