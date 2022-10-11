import React, { useEffect } from 'react';
import state from '../store/state';
import type { GraphDetails } from '../types';
import TextButtonSave from './TextButtonSave';

// DOC: the label and the comment when the graph is the selectedElement
export default function GraphLabelComment() {
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [category, setCategory] = React.useState('');
  const setSelectedElement = state((state) => state.setSelectedElement);
  const selectedElement = state((state) => state.selectedElement);

  useEffect(() => {
    const graphElement = selectedElement as GraphDetails;
    setLabel(graphElement.label);
    setCategory(graphElement.category);
    setComment(graphElement.uiProps && graphElement.uiProps.comment);
  }, [selectedElement.id, selectedElement]);

  const saveCategory = (category) => {
    setSelectedElement(
      {
        ...selectedElement,
        category,
      } as GraphDetails,
      'fromSaveElement'
    );
  };

  const saveLabel = (label) => {
    // setLabel(event.target.value);
    setSelectedElement(
      {
        ...selectedElement,
        label,
      },
      'fromSaveElement'
    );
  };

  const saveComment = (comment) => {
    setSelectedElement(
      {
        ...selectedElement,
        uiProps: { ...selectedElement.uiProps, comment },
      },
      'fromSaveElement'
    );
  };

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
      {/* DOC: if the inputs and outputs of the graph are needed
      <div>
      <b>Inputs </b>
      {graphInputs.length > 0 && <DenseTable data={graphInputs} />}
    </div>
    <div>
      <b>Outputs </b>
      {graphOutputs.length > 0 && <DenseTable data={graphOutputs} />}
    </div> */}
    </>
  );
}
