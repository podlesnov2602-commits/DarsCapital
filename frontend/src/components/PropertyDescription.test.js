import React from 'react';
import {render,screen,within,cleanup} from '@testing-library/react';
import PropertyDescription from './PropertyDescription';
import properties from '../data/properties.json';

test('all catalogue sections and paragraphs remain readable in the rendered description',()=>{
 for(const property of properties){
  const {container}=render(<PropertyDescription property={property}/>);
  expect(screen.getAllByRole('heading',{level:2})).toHaveLength(1);
  const sections=property.description_sections;
  for(const section of sections){
   expect(screen.getByRole('heading',{name:section.title,exact:true})).toBeTruthy();
   for(const paragraph of section.paragraphs)expect(container.textContent).toContain(paragraph);
  }
  expect(container.querySelector('details')).toBeNull();
  expect(container.querySelector('h1')).toBeNull();
  cleanup();
 }
});

test('material restrictions are visible separately from presentation and not collapsed',()=>{
 const property=properties.find(p=>p.id==='89');
 render(<PropertyDescription property={property}/>);
 const conditions=screen.getByRole('complementary',{name:'Важные условия'});
 expect(within(conditions).getByText(/Перевод целевого назначения/)).toBeTruthy();
 expect(conditions.textContent).toContain('не завершён');
 expect(conditions.closest('details')).toBeNull();
});

test('missing prose and empty conditions do not create blank sections',()=>{
 const {container}=render(<PropertyDescription property={{description_sections:[{title:'Пусто',paragraphs:['']}],description_disclosures:[]}}/>);
 expect(container.firstChild).toBeNull();
});
