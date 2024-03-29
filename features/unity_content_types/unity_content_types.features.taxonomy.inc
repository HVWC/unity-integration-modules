<?php
/**
 * @file
 * unity_content_types.features.taxonomy.inc
 */

/**
 * Implements hook_taxonomy_default_vocabularies().
 */
function unity_content_types_taxonomy_default_vocabularies() {
  return array(
    'placard_tags' => array(
      'name' => 'Placard Tags',
      'machine_name' => 'placard_tags',
      'description' => 'General purpose tagging for placards',
      'hierarchy' => 0,
      'module' => 'taxonomy',
      'weight' => 0,
      'rdf_mapping' => array(
        'rdftype' => array(
          0 => 'skos:ConceptScheme',
        ),
        'name' => array(
          'predicates' => array(
            0 => 'dc:title',
          ),
        ),
        'description' => array(
          'predicates' => array(
            0 => 'rdfs:comment',
          ),
        ),
      ),
    ),
  );
}
