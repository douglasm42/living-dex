import { useEffect, useRef } from 'react';

function isInput(event: globalThis.KeyboardEvent): boolean {
  if(!event.target) {
    return false
  }

  const target = event.target

  if('tagName' in target && typeof target.tagName === 'string' && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
    return true
  }

  if('isContentEditable' in target && target.isContentEditable) {
    return true
  }

  return false
}

interface UseHotkeyOptions {
  ctrl?: boolean
  preventDefault?: boolean
  ignoreOnInput?: boolean
}

export function useHotkey(key: string, callback: (event: globalThis.KeyboardEvent) => void, { ctrl = false, preventDefault = false, ignoreOnInput = true }: UseHotkeyOptions) {
  // Use a ref for the callback to prevent unnecessary effect re-runs
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contentEditable
      if (isInput(event) && ignoreOnInput) {
        return;
      }

      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchCtrl = ctrl ? (event.ctrlKey) : true;

      if (matchKey && matchCtrl) {
        if(preventDefault) {
          event.preventDefault()
        }
        callbackRef.current(event)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrl, preventDefault, ignoreOnInput]);
}
