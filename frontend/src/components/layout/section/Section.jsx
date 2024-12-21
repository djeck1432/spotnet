import React from 'react';
import './section.css';

const Section = ({ id, title, content }) => {
  const renderContent = (item, index) => {
    switch (item.type) {
      case 'text':
        return (
          <p key={index} className="section-text">
            {item.value.split('\n').map((text, i) => (
              <React.Fragment key={i}>
                {text}
                {i < item.value.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      case 'list':
        return (
          <ul key={index} className="feature-list">
            {item.items.map((listItem, i) => (
              <li key={i}>• {listItem}</li>
            ))}
          </ul>
        );
      case 'orderedList':
        return (
          <ol key={index} className="setup-steps">
            {item.items.map((listItem, i) => (
              <li key={i}>{i + 1}. {listItem}</li>
            ))}
          </ol>
        );
      default:
        return null;
    }
  };

  return (
    <section id={id} className="documentation-section">
      <h2 className="section-title">• {title}</h2>
      {content.map((item, index) => renderContent(item, index))}
    </section>
  );
};

export default Section;