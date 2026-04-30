# Formularios e Interacción

Documentación sobre la implementación de formularios controlados en React.

## Formularios Controlados

Un formulario controlado en React es aquel cuyos elementos de entrada (inputs) tienen su estado vinculado directamente al estado del componente mediante handlers de cambio.

### Ejemplo Básico: Crear Decisión

```tsx
// filepath: src/components/CreateDecisionForm.tsx
import { useState } from 'react';
import { Button } from './Button';

interface CreateDecisionFormProps {
  onSubmit: (title: string, options: string[]) => void;
}

export const CreateDecisionForm = ({ onSubmit }: CreateDecisionFormProps) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handler para cambiar el título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Limpiar error cuando el usuario escribe
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // Handler para cambiar una opción específica
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Limpiar error de opciones
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: '' }));
    }
  };

  // Agregar nueva opción
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  // Eliminar opción
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Validación básica
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'Se requieren al menos 2 opciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const validOptions = options.filter(opt => opt.trim());
      onSubmit(title.trim(), validOptions);
      
      // Reset del formulario
      setTitle('');
      setOptions(['', '']);
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Título de la decisión
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="¿Qué decisión necesitas tomar?"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Opciones */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Opciones
        </label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Opción ${index + 1}`}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="px-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        {errors.options && (
          <p className="text-red-500 text-sm mt-1">{errors.options}</p>
        )}
        
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Agregar opción
          </button>
        )}
      </div>

      {/* Botón de envío */}
      <Button
        label="Crear Decisión"
        type="submit"
        variant="primary"
      />
    </form>
  );
};
```

## Gestión de Estado de Inputs

### useState para Campos Simples

```tsx
const [inputValue, setInputValue] = useState('');
```

### useState para Múltiples Campos

```tsx
const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: 'general'
});

// Handler genérico para múltiples campos
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

## Validación de Campos

### Reglas de Validación Comunes

| Campo | Reglas |
|-------|--------|
| Título | Requerido, min 3 caracteres, max 100 |
| Opciones | Mínimo 2, máximo 6, no vacías |
| Email | Formato válido de email |
| Fecha | No anterior a hoy |

### Función de Validación

```tsx
interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

const validateField = (value: string, rules: ValidationRules): string => {
  if (rules.required && !value.trim()) {
    return 'Este campo es requerido';
  }
  if (rules.minLength && value.length < rules.minLength) {
    return `Mínimo ${rules.minLength} caracteres`;
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Máximo ${rules.maxLength} caracteres`;
  }
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Formato inválido';
  }
  if (rules.custom && !rules.custom(value)) {
    return 'Valor no válido';
  }
  return '';
};
```

## Mensajes de Error y Confirmación

### Mostrar Errores

```tsx
// Errors inline junto al campo
{errors.fieldName && (
  <p className="text-red-500 text-sm">{errors.fieldName}</p>
)}

// Errors generales arriba del formulario
{Object.keys(errors).length > 0 && (
  <div className="bg-red-50 border border-red-200 rounded p-3">
    <p className="text-red-700 font-medium">Por favor corrige los siguientes errores:</p>
    <ul className="list-disc list-inside text-red-600">
      {Object.values(errors).map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  </div>
)}
```

### Mensajes de Confirmación

```tsx
const [successMessage, setSuccessMessage] = useState('');

const handleSubmit = () => {
  // Lógica de submit...
  setSuccessMessage('¡Decisión creada exitosamente!');
  
  // Auto-ocultar después de 3 segundos
  setTimeout(() => setSuccessMessage(''), 3000);
};

// En el JSX:
{successMessage && (
  <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700">
    {successMessage}
  </div>
)}
```

## Patrón de Formulario Reutilizable

```tsx
// filepath: src/components/FormField.tsx
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
```

## Mejores Prácticas

1. **Usar estado controlado** — Todos los inputs deben estar vinculados al estado
2. **Validar en tiempo real** — Mostrar errores mientras el usuario escribe
3. **Validar al submit** — Validación final antes de enviar datos
4. **Limpiar errores al editar** — Cuando el usuario corrige, quitar el mensaje de error
5. **Feedback claro** — Mensajes de error específicos y accionables
6. **Accesibilidad** — Usar labels asociados a los inputs mediante `htmlFor`
7. **Manejar edge cases** — Campos vacíos, valores por defecto, reset del formulario