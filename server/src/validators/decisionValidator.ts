import type {
  CreateDecisionDTO,
  UpdateDecisionDTO,
  ValidationError,
} from '../types';

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const validateOptions = (options: unknown): ValidationError[] => {
  if (!Array.isArray(options)) {
    return [{ field: 'options', message: 'Debe ser un arreglo de opciones.' }];
  }

  if (options.length < 2) {
    return [
      {
        field: 'options',
        message: 'Debes enviar al menos 2 opciones.',
      },
    ];
  }

  const hasInvalidOption = options.some((option) => !isNonEmptyString(option));
  if (hasInvalidOption) {
    return [
      {
        field: 'options',
        message: 'Todas las opciones deben ser texto no vacio.',
      },
    ];
  }

  return [];
};

const validateSelectedOption = (
  selectedOption: unknown,
  options: string[] | undefined,
): ValidationError[] => {
  if (selectedOption === undefined || selectedOption === null) {
    return [];
  }

  if (typeof selectedOption !== 'string') {
    return [
      {
        field: 'selectedOption',
        message: 'selectedOption debe ser string o null.',
      },
    ];
  }

  if (options && !options.includes(selectedOption)) {
    return [
      {
        field: 'selectedOption',
        message: 'selectedOption debe existir dentro de options.',
      },
    ];
  }

  return [];
};

export const validateCreateDecision = (
  payload: CreateDecisionDTO,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(payload?.title)) {
    errors.push({
      field: 'title',
      message: 'El titulo es obligatorio.',
    });
  }

  errors.push(...validateOptions(payload?.options));

  if (Array.isArray(payload?.options)) {
    errors.push(
      ...validateSelectedOption(payload?.selectedOption, payload.options),
    );
  }

  return errors;
};

export const validateUpdateDecision = (
  payload: UpdateDecisionDTO,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!payload || typeof payload !== 'object') {
    return [{ field: 'body', message: 'Body invalido.' }];
  }

  const hasFields =
    payload.title !== undefined ||
    payload.options !== undefined ||
    payload.selectedOption !== undefined;

  if (!hasFields) {
    return [{ field: 'body', message: 'Debes enviar al menos un campo.' }];
  }

  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    errors.push({
      field: 'title',
      message: 'Si se envia title, debe ser texto no vacio.',
    });
  }

  if (payload.options !== undefined) {
    errors.push(...validateOptions(payload.options));
  }

  if (payload.options !== undefined) {
    errors.push(
      ...validateSelectedOption(payload.selectedOption, payload.options),
    );
  } else {
    errors.push(...validateSelectedOption(payload.selectedOption, undefined));
  }

  return errors;
};
