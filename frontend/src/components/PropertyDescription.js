import React from 'react';
import DescriptionParagraph from './DescriptionParagraph';

export default function PropertyDescription({ property }) {
  const sections = (property.description_sections || []).filter(section =>
    section.paragraphs?.some(text => typeof text === 'string' && text.trim())
  );
  const conditions = (property.description_disclosures || []).filter(Boolean);
  if (!sections.length && !conditions.length) return null;

  return <section className="estate-description" aria-label="Описание объекта">
    <h2>Об объекте</h2>
    {sections.map((section, index) => <div className={`estate-description-section${index === 0 ? ' estate-description-intro' : ''}`} key={`${index}-${section.title}`}>
      {index > 0 && section.title && <h3>{section.title}</h3>}
      {section.paragraphs.filter(text => typeof text === 'string' && text.trim()).map((text, paragraphIndex) =>
        <DescriptionParagraph key={paragraphIndex} text={text} />
      )}
    </div>)}
    {conditions.length > 0 && <aside className="estate-description-conditions" aria-label="Важные условия">
      <h3>Важные условия</h3>
      {conditions.map((text,index)=><p key={index}>{text}</p>)}
    </aside>}
  </section>;
}
