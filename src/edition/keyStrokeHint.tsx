import { Typography } from '@mui/material';

function KeyStrokeHint({ text }: { text: string }) {
  return (
    <Typography
      style={{
        marginLeft: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgb(243, 244, 249)',
        padding: '0 0.4em',
        border: 'medium',
      }}
      variant="body2"
      color="text.secondary"
    >
      {text}
    </Typography>
  );
}

export default KeyStrokeHint;
