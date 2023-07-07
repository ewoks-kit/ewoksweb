import { Tooltip } from '@material-ui/core';
import type { Icon } from '../../../../types';

interface Props {
  icons: Icon[];
  selectedIcon: string;
  setSelectedIcon: (name: string) => void;
  imgHolderClassName?: string;
}

function IconList(props: Props) {
  const { icons, selectedIcon, setSelectedIcon, imgHolderClassName } = props;

  return (
    <span className="dndflow">
      {icons
        .filter((icon) => icon.image?.data_url)
        .map((icon) => (
          <span
            onClick={() => setSelectedIcon(icon.name)}
            aria-hidden="true"
            role="button"
            tabIndex={0}
            key={icon.name}
            className={`dndnode ${
              selectedIcon === icon.name ? 'selectedTask' : ''
            }`}
          >
            <Tooltip title={icon.name} arrow>
              <span role="button" tabIndex={0} className={imgHolderClassName}>
                <img
                  src={icon.image?.data_url}
                  alt={icon.name}
                  key={icon.name}
                />
              </span>
            </Tooltip>
          </span>
        ))}
    </span>
  );
}

export default IconList;
