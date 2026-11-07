// Текущий активный шаг (от 1 до 4)
let currentStep = 1;

// DOM Элементы
const formSteps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step-indicator');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const navigationBar = document.querySelector('.form-navigation');
const thankYouScreen = document.getElementById('thank-you-step');

// Поля ввода первого шага
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const phoneInput = document.getElementById('user-phone');

// Сообщения об ошибках
const errorName = document.getElementById('error-name');
const errorEmail = document.getElementById('error-email');
const errorPhone = document.getElementById('error-phone');

// Функция валидации полей первого шага
function validateStep1() {
  let isValid = true;

  // Очистка предыдущих ошибок
  clearErrors();

  // Валидация имени
  if (nameInput.value.trim() === '') {
    showError(nameInput, errorName, 'This field is required');
    isValid = false;
  }

  // Валидация Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === '') {
    showError(emailInput, errorEmail, 'This field is required');
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    showError(emailInput, errorEmail, 'Invalid email format');
    isValid = false;
  }

  // Валидация телефона
  if (phoneInput.value.trim() === '') {
    showError(phoneInput, errorPhone, 'This field is required');
    isValid = false;
  }

  return isValid;
}

// Отображение ошибки для поля
function showError(inputElement, errorElement, message) {
  inputElement.parentElement.classList.add('has-error');
  errorElement.textContent = message;
}

// Сброс всех ошибок
function clearErrors() {
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach(group => group.classList.remove('has-error'));
  errorName.textContent = '';
  errorEmail.textContent = '';
  errorPhone.textContent = '';
}

// Переключение отображаемого шага в UI
function updateUI() {
  // 1. Показываем нужный fieldset формы
  formSteps.forEach(step => {
    step.classList.remove('active');
    if (step.id === `step-${currentStep}`) {
      step.classList.add('active');
    }
  });

  // 2. Обновляем кружки в боковом сайдбаре
  stepIndicators.forEach(indicator => {
    const stepNum = parseInt(indicator.getAttribute('data-step'), 10);
    if (stepNum === currentStep) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });

  // 3. Управляем кнопкой Go Back (скрыта только на шаге 1)
  if (currentStep === 1) {
    btnBack.classList.add('hidden');
  } else {
    btnBack.classList.remove('hidden');
  }

  // 4. Управляем кнопкой Next Step / Confirm
  if (currentStep === 4) {
    btnNext.textContent = 'Confirm';
    btnNext.classList.add('btn-confirm');
  } else {
    btnNext.textContent = 'Next Step';
    btnNext.classList.remove('btn-confirm');
  }
}

// Обработчик клика по кнопке Next Step / Confirm
btnNext.addEventListener('click', () => {
  // Если мы на первом шаге — проверяем поля
  if (currentStep === 1) {
    const isStep1Valid = validateStep1();
    if (!isStep1Valid) return; // Не пускаем дальше, если есть ошибки
  }

  if (currentStep < 4) {
    currentStep++;
    updateUI();
  } else if (currentStep === 4) {
    // Пользователь нажал Confirm на шаге 4 -> Показываем экран Thank You
    formSteps.forEach(step => step.classList.remove('active'));
    navigationBar.classList.add('hidden');
    thankYouScreen.classList.remove('hidden');
  }
});

// Обработчик клика по кнопке Go Back
btnBack.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    updateUI();
  }
});

// Обработчик для ссылки "Change" на шаге 4 (возврат к выбору тарифа)
const btnChangePlan = document.getElementById('btn-change-plan');
if (btnChangePlan) {
  btnChangePlan.addEventListener('click', () => {
    currentStep = 2;
    updateUI();
  });
}