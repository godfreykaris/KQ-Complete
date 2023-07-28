import React from 'react';
import BaseFormComponent from '../Common/BaseFormComponent';


const CAFormViewComponent: React.FC = () => {

  const entityTypes = [
    { entityType: 'City', value: 'cities' },
    { entityType: 'Airline', value: 'airlines' },
    
  ];

  return <BaseFormComponent dataCategory="cities_airlines" formType="View" entityTypes={entityTypes}/>;
};

export default CAFormViewComponent;
