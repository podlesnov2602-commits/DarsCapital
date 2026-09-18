import React from 'react';

export default function DescriptionParagraph({ text }) {
  const blocks = [];
  let items = [];
  let prose = [];
  const flushProse = () => {
    if (prose.length) blocks.push(<p key={blocks.length}>{prose.join('\n')}</p>);
    prose = [];
  };
  const flushItems = () => {
    if (items.length) blocks.push(<ul key={blocks.length}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>);
    items = [];
  };
  for (const line of text.split('\n')) {
    if (line.startsWith('• ')) {
      flushProse();
      items.push(line.slice(2));
    } else {
      flushItems();
      if (line.endsWith(':') && line.length < 100) {
        flushProse();
        blocks.push(<p className="estate-description-label" key={blocks.length}><strong>{line}</strong></p>);
      } else prose.push(line);
    }
  }
  flushProse(); flushItems();
  return <>{blocks}</>;
}
