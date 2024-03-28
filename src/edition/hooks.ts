import { useEventListener } from '@react-hookz/web';
import { unstable_usePrompt } from 'react-router-dom';

export function useWarningPrompt(displayWarning: boolean) {
  useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
    if (displayWarning) {
      event.preventDefault();

      // Included for legacy support, e.g. Chrome/Edge < 119
      event.returnValue = true;
    }
  });

  unstable_usePrompt({
    message: 'There are unsaved changes. Continue without saving?',
    when: displayWarning,
  });
}
