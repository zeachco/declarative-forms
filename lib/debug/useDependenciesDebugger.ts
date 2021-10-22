import {useRef, useMemo} from 'react';

const compareInputs = (
  inputKeys: string[],
  oldInputs: object,
  newInputs: object,
  label: string,
) => {
  inputKeys.forEach((key) => {
    const oldInput = oldInputs[key as keyof typeof oldInputs];
    const newInput = newInputs[key as keyof typeof newInputs];
    if (oldInput !== newInput) {
      // eslint-disable-next-line no-console
      console.log(`${label} change`, key, 'old:', oldInput, 'new:', newInput);
    }
  });
};

export const useDependenciesDebugger = (inputs: object, label = '') => {
  const oldInputsRef = useRef(inputs);
  const inputValuesArray = Object.values(inputs);
  const inputKeysArray = Object.keys(inputs);
  useMemo(() => {
    const oldInputs = oldInputsRef.current;

    compareInputs(inputKeysArray, oldInputs, inputs, label);

    oldInputsRef.current = inputs;
  }, inputValuesArray); // eslint-disable-line react-hooks/exhaustive-deps
};
