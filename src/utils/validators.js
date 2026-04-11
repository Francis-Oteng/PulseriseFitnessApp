// Input validation helpers

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 6) errors.push('At least 6 characters required');
  if (password.length > 40) errors.push('Maximum 40 characters');
  return { valid: errors.length === 0, errors };
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'None', color: '#9CA3AF' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 3) return { score, label: 'Fair', color: '#F59E0B' };
  if (score === 4) return { score, label: 'Good', color: '#3B82F6' };
  return { score, label: 'Strong', color: '#10B981' };
};

export const validateWeight = (value, unit) => {
  const v = parseFloat(value);
  if (isNaN(v)) return false;
  if (unit === 'kg') return v >= 30 && v <= 300;
  return v >= 66 && v <= 661; // lbs
};

export const validateHeight = (value, unit) => {
  const v = parseFloat(value);
  if (isNaN(v)) return false;
  if (unit === 'cm') return v >= 100 && v <= 250;
  return v >= 39 && v <= 98; // inches
};

export const validateAge = (age) => {
  const v = parseInt(age, 10);
  return !isNaN(v) && v >= 13 && v <= 120;
};
