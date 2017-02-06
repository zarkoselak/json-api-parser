'use strict';

/**
 * Normalizes json api response
 * @param  {Object} json json-api object
 * @return {Object}      normalized object
 */
export const normalize = (json) => {
  const entities  = Array.isArray(json.data) ? json.data : [json.data];
  const includes  = json.included || [];
  const resources = [...entities, ...includes];

  return flatten(resources);
};

/**
 * Denormalizes object and transforms it back to json-api structure
 * @param  {Object} json json object
 * @return {Object}      json-api spec object
 */
export const denormalize = (json) => {
  return null;
};

/**
 * Flatten relationships in entity
 * @param  {Object} relationships json-api relationships
 * @return {Object}               flattened json object
 */
const flattenRelationships = (relationships) => {
  if(!relationships) return;

  let normalized = {};

  Object.keys(relationships)
    .map((value, index) => Array.isArray(relationships[value].data) ? relationships[value].data : [relationships[value].data])
    .map((data) => {
      data.map((item, items, index) => {
        const {type, id} = item;

        if(!normalized[type]) normalized[type] = {};

        normalized[type][id] = { id, type };
      });
    });

  return {relationships: normalized};
};

/**
 * Flatten all entities in json-api response
 * @param  {Array} resources  array of entities
 * @return {Object}           normalized json object
 */
const flatten = (resources) => {
  let normalized = {};
  resources.map((item, index, items) => {
    const {attributes, type, id, relationships} = item;

    if(!normalized[type]) normalized[type] = {};

    normalized[type][id] = {
      id,
      type,
      ...attributes,
      ...flattenRelationships(relationships)
    };
  });

  return normalized;
};
