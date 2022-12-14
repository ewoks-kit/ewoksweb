import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import TextButtonSave from './TextButtonSave';

// DOC: the label and the comment when the graph is the selectedElement
export default function GraphLabelComment() {
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [category, setCategory] = React.useState('');
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedElement = useStore((state) => state.selectedElement);

  useEffect(() => {
    if ('input_nodes' in selectedElement) {
      setLabel(selectedElement.label);
      setCategory(selectedElement.category);
      setComment(selectedElement.uiProps?.comment);
    }
  }, [selectedElement]);

  function saveCategory(categ) {
    setSelectedElement(
      {
        ...selectedElement,
        category: categ,
      },
      'fromSaveElement'
    );
  }

  function saveLabel(labe: string) {
    setSelectedElement(
      {
        ...selectedElement,
        label: labe,
      },
      'fromSaveElement'
    );
  }

  function saveComment(commen: string) {
    setSelectedElement(
      {
        ...selectedElement,
        uiProps: { ...selectedElement.uiProps, comment: commen },
      },
      'fromSaveElement'
    );
  }

  return (
    <>
      <TextButtonSave label="Label" value={label} valueSaved={saveLabel} />
      <TextButtonSave
        label="Comment"
        value={comment}
        valueSaved={saveComment}
      />
      <TextButtonSave
        label="Category"
        value={category}
        valueSaved={saveCategory}
      />
    </>
  );
}
