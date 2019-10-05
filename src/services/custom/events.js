import { useCallback, useState, useEffect } from 'react';


function getInvalid(result) {
  return result === false ? 'MSG_INVALID_VALUE' : 'string' === typeof result && !!result ? result : false;
}

export function isInvalidDisabled(invalid) {
  return invalid === undefined || ('string' === typeof invalid && !!invalid.trim());
}

export function useCancelEvent() {
  return useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
}

export function useSelectOption({ onSelect }) {
  const doSelect = useCallback(option => onSelect(option), [ onSelect ]);

  return useCallback(option => (() => doSelect(option)), [ doSelect ]);
};

export function useChange([ value, setValue ], validation = () => true) {
  const [ invalid, setInvalid ] = useState();

  useEffect(() => {
    const vres = validation(value);

    if (vres instanceof Promise)
      vres.then(result => setInvalid(getInvalid(result)));
    else
      setInvalid(getInvalid(vres));
  }, [ value, validation, setInvalid ]);

  return [
    value,
    useCallback(e => setValue(e.target.value), [ setValue ]),
    invalid
  ];
};
