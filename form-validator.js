/**
 * Enhanced Form Validation
 */

class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = new Map();
        this.errors = new Map();
        this.init();
    }

    init() {
        // Add real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            
            // Only use Utils.debounce if available, otherwise use regular debounce
            const debounceFn = (typeof Utils !== 'undefined' && Utils.debounce) 
                ? Utils.debounce(() => {
                    if (this.errors.has(field.name || field.id)) {
                        this.validateField(field);
                    }
                }, 300)
                : (() => {
                    let timeout;
                    return () => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            if (this.errors.has(field.name || field.id)) {
                                this.validateField(field);
                            }
                        }, 300);
                    };
                })();
            
            field.addEventListener('input', debounceFn);
        });

        // Note: We don't add submit handler here to avoid conflicts
        // The submit handler should be added manually in the form's submit handler
    }

    addRule(fieldName, rule, message) {
        if (!this.rules.has(fieldName)) {
            this.rules.set(fieldName, []);
        }
        this.rules.get(fieldName).push({ rule, message });
    }

    validateField(field) {
        const fieldName = field.name || field.id;
        if (!fieldName) return true; // Skip if no name/id
        
        const value = field.value ? field.value.trim() : '';
        const rules = this.rules.get(fieldName) || [];

        // Clear previous error
        this.clearFieldError(field);

        // Check required
        if (field.hasAttribute('required') && !value) {
            this.setFieldError(field, 'Trường này là bắt buộc');
            return false;
        }

        // Skip validation if field is empty and not required
        if (!value && !field.hasAttribute('required')) {
            return true;
        }

        // Apply custom rules
        for (const { rule, message } of rules) {
            try {
                if (typeof rule === 'function' && !rule(value, field)) {
                    this.setFieldError(field, message);
                    return false;
                }
            } catch (error) {
                console.warn('Validation rule error:', error);
            }
        }

        // HTML5 validation
        if (field.checkValidity && !field.checkValidity()) {
            this.setFieldError(field, field.validationMessage || 'Giá trị không hợp lệ');
            return false;
        }

        return true;
    }

    validate() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, textarea, select');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setFieldError(field, message) {
        const fieldName = field.name || field.id;
        this.errors.set(fieldName, message);

        // Add error class
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        // Create or update error message
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            field.parentElement.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(field) {
        const fieldName = field.name || field.id;
        this.errors.delete(fieldName);

        field.classList.remove('error');
        field.removeAttribute('aria-invalid');

        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showErrors() {
        // Show toast for first error
        const firstError = Array.from(this.errors.values())[0];
        if (firstError && typeof Utils !== 'undefined' && Utils.Toast) {
            Utils.Toast.error(firstError, 'Lỗi xác thực');
        }

        // Focus first error field
        const firstErrorField = this.form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    reset() {
        this.errors.clear();
        this.form.querySelectorAll('.error').forEach(field => {
            this.clearFieldError(field);
        });
    }
}

// Common validation rules
FormValidator.rules = {
    required: (value) => value.trim().length > 0,
    
    email: (value) => {
        if (!value) return true; // Optional if not required
        return Utils.isValidEmail(value);
    },
    
    minLength: (min) => (value) => value.length >= min,
    
    maxLength: (max) => (value) => value.length <= max,
    
    pattern: (regex) => (value) => {
        if (!value) return true;
        return regex.test(value);
    },
    
    password: (value) => {
        if (!value) return true;
        return value.length >= 8 && 
               /[a-z]/.test(value) && 
               /[A-Z]/.test(value) && 
               /\d/.test(value);
    },
    
    url: (value) => {
        if (!value) return true;
        return Utils.isValidURL(value);
    },
    
    match: (otherField) => (value, currentField) => {
        const form = currentField.closest('form');
        const other = form.querySelector(`[name="${otherField}"]`);
        return !other || value === other.value;
    }
};

// Add styles
const validatorStyle = document.createElement('style');
validatorStyle.textContent = `
    .field-error {
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        display: none;
        animation: fadeIn 0.3s ease;
    }

    .field-error.show {
        display: block;
    }

    input.error,
    textarea.error,
    select.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    input.valid,
    textarea.valid,
    select.valid {
        border-color: #22c55e !important;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(validatorStyle);

// Export
if (typeof window !== 'undefined') {
    window.FormValidator = FormValidator;
}

