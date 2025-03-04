export const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const moveCard = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return [sourceClone, destClone];
};

export const initialBoard = {
  lists: [
    {
      id: 'list-1',
      title: 'المهام الجديدة',
      cards: []
    },
    {
      id: 'list-2',
      title: 'قيد التنفيذ',
      cards: []
    },
    {
      id: 'list-3',
      title: 'مكتمل',
      cards: []
    }
  ]
}; 