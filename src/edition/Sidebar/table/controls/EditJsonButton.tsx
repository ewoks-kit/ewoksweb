import { EditOutlined as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import EditJsonDialog from '../../../../general/EditJsonDialog';
import { transformInObject } from '../utils';
import styles from './EditJsonButton.module.css';

interface Props {
  value: unknown;
  type: 'dict' | 'list';
  disabled?: boolean;
  onChange: (newValue: object) => void;
}

function EditJsonButton(props: Props) {
  const { value, type, disabled, onChange } = props;

  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <>
      {openEditDialog && (
        <EditJsonDialog
          open={openEditDialog}
          value={transformInObject(value, type)}
          title={`Edit ${type}`}
          onClose={() => setOpenEditDialog(false)}
          setValue={onChange}
        />
      )}

      <span className={styles.icon}>
        {value && typeof value === 'object' ? JSON.stringify(value) : ''}

        <IconButton
          disabled={disabled}
          size="small"
          aria-label={`Edit ${type}`}
          onClick={() => {
            setOpenEditDialog(true);
          }}
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </span>
    </>
  );
}

export default EditJsonButton;
