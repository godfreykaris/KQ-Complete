import React from 'react';
import BaseFormAddComponent from '../Common/BaseFormAddComponent';

const BaseFormAddOtherComponent: React.FC = () => {

  const entityTypes = [
    { entityType: 'Skill', value: 'skills' },
    { entityType: 'Qualification', value: 'qualifications' },
    { entityType: 'Job Title', value: 'jobTitles' },
    { entityType: 'Flight Class', value: 'flightClasses' },
    { entityType: 'Flight Status', value: 'flightStatuses' },
    { entityType: 'Seat Location', value: 'seatLocations' },
  ];

  return <BaseFormAddComponent  dataCategory="other"  entityTypes={entityTypes} />;
};

export default BaseFormAddOtherComponent;
