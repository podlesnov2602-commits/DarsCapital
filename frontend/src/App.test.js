import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertySpecifications from './components/PropertySpecifications';
import properties from './data/properties.json';

test('passport renders confirmed facts without price or missing-value placeholders',()=>{
 const {container}=render(<PropertySpecifications property={properties.find(p=>p.id==='72')}/>);
 expect(screen.getByRole('heading',{name:'Основные характеристики'})).toBeTruthy();
 expect(container.textContent).toContain('RAMS Signature, блок A');
 expect(container.textContent).toContain('124,1 м²');
 expect(container.textContent).not.toMatch(/₸|Уточняется|null|undefined/);
});
test('additional passport retains important land and utilities conditions',()=>{
 const {container}=render(<PropertySpecifications property={properties.find(p=>p.id==='91')} additional/>);
 expect(container.textContent).toContain('ЛПХ');
 expect(container.textContent).toContain('Септик');
});
