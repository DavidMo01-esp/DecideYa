import { CreateDecisionDTO, UpdateDecisionDTO, ValidationError } from '../types';

export const validateCreateDecision = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];
  const dto = data as CreateDecisionDTO;

  // Validar title
  if (!dto.title || typeof dto.title !== 'string') {
    errors.push({ field: 'title', message: 'El título es requerido' });
  } else if (dto.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'El título debe tener al menos 3 caracteres' });
  } else if (dto.title.trim().length > 100) {
    errors.push({ field: 'title', message: 'El título no puede exceder 100 caracteres' });
  }

  // Validar options
  if (!dto.options || !Array.isArray(dto.options)) {
    errors.push({ field: 'options', message: 'Las opciones son requeridas' });
  } else if (dto.options.length < 2) {
    errors.push({ field: 'options', message: 'Se requieren al menos 2 opciones' });
  } else if (dto.options.length > 6) {
    errors.push({ field: 'options', message: 'Máximo 6 opciones permitidas' });
  } else {
    dto.options.forEach((opt, i) => {
      if (!opt || typeof opt !== 'string' || !opt.trim()) {
        errors.push({ field: `options[${i}]`, message: `La opción ${i + 1} no puede estar vacía` });
      }
    });
  }

  if (dto.selectedOption !== undefined) {
    if (dto.selectedOption !== null && typeof dto.selectedOption !== 'string') {
      errors.push({ field: 'selectedOption', message: 'La opcion elegida debe ser texto o null' });
    } else if (typeof dto.selectedOption === 'string' && !dto.selectedOption.trim()) {
      errors.push({ field: 'selectedOption', message: 'La opcion elegida no puede estar vacia' });
    } else if (
      typeof dto.selectedOption === 'string' &&
      Array.isArray(dto.options) &&
      !dto.options.includes(dto.selectedOption)
    ) {
      errors.push({ field: 'selectedOption', message: 'La opcion elegida debe existir en la lista' });
    }
  }

  return errors;
};

export const validateUpdateDecision = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];
  const dto = data as UpdateDecisionDTO;

  // Si hay title, validarlo
  if (dto.title !== undefined) {
    if (typeof dto.title !== 'string') {
      errors.push({ field: 'title', message: 'El título debe ser una cadena' });
    } else if (dto.title.trim().length < 3) {
      errors.push({ field: 'title', message: 'El título debe tener al menos 3 caracteres' });
    } else if (dto.title.trim().length > 100) {
      errors.push({ field: 'title', message: 'El título no puede exceder 100 caracteres' });
    }
  }

  // Si hay options, validarlas
  if (dto.options !== undefined) {
    if (!Array.isArray(dto.options)) {
      errors.push({ field: 'options', message: 'Las opciones deben ser un array' });
    } else if (dto.options.length < 2) {
      errors.push({ field: 'options', message: 'Se requieren al menos 2 opciones' });
    } else if (dto.options.length > 6) {
      errors.push({ field: 'options', message: 'Máximo 6 opciones permitidas' });
    } else {
      dto.options.forEach((opt, i) => {
        if (!opt || typeof opt !== 'string' || !opt.trim()) {
          errors.push({ field: `options[${i}]`, message: `La opción ${i + 1} no puede estar vacía` });
        }
      });
    }
  }

  if (dto.selectedOption !== undefined) {
    if (dto.selectedOption !== null && typeof dto.selectedOption !== 'string') {
      errors.push({ field: 'selectedOption', message: 'La opcion elegida debe ser texto o null' });
    } else if (typeof dto.selectedOption === 'string' && !dto.selectedOption.trim()) {
      errors.push({ field: 'selectedOption', message: 'La opcion elegida no puede estar vacia' });
    } else if (
      typeof dto.selectedOption === 'string' &&
      Array.isArray(dto.options) &&
      !dto.options.includes(dto.selectedOption)
    ) {
      errors.push({ field: 'selectedOption', message: 'La opcion elegida debe existir en la lista' });
    }
  }

  // Debe tener al menos un campo para actualizar
  if (Object.keys(dto).length === 0) {
    errors.push({ field: 'body', message: 'Debe proporcionar al menos un campo para actualizar' });
  }

  return errors;
};
