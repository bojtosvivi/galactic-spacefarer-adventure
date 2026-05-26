using SpacefarerService as service from '../../srv/spacefarer-service';

// List Report & Object Page annotations

annotate service.Spacefarers with @(

  // Header info (Object Page title)
  UI.HeaderInfo: {
    TypeName      : 'Spacefarer',
    TypeNamePlural: 'Spacefarers',
    Title         : { Value: firstName },
    Description   : { Value: lastName }
  },

  // List Report

  // Table columns
  UI.LineItem: [
    { Value: firstName,          Label: 'First Name'         },
    { Value: lastName,           Label: 'Last Name'          },
    { Value: originPlanet.name,  Label: 'Origin Planet'      },
    { Value: stardustCollection, Label: 'Stardust Collection'},
    { Value: spacesuitColor,     Label: 'Spacesuit Color'    }
  ],

  // Filter bar fields
  UI.SelectionFields: [
    originPlanet_ID,
    department_ID,
    position_ID,
    spacesuitColor
  ],

  // Object Page

  UI.Facets: [
    {
      $Type : 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup#General',
      Label : 'General Information'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup#Cosmic',
      Label : 'Cosmic Stats'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup#Assignment',
      Label : 'Assignment'
    }
  ],

  UI.FieldGroup #General: {
    Data: [
      { Value: firstName        },
      { Value: lastName         },
      { Value: email            },
      { Value: originPlanet_ID,  Label: 'Origin Planet' }
    ]
  },

  UI.FieldGroup #Cosmic: {
    Data: [
      { Value: stardustCollection     },
      { Value: wormholeNavigationSkill},
      { Value: spacesuitColor         }
    ]
  },

  UI.FieldGroup #Assignment: {
    Data: [
      { Value: department_ID },
      { Value: position_ID   }
    ]
  }
);

// Exclude lookup entities from Fiori Elements navigation context

annotate service.Planets         with @UI.ExcludeFromNavigationContext: true;
annotate service.Departments     with @UI.ExcludeFromNavigationContext: true;
annotate service.Positions       with @UI.ExcludeFromNavigationContext: true;
annotate service.SpacesuitColors with @UI.ExcludeFromNavigationContext: true;

// Field labels + Text + Value lists for dropdowns in filter bar and Object Page

annotate service.Spacefarers with {
  firstName               @Common.Label: 'First Name';
  lastName                @Common.Label: 'Last Name';
  email                   @Common.Label: 'Email';
  stardustCollection      @Common.Label: 'Stardust Collection';
  wormholeNavigationSkill @Common.Label: 'Wormhole Navigation Skill';
  spacesuitColor @(
    Common.Label: 'Spacesuit Color',
    Common.ValueListWithFixedValues: true,
    Common.ValueList: {
      CollectionPath: 'SpacesuitColors',
      Parameters: [
        { $Type: 'Common.ValueListParameterOut', LocalDataProperty: spacesuitColor, ValueListProperty: 'color' }
      ]
    }
  );

  originPlanet @(
    Common.Label          : 'Origin Planet',
    Common.Text           : originPlanet.name,
    Common.TextArrangement: #TextOnly,
    Common.ValueList      : {
      CollectionPath: 'Planets',
      Parameters: [
        { $Type: 'Common.ValueListParameterOut',         LocalDataProperty: originPlanet_ID, ValueListProperty: 'ID'   },
        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
      ]
    }
  );

  department @(
    Common.Label          : 'Department',
    Common.Text           : department.name,
    Common.TextArrangement: #TextOnly,
    Common.ValueList      : {
      CollectionPath: 'Departments',
      Parameters: [
        { $Type: 'Common.ValueListParameterOut',         LocalDataProperty: department_ID, ValueListProperty: 'ID'   },
        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name' }
      ]
    }
  );

  position @(
    Common.Label          : 'Position',
    Common.Text           : position.title,
    Common.TextArrangement: #TextOnly,
    Common.ValueList      : {
      CollectionPath: 'Positions',
      Parameters: [
        { $Type: 'Common.ValueListParameterOut',         LocalDataProperty: position_ID, ValueListProperty: 'ID'    },
        { $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'title' }
      ]
    }
  );
}
