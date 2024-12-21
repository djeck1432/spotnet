import React from 'react';
import Section from '../section/Section'; 

const Sections = ({ sections }) => {
  return (
    <div className="sections-container">
      {sections.map((section, index) => (
        <Section 
          key={section.id || index} 
          id={section.id} 
          title={section.title} 
          content={section.content} 
        />
      ))}
    </div>
  );
};

export default Sections;
