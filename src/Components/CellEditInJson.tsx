import ReactJson from 'react-json-view';

export default function CellEditInJson(propsIn) {
  const { props } = propsIn;
  const { row, name, type } = props;

  return (
    <ReactJson
      src={
        type === 'dict' && row[name] === ''
          ? {}
          : type === 'list' && row[name] === ''
          ? []
          : row[name]
      }
      name={name}
      theme="monokai"
      collapsed
      collapseStringsAfterLength={30}
      groupArraysAfterLength={15}
      // onEdit={(edit) => onChange(edit, row, index)}
      // onAdd={(add) => onChange(add, row, index)}
      defaultValue="object"
      // onDelete={(del) => onChange(del, row, index)}
      // onSelect={(sel) => onChange(sel, row, index)}
      quotesOnKeys={false}
      style={{ backgroundColor: 'rgb(59, 77, 172)' }}
      displayDataTypes
      // defaultValue={object}
    />
  );
}
