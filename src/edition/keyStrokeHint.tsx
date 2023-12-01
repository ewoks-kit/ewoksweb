import { Typography } from '@mui/material';

import styles from './EditPage.module.css';

function KeyStrokeHint({ text }: { text: string }) {
  return (
    <Typography
      className={styles.keyStrokeHint}
      variant="body2"
      color="text.secondary"
    >
      {text}
    </Typography>
  );
}

export default KeyStrokeHint;
