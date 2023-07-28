import React from 'react';
import BaseFormComponent from '../Common/BaseFormComponent';


const CAFormDeleteComponent: React.FC = () => {

  const entityTypes = [
    { entityType: 'City', value: 'cities' },
    { entityType: 'Airline', value: 'airlines' },
    
  ];

  return <BaseFormComponent dataCategory="cities_airlines" formType="Delete" entityTypes={entityTypes}/>;
};

export default CAFormDeleteComponent;
