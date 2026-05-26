using galactic.spacefarer as db from '../db/data-model';

@path: '/galactic'
@requires: 'authenticated-user'
service SpacefarerService {

  @odata.draft.enabled
  @restrict: [
    // Admin: full access across all planets
    { grant: '*', to: 'SpacefarerAdmin' },
    // User: CREATE without restriction (draft is empty when created)
    { grant: 'CREATE', to: 'SpacefarerUser' },
    // User: READ/UPDATE/DELETE restricted to own planet (ABAC row-level)
    { grant: ['READ', 'UPDATE', 'DELETE'], to: 'SpacefarerUser',
      where: 'originPlanet.code = $user.planet' }
  ]
  entity Spacefarers as projection on db.Spacefarers;

  @readonly entity Planets         as projection on db.Planets;
  @readonly entity Departments     as projection on db.Departments;
  @readonly entity Positions       as projection on db.Positions;
  @readonly entity SpacesuitColors as projection on db.SpacesuitColors;
}