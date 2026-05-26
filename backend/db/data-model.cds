namespace galactic.spacefarer;

using { cuid, managed } from '@sap/cds/common';

entity Planets: cuid, managed {
  name: String(100) @mandatory;
  code: String(20) @mandatory;
}

entity Departments: cuid, managed {
  name: String(100) @mandatory;
}

entity Positions: cuid, managed {
  title: String(100) @mandatory;
}

entity SpacesuitColors {
  key color: String(20);
}

type SpacesuitColor : String(20) enum {
  White  = 'White';
  Silver = 'Silver';
  Red    = 'Red';
  Blue   = 'Blue';
  Black  = 'Black';
  Gold   = 'Gold';
  Purple = 'Purple';
}

entity Spacefarers: cuid, managed {
    firstName: String(100) @mandatory;
    lastName: String(100) @mandatory;
    email: String(255) @mandatory @assert.format: '^[^@\s]+@[^@\s]+\.[^@\s]+$';

/* Cosmic fields */
    spacesuitColor: SpacesuitColor @assert.range default 'Silver';
    stardustCollection: Integer default 0 @assert.range: [0, 100000];
    wormholeNavigationSkill: Integer default 0 @assert.range: [0, 100];

/* Relations */
    originPlanet: Association to Planets @mandatory; // required for ABAC row-level filtering
    department: Association to Departments;
    position: Association to Positions;
}
