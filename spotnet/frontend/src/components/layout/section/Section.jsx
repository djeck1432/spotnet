import React from 'react';

const Section = ({ id, title, content }) => {
  const renderContent = (item, index) => {
    switch (item.type) {
      case 'text':
        return (
          <p key={index} className="mb-6 text-base leading-relaxed text-white opacity-90">
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
          <ul key={index} className="mb-6 list-none pl-6">
            {item.items.map((listItem, i) => (
              <li key={i} className="mb-3 flex items-start gap-2 text-white opacity-90">
                • {listItem}
              </li>
            ))}
          </ul>
        );
      case 'orderedList':
        return (
          <ol key={index} className="mb-6 list-none pl-6">
            {item.items.map((listItem, i) => (
              <li key={i} className="mb-3 flex items-start gap-2 text-white opacity-90">
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
    <section id={id} className="relative mb-16 scroll-mt-20">
      <h2 className="mb-6 flex items-center justify-start gap-2 text-left text-xl font-semibold text-white">
        • {title}
      </h2>
      {content.map((item, index) => renderContent(item, index))}
    </section>
  );
};

export default Section;
