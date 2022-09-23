import ReactJson from 'react-json-view';

// TODO if needed
// interface CellEditInJson {
//   row,
//   name,
//   type
// }

export default function CellEditInJson({ row, name, type }) {
  // const { props } = propsIn;
  // const { row, name, type } = props;

  const onChangeL = (edit, row) => {
    /* eslint-disable no-console */
    console.log(edit, row, name);
    // onChange(edit, row, 1);
  };

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
      onEdit={(edit) => onChangeL(edit, row)}
      onAdd={(add) => onChangeL(add, row)}
      defaultValue="object"
      onDelete={(del) => onChangeL(del, row)}
      onSelect={(sel) => onChangeL(sel, row)}
      quotesOnKeys={false}
      style={{ backgroundColor: 'rgb(59, 77, 172)' }}
      displayDataTypes
      // defaultValue={object}
    />
  );
}
