<?php
/**
 * @file
 * unity_services_views.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function unity_services_views_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'environment_tours';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Environment Tours';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Relationship: Content: Tours (field_collection_tours) */
  $handler->display->display_options['relationships']['field_collection_tours_value']['id'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['table'] = 'field_data_field_collection_tours';
  $handler->display->display_options['relationships']['field_collection_tours_value']['field'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['delta'] = '-1';
  /* Relationship: Entity Reference: Referenced Entity */
  $handler->display->display_options['relationships']['field_tour_target_id']['id'] = 'field_tour_target_id';
  $handler->display->display_options['relationships']['field_tour_target_id']['table'] = 'field_data_field_tour';
  $handler->display->display_options['relationships']['field_tour_target_id']['field'] = 'field_tour_target_id';
  $handler->display->display_options['relationships']['field_tour_target_id']['relationship'] = 'field_collection_tours_value';
  /* Relationship: Field collection item: Unity Binary (field_unity_binary:fid) */
  $handler->display->display_options['relationships']['field_unity_binary_fid']['id'] = 'field_unity_binary_fid';
  $handler->display->display_options['relationships']['field_unity_binary_fid']['table'] = 'field_data_field_unity_binary';
  $handler->display->display_options['relationships']['field_unity_binary_fid']['field'] = 'field_unity_binary_fid';
  $handler->display->display_options['relationships']['field_unity_binary_fid']['relationship'] = 'field_collection_tours_value';
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['relationship'] = 'field_tour_target_id';
  $handler->display->display_options['fields']['nid']['label'] = 'id';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['relationship'] = 'field_tour_target_id';
  $handler->display->display_options['fields']['title']['label'] = 'title';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['relationship'] = 'field_tour_target_id';
  $handler->display->display_options['fields']['body']['label'] = 'description';
  $handler->display->display_options['fields']['body']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 0,
  );
  /* Field: Content: Placard Tags */
  $handler->display->display_options['fields']['field_placard_tags']['id'] = 'field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['table'] = 'field_data_field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['field'] = 'field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['relationship'] = 'field_tour_target_id';
  $handler->display->display_options['fields']['field_placard_tags']['label'] = 'tags';
  $handler->display->display_options['fields']['field_placard_tags']['type'] = 'services';
  $handler->display->display_options['fields']['field_placard_tags']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 0,
  );
  $handler->display->display_options['fields']['field_placard_tags']['delta_offset'] = '0';
  /* Field: Field collection item: Unity Binary */
  $handler->display->display_options['fields']['field_unity_binary']['id'] = 'field_unity_binary';
  $handler->display->display_options['fields']['field_unity_binary']['table'] = 'field_data_field_unity_binary';
  $handler->display->display_options['fields']['field_unity_binary']['field'] = 'field_unity_binary';
  $handler->display->display_options['fields']['field_unity_binary']['relationship'] = 'field_collection_tours_value';
  $handler->display->display_options['fields']['field_unity_binary']['label'] = 'unity_binary';
  $handler->display->display_options['fields']['field_unity_binary']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_unity_binary']['type'] = 'file_url_plain';
  $handler->display->display_options['fields']['field_unity_binary']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 0,
  );
  /* Field: Content: Placards */
  $handler->display->display_options['fields']['field_placards']['id'] = 'field_placards';
  $handler->display->display_options['fields']['field_placards']['table'] = 'field_data_field_placards';
  $handler->display->display_options['fields']['field_placards']['field'] = 'field_placards';
  $handler->display->display_options['fields']['field_placards']['relationship'] = 'field_tour_target_id';
  $handler->display->display_options['fields']['field_placards']['label'] = 'placards';
  $handler->display->display_options['fields']['field_placards']['type'] = 'entityreference_entity_id';
  $handler->display->display_options['fields']['field_placards']['settings'] = array(
    'link' => 0,
  );
  $handler->display->display_options['fields']['field_placards']['delta_offset'] = '0';
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Nid */
  $handler->display->display_options['filters']['nid']['id'] = 'nid';
  $handler->display->display_options['filters']['nid']['table'] = 'node';
  $handler->display->display_options['filters']['nid']['field'] = 'nid';
  $handler->display->display_options['filters']['nid']['exposed'] = TRUE;
  $handler->display->display_options['filters']['nid']['expose']['operator_id'] = 'nid_op';
  $handler->display->display_options['filters']['nid']['expose']['label'] = 'id';
  $handler->display->display_options['filters']['nid']['expose']['operator'] = 'nid_op';
  $handler->display->display_options['filters']['nid']['expose']['identifier'] = 'id';
  $handler->display->display_options['filters']['nid']['expose']['required'] = TRUE;
  $handler->display->display_options['filters']['nid']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'unity_environment' => 'unity_environment',
  );

  /* Display: Services */
  $handler = $view->new_display('services', 'Services', 'services_1');
  $handler->display->display_options['path'] = 'environment-tours';
  $export['environment_tours'] = $view;

  $view = new view();
  $view->name = 'placards';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Placards';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Placards';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'node';
  /* Relationship: Content: Tours (field_collection_tours) */
  $handler->display->display_options['relationships']['field_collection_tours_value']['id'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['table'] = 'field_data_field_collection_tours';
  $handler->display->display_options['relationships']['field_collection_tours_value']['field'] = 'field_collection_tours_value';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Sort criterion: Content: Placards (field_placards:delta) */
  $handler->display->display_options['sorts']['delta']['id'] = 'delta';
  $handler->display->display_options['sorts']['delta']['table'] = 'field_data_field_placards';
  $handler->display->display_options['sorts']['delta']['field'] = 'delta';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'placard' => 'placard',
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['path'] = 'placards';

  /* Display: Entity Reference */
  $handler = $view->new_display('entityreference', 'Entity Reference', 'entityreference_1');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'entityreference_style';
  $handler->display->display_options['style_options']['search_fields'] = array(
    'title' => 'title',
  );
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'entityreference_fields';
  $handler->display->display_options['defaults']['row_options'] = FALSE;

  /* Display: Services */
  $handler = $view->new_display('services', 'Services', 'services_1');
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'fields';
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['relationships'] = FALSE;
  /* Relationship: Content: Tours (field_collection_tours) */
  $handler->display->display_options['relationships']['field_collection_tours_value']['id'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['table'] = 'field_data_field_collection_tours';
  $handler->display->display_options['relationships']['field_collection_tours_value']['field'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['delta'] = '-1';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = 'id';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = 'title';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = 'description';
  /* Field: Content: Placard Location */
  $handler->display->display_options['fields']['field_placard_location']['id'] = 'field_placard_location';
  $handler->display->display_options['fields']['field_placard_location']['table'] = 'field_data_field_placard_location';
  $handler->display->display_options['fields']['field_placard_location']['field'] = 'field_placard_location';
  $handler->display->display_options['fields']['field_placard_location']['label'] = 'location';
  $handler->display->display_options['fields']['field_placard_location']['type'] = 'services';
  $handler->display->display_options['fields']['field_placard_location']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 0,
  );
  /* Field: Content: Layer */
  $handler->display->display_options['fields']['field_layer']['id'] = 'field_layer';
  $handler->display->display_options['fields']['field_layer']['table'] = 'field_data_field_layer';
  $handler->display->display_options['fields']['field_layer']['field'] = 'field_layer';
  $handler->display->display_options['fields']['field_layer']['label'] = 'layer';
  $handler->display->display_options['fields']['field_layer']['type'] = 'services';
  $handler->display->display_options['fields']['field_layer']['settings'] = array(
    'skip_safe' => 1,
    'skip_empty_values' => 0,
  );
  /* Field: Content: Image */
  $handler->display->display_options['fields']['field_placard_image']['id'] = 'field_placard_image';
  $handler->display->display_options['fields']['field_placard_image']['table'] = 'field_data_field_placard_image';
  $handler->display->display_options['fields']['field_placard_image']['field'] = 'field_placard_image';
  $handler->display->display_options['fields']['field_placard_image']['label'] = 'field_image';
  $handler->display->display_options['fields']['field_placard_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_placard_image']['type'] = 'image_url';
  $handler->display->display_options['fields']['field_placard_image']['settings'] = array(
    'url_type' => '1',
    'image_style' => '',
    'image_link' => '',
  );
  /* Field: Content: Placard Tags */
  $handler->display->display_options['fields']['field_placard_tags']['id'] = 'field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['table'] = 'field_data_field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['field'] = 'field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['label'] = 'tags';
  $handler->display->display_options['fields']['field_placard_tags']['type'] = 'services';
  $handler->display->display_options['fields']['field_placard_tags']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 0,
  );
  $handler->display->display_options['fields']['field_placard_tags']['delta_offset'] = '0';
  /* Field: Content: Starting Elevation */
  $handler->display->display_options['fields']['field_elevation']['id'] = 'field_elevation';
  $handler->display->display_options['fields']['field_elevation']['table'] = 'field_data_field_elevation';
  $handler->display->display_options['fields']['field_elevation']['field'] = 'field_elevation';
  $handler->display->display_options['fields']['field_elevation']['label'] = 'elevation';
  $handler->display->display_options['fields']['field_elevation']['type'] = 'number_integer';
  $handler->display->display_options['fields']['field_elevation']['settings'] = array(
    'thousand_separator' => '',
    'prefix_suffix' => 0,
  );
  /* Field: Content: Starting Orientation */
  $handler->display->display_options['fields']['field_orientation']['id'] = 'field_orientation';
  $handler->display->display_options['fields']['field_orientation']['table'] = 'field_data_field_orientation';
  $handler->display->display_options['fields']['field_orientation']['field'] = 'field_orientation';
  $handler->display->display_options['fields']['field_orientation']['label'] = 'orientation';
  $handler->display->display_options['fields']['field_orientation']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_orientation']['settings'] = array(
    'thousand_separator' => '',
    'decimal_separator' => '.',
    'scale' => '5',
    'prefix_suffix' => 0,
  );
  $handler->display->display_options['defaults']['sorts'] = FALSE;
  $handler->display->display_options['defaults']['arguments'] = FALSE;
  /* Contextual filter: Content: Nid */
  $handler->display->display_options['arguments']['nid']['id'] = 'nid';
  $handler->display->display_options['arguments']['nid']['table'] = 'node';
  $handler->display->display_options['arguments']['nid']['field'] = 'nid';
  $handler->display->display_options['arguments']['nid']['default_action'] = 'default';
  $handler->display->display_options['arguments']['nid']['default_argument_type'] = 'php';
  $handler->display->display_options['arguments']['nid']['default_argument_options']['code'] = 'return isset($_GET[\'id\']) ? $_GET[\'id\'] : \'\';';
  $handler->display->display_options['arguments']['nid']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['nid']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['nid']['summary_options']['items_per_page'] = '25';
  $handler->display->display_options['arguments']['nid']['break_phrase'] = TRUE;
  $handler->display->display_options['defaults']['filter_groups'] = FALSE;
  $handler->display->display_options['defaults']['filters'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'placard' => 'placard',
  );
  $handler->display->display_options['path'] = 'specific-placard';
  $export['placards'] = $view;

  $view = new view();
  $view->name = 'placards_by_tid';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'taxonomy_term_data';
  $view->human_name = 'Placards By Tid';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Relationship: Taxonomy term: Content using Placard Tags */
  $handler->display->display_options['relationships']['reverse_field_placard_tags_node']['id'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['relationships']['reverse_field_placard_tags_node']['table'] = 'taxonomy_term_data';
  $handler->display->display_options['relationships']['reverse_field_placard_tags_node']['field'] = 'reverse_field_placard_tags_node';
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['nid']['label'] = 'nid';
  $handler->display->display_options['fields']['nid']['element_label_colon'] = FALSE;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['title']['label'] = 'title';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['body']['label'] = 'description';
  $handler->display->display_options['fields']['body']['element_label_colon'] = FALSE;
  /* Field: Content: Placard Location */
  $handler->display->display_options['fields']['field_placard_location']['id'] = 'field_placard_location';
  $handler->display->display_options['fields']['field_placard_location']['table'] = 'field_data_field_placard_location';
  $handler->display->display_options['fields']['field_placard_location']['field'] = 'field_placard_location';
  $handler->display->display_options['fields']['field_placard_location']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['field_placard_location']['label'] = 'location';
  $handler->display->display_options['fields']['field_placard_location']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_placard_location']['type'] = 'services';
  $handler->display->display_options['fields']['field_placard_location']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 1,
  );
  /* Field: Broken/missing handler */
  $handler->display->display_options['fields']['field_placard_orientation']['id'] = 'field_placard_orientation';
  $handler->display->display_options['fields']['field_placard_orientation']['table'] = 'field_data_field_placard_orientation';
  $handler->display->display_options['fields']['field_placard_orientation']['field'] = 'field_placard_orientation';
  $handler->display->display_options['fields']['field_placard_orientation']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['field_placard_orientation']['label'] = 'placard_orientation';
  /* Field: Content: Image */
  $handler->display->display_options['fields']['field_placard_image']['id'] = 'field_placard_image';
  $handler->display->display_options['fields']['field_placard_image']['table'] = 'field_data_field_placard_image';
  $handler->display->display_options['fields']['field_placard_image']['field'] = 'field_placard_image';
  $handler->display->display_options['fields']['field_placard_image']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['field_placard_image']['label'] = 'field_image';
  $handler->display->display_options['fields']['field_placard_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_placard_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_placard_image']['type'] = 'image_url';
  $handler->display->display_options['fields']['field_placard_image']['settings'] = array(
    'url_type' => '1',
    'image_style' => '',
    'image_link' => '',
  );
  /* Field: Content: Placard Tags */
  $handler->display->display_options['fields']['field_placard_tags']['id'] = 'field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['table'] = 'field_data_field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['field'] = 'field_placard_tags';
  $handler->display->display_options['fields']['field_placard_tags']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['fields']['field_placard_tags']['label'] = 'tags';
  $handler->display->display_options['fields']['field_placard_tags']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_placard_tags']['type'] = 'services';
  $handler->display->display_options['fields']['field_placard_tags']['settings'] = array(
    'skip_safe' => 0,
    'skip_empty_values' => 0,
  );
  $handler->display->display_options['fields']['field_placard_tags']['delta_offset'] = '0';
  /* Field: Content: Starting Elevation */
  $handler->display->display_options['fields']['field_elevation']['id'] = 'field_elevation';
  $handler->display->display_options['fields']['field_elevation']['table'] = 'field_data_field_elevation';
  $handler->display->display_options['fields']['field_elevation']['field'] = 'field_elevation';
  $handler->display->display_options['fields']['field_elevation']['relationship'] = 'reverse_field_placard_tags_node';
  /* Filter criterion: Taxonomy term: Term ID */
  $handler->display->display_options['filters']['tid_raw']['id'] = 'tid_raw';
  $handler->display->display_options['filters']['tid_raw']['table'] = 'taxonomy_term_data';
  $handler->display->display_options['filters']['tid_raw']['field'] = 'tid_raw';
  $handler->display->display_options['filters']['tid_raw']['exposed'] = TRUE;
  $handler->display->display_options['filters']['tid_raw']['expose']['operator_id'] = 'tid_raw_op';
  $handler->display->display_options['filters']['tid_raw']['expose']['label'] = 'placard_tid';
  $handler->display->display_options['filters']['tid_raw']['expose']['operator'] = 'tid_raw_op';
  $handler->display->display_options['filters']['tid_raw']['expose']['identifier'] = 'tid';
  $handler->display->display_options['filters']['tid_raw']['expose']['required'] = TRUE;
  $handler->display->display_options['filters']['tid_raw']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['relationship'] = 'reverse_field_placard_tags_node';
  $handler->display->display_options['filters']['type']['value'] = array(
    'placard' => 'placard',
  );

  /* Display: Services */
  $handler = $view->new_display('services', 'Services', 'services_1');
  $handler->display->display_options['path'] = 'placard-tid';
  $export['placards_by_tid'] = $view;

  $view = new view();
  $view->name = 'tours';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Tours';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = 'title';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = 'description';
  /* Field: Content: Placards */
  $handler->display->display_options['fields']['field_placards']['id'] = 'field_placards';
  $handler->display->display_options['fields']['field_placards']['table'] = 'field_data_field_placards';
  $handler->display->display_options['fields']['field_placards']['field'] = 'field_placards';
  $handler->display->display_options['fields']['field_placards']['label'] = 'placard_ids';
  $handler->display->display_options['fields']['field_placards']['type'] = 'entityreference_entity_id';
  $handler->display->display_options['fields']['field_placards']['settings'] = array(
    'view_mode' => 'default',
    'links' => 1,
  );
  $handler->display->display_options['fields']['field_placards']['delta_offset'] = '0';
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = 'id';
  $handler->display->display_options['fields']['nid']['element_label_colon'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'tour' => 'tour',
  );
  /* Filter criterion: Content: Nid */
  $handler->display->display_options['filters']['nid']['id'] = 'nid';
  $handler->display->display_options['filters']['nid']['table'] = 'node';
  $handler->display->display_options['filters']['nid']['field'] = 'nid';
  $handler->display->display_options['filters']['nid']['exposed'] = TRUE;
  $handler->display->display_options['filters']['nid']['expose']['operator_id'] = 'nid_op';
  $handler->display->display_options['filters']['nid']['expose']['label'] = 'id';
  $handler->display->display_options['filters']['nid']['expose']['operator'] = 'nid_op';
  $handler->display->display_options['filters']['nid']['expose']['identifier'] = 'id';
  $handler->display->display_options['filters']['nid']['expose']['required'] = TRUE;
  $handler->display->display_options['filters']['nid']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );

  /* Display: Services */
  $handler = $view->new_display('services', 'Services', 'services_1');
  $handler->display->display_options['path'] = 'specific-tour';
  $export['tours'] = $view;

  $view = new view();
  $view->name = 'unity_environment';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Unity Environment';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Environment';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['query']['options']['distinct'] = TRUE;
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Relationship: Broken/missing handler */
  $handler->display->display_options['relationships']['field_collection_placards_value']['id'] = 'field_collection_placards_value';
  $handler->display->display_options['relationships']['field_collection_placards_value']['table'] = 'field_data_field_collection_placards';
  $handler->display->display_options['relationships']['field_collection_placards_value']['field'] = 'field_collection_placards_value';
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = 'id';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = 'title';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Body */
  $handler->display->display_options['fields']['body']['id'] = 'body';
  $handler->display->display_options['fields']['body']['table'] = 'field_data_body';
  $handler->display->display_options['fields']['body']['field'] = 'body';
  $handler->display->display_options['fields']['body']['label'] = 'description';
  $handler->display->display_options['fields']['body']['type'] = 'text_plain';
  /* Field: Content: Starting Location */
  $handler->display->display_options['fields']['field_starting_location']['id'] = 'field_starting_location';
  $handler->display->display_options['fields']['field_starting_location']['table'] = 'field_data_field_starting_location';
  $handler->display->display_options['fields']['field_starting_location']['field'] = 'field_starting_location';
  $handler->display->display_options['fields']['field_starting_location']['label'] = 'starting_location';
  $handler->display->display_options['fields']['field_starting_location']['type'] = 'services';
  $handler->display->display_options['fields']['field_starting_location']['settings'] = array(
    'skip_safe' => 1,
    'skip_empty_values' => 1,
  );
  /* Field: Content: Starting Orientation */
  $handler->display->display_options['fields']['field_orientation']['id'] = 'field_orientation';
  $handler->display->display_options['fields']['field_orientation']['table'] = 'field_data_field_orientation';
  $handler->display->display_options['fields']['field_orientation']['field'] = 'field_orientation';
  $handler->display->display_options['fields']['field_orientation']['label'] = 'orientation';
  $handler->display->display_options['fields']['field_orientation']['settings'] = array(
    'thousand_separator' => '',
    'decimal_separator' => '.',
    'scale' => '2',
    'prefix_suffix' => 1,
  );
  /* Field: Content: Starting Elevation */
  $handler->display->display_options['fields']['field_elevation']['id'] = 'field_elevation';
  $handler->display->display_options['fields']['field_elevation']['table'] = 'field_data_field_elevation';
  $handler->display->display_options['fields']['field_elevation']['field'] = 'field_elevation';
  $handler->display->display_options['fields']['field_elevation']['label'] = 'elevation';
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'unity_environment' => 'unity_environment',
  );
  $handler->display->display_options['filters']['type']['group'] = 1;
  /* Filter criterion: Content: Nid */
  $handler->display->display_options['filters']['nid']['id'] = 'nid';
  $handler->display->display_options['filters']['nid']['table'] = 'node';
  $handler->display->display_options['filters']['nid']['field'] = 'nid';
  $handler->display->display_options['filters']['nid']['group'] = 1;
  $handler->display->display_options['filters']['nid']['exposed'] = TRUE;
  $handler->display->display_options['filters']['nid']['expose']['operator_id'] = 'nid_op';
  $handler->display->display_options['filters']['nid']['expose']['label'] = 'id';
  $handler->display->display_options['filters']['nid']['expose']['operator'] = 'nid_op';
  $handler->display->display_options['filters']['nid']['expose']['identifier'] = 'id';
  $handler->display->display_options['filters']['nid']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );

  /* Display: Services */
  $handler = $view->new_display('services', 'Services', 'services_1');
  $handler->display->display_options['defaults']['relationships'] = FALSE;
  /* Relationship: Content: Tours (field_collection_tours) */
  $handler->display->display_options['relationships']['field_collection_tours_value']['id'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['table'] = 'field_data_field_collection_tours';
  $handler->display->display_options['relationships']['field_collection_tours_value']['field'] = 'field_collection_tours_value';
  $handler->display->display_options['relationships']['field_collection_tours_value']['delta'] = '-1';
  $handler->display->display_options['path'] = 'environment';
  $export['unity_environment'] = $view;

  return $export;
}
