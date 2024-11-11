// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('.needs-validation');
    const recipeTextarea = document.getElementById('recipe');
    const charCount = document.getElementById('charCount');
    
    // Input constraints
    const constraints = {
        subject: {
            min: 3,
            max: 30,
            pattern: /^[A-Za-z0-9\s]+$/,
            message: 'Subject must be 3-50 characters and contain only letters, numbers and spaces.'
        },
        title: {
            min: 5,
            max: 30,
            pattern: /^[A-Za-z0-9\s]+$/,
            message: 'Title must be 5-100 characters and contain only letters, numbers and spaces.'
        },
        username: {
            min: 3,
            max: 15,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores.'
        },
        recipe: {
            min: 50,
            max: 5000,
            message: 'Recipe must be between 50 and 5000 characters.'
        },
        email: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Please enter a valid email address.'
        }
    };

    // Update character count for recipe
    recipeTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        validateField(this, constraints.recipe);
    });

    // Form submission handler
    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });

    // Real-time validation for all inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this, constraints[this.id]);
        });
    });

    // Validate individual field
    function validateField(field, constraint) {
        let isValid = true;
        const value = field.value.trim();

        // Skip validation for optional empty email
        if (field.id === 'email' && value === '') {
            resetValidationState(field);
            return true;
        }

        // Check if empty
        if (field.required && value === '') {
            isValid = false;
        }

        // Check length constraints
        if (constraint && (constraint.min || constraint.max)) {
            if (value.length < constraint.min || value.length > constraint.max) {
                isValid = false;
            }
        }

        // Check pattern
        if (constraint && constraint.pattern && !constraint.pattern.test(value)) {
            isValid = false;
        }

        // Special handling for select elements
        if (field.tagName === 'SELECT' && field.value === '') {
            isValid = false;
        }

        // Update validation state
        updateValidationState(field, isValid);
        return isValid;
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!validateField(input, constraints[input.id])) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Update validation visual state
    function updateValidationState(field, isValid) {
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
    }

    // Reset validation state
    function resetValidationState(field) {
        field.classList.remove('is-invalid', 'is-valid');
    }
}); 