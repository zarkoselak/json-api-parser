'use strict';

export const normalize = (json) => {
  const entities  = Array.isArray(json.data) ? json.data : [json.data];

  const includes  = json.included || [];
  const resources = [...entities, ...includes];

  return flatten(resources);
}

export const denormalize = (json) => {
  return null;
}

const flattenRelationships = (relationships) => {
  if(!relationships) return;

  let normalized = {}

  Object.keys(relationships)
    .map((value, index) => Array.isArray(relationships[value].data) ? relationships[value].data : [relationships[value].data])
    .map((data) => {
      const {type, id} = relation;

      if(!normalized[type]) normalized[type] = {};

      normalized[type][id] = { id, type };
    });

  return normalized;
}

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
}
