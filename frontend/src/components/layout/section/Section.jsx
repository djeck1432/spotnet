import React from 'react';

const Section = ({ id, title, content }) => {
  const renderContent = (item, index) => {
    switch (item.type) {
      case 'text':
        return (
          <p key={index} className="text-base leading-relaxed mb-6 opacity-90 text-primary">
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
          <ul key={index} className="list-none pl-6 mb-6">
            {item.items.map((listItem, i) => (
              <li key={i} className="mb-3 opacity-90 text-primary flex items-start gap-2">
                • {listItem}
              </li>
            ))}
          </ul>
        );
      case 'orderedList':
        return (
          <ol key={index} className="list-none pl-6 mb-6">
            {item.items.map((listItem, i) => (
              <li key={i} className="mb-3 opacity-90 text-primary flex items-start gap-2">
                {i + 1}. {listItem}
              </li>
            ))}
          </ol>
        );
      default:
        return null;
    }
  };

  return (
    <section id={id} className="mb-16 relative scroll-mt-20">
      <h2 className="text-xl font-semibold mb-6 text-primary flex items-center gap-2">
        • {title}
      </h2>
      {content.map((item, index) => renderContent(item, index))}
    </section>
  );
};

export default Section;
