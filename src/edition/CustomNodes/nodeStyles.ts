export const contentStyle = {
  contentHeader: {
    padding: '8px 0px',
    flexGrow: 1,
    backgroundColor: '#eee',
  },
  io: {
    position: 'relative',
    padding: '8px 16px',
    flexGrow: 1,
    borderRadius: '15px',
  },
  borderInput: {
    border: '1px solid rgb(230, 190, 118)',
  },
  borderOutput: {
    border: '1px solid rgb(118, 133, 221)',
  },
  left: { left: '-8px' },
  textLeft: { textAlign: 'left' },
  right: { right: '-8px' },
  textRight: { textAlign: 'right' },
  handle: {
    zIndex: 1000, // Uncomment
    widht: '20px', // Does not work
    height: '20px',
    margin: 'auto',
    background: '#ddd',
    borderRadius: '15px',
    border: '2px solid rgb(118, 133, 221)',
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
  },
  handleSource: {
    width: '10px',
    border: '2px solid rgb(118, 133, 221)',
  },
  handleTarget: {
    width: '10px',
    border: '2px solid rgb(230, 190, 118)',
  },
  handleUpDown: {
    // height: '18px',
    // background: 'rgb(221, 221, 221)',
    // width: '11px',
  },
  iconButtons: {
    margin: '0px 2px',
    padding: '0px',
  },
} as const;

export const style = {
  icons: {
    maxWidth: '100px',
  },
  contentWrapper: {
    padding: '8px 0px',
  },
  comment: {
    padding: '1px',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: 300,
    lineHeight: '1.13',
  },
  displayNode: {
    textAlign: 'center' as const,
    minWidth: '60px', // for standard width
    maxWidth: '300px',
    display: 'inline',
    margin: '2px',
    padding: '2px',
  },
} as const;
