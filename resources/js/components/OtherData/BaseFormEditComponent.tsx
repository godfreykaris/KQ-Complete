import React from 'react';
import BaseFormComponent from '../Common/BaseFormComponent';


const BaseFormEditComponent: React.FC = () => {

  const entityTypes = [
    { entityType: 'Skill', value: 'skills' },
    { entityType: 'Qualification', value: 'qualifications' },
    { entityType: 'Job Title', value: 'jobTitles' },
    { entityType: 'Flight Class', value: 'flightClasses' },
    { entityType: 'Flight Status', value: 'flightStatuses' },
    { entityType: 'Seat Location', value: 'seatLocations' },
  ];

  return <BaseFormComponent  dataCategory="other"  formType="Edit" entityTypes={entityTypes} />;
};

export default BaseFormEditComponent;
