const structure = [
  { id: 1, name: 'first', noData: true, slotName: 'propertyLine', checked: false },
  { id: 2, name: 'second', parentId: 1, slotName: 'roomLine' },
  { id: 3, name: 'third', noData: true, slotName: 'hotelLine', parentId: 1, checked: false },
  { id: 4, name: 'fourth', parentId: 3, slotName: 'roomLine' },
  { id: 5, name: 'fifth', parentId: 3, slotName: 'roomLine' },
  { id: 6, name: 'six',  parentId: 3, slotName: 'roomLine' },
];

const linear = ['a', 'b', 'c', 'd', 'e', 'f'];

const getValues = () => {
  const values = {};

  structure.forEach(str => {
    values[str.id] = {};

    linear.forEach(l => {
      values[str.id][l] = ~~ (Math.random() * 100);
    });
  });

  return values;
};

export { structure, linear, getValues, slotAdapter };