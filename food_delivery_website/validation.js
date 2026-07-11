function validateName(value) {
  const trimmed = (value || '').trim();
  return trimmed.length >= 2;
}

function validatePhone(value) {
  const trimmed = (value || '').trim();
  return /^\d{10}$/.test(trimmed);
}

function validateCustomerDetails(name, phone) {
  const errors = [];

  if (!validateName(name)) {
    errors.push('Please type your name before ordering.');
  }

  if (!validatePhone(phone)) {
    errors.push('Please enter 10 digits for your phone number.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

if (typeof window !== 'undefined') {
  window.validateName = validateName;
  window.validatePhone = validatePhone;
  window.validateCustomerDetails = validateCustomerDetails;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateName,
    validatePhone,
    validateCustomerDetails
  };
}
