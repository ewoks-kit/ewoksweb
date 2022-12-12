import React, { useEffect } from 'react';
import useStore from '../../store/useStore';
import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../../types';
import TextButtonSave from './TextButtonSave';

// DOC: the label and the comment when the graph is the selectedElement
export default function GraphLabelComment() {
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [category, setCategory] = React.useState('');
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedElement = useStore((state) => state.selectedElement);

  useEffect(() => {
    const graphElement = selectedElement as GraphDetails;
    setLabel(graphElement.label);
    setCategory(graphElement.category);
    setComment(graphElement.uiProps?.comment);
  }, [selectedElement.id, selectedElement]);

  function saveCategory(categ) {
    setSelectedElement(
      {
        ...selectedElement,
        category: categ,
      } as GraphDetails,
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
      } as EwoksRFNode | EwoksRFLink,
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
