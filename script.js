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

// ==================== ШАГ 2: ВЫБОР ТАРИФА И ПЕРИОДА ====================

const planCards = document.querySelectorAll('.plan-card');
const billingToggle = document.getElementById('billing-checkbox');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');

// Выбор карточки тарифа при клике
planCards.forEach(card => {
  card.addEventListener('click', () => {
    planCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

// Переключение периода оплаты (Monthly / Yearly)
billingToggle.addEventListener('change', () => {
  const isYearly = billingToggle.checked;

  if (isYearly) {
    yearlyLabel.classList.add('active');
    monthlyLabel.classList.remove('active');
  } else {
    monthlyLabel.classList.add('active');
    yearlyLabel.classList.remove('active');
  }

  // Обновляем цены на карточках тарифов и надпись "2 months free"
  planCards.forEach(card => {
    const priceEl = card.querySelector('.plan-price');
    const bonusEl = card.querySelector('.plan-bonus');

    if (isYearly) {
      priceEl.textContent = priceEl.getAttribute('data-yearly');
      bonusEl.classList.remove('hidden');
    } else {
      priceEl.textContent = priceEl.getAttribute('data-monthly');
      bonusEl.classList.add('hidden');
    }
  });

  // Обновляем ценники аддонов на шаге 3
  const addonCards = document.querySelectorAll('.addon-card');
  addonCards.forEach(card => {
    const addonPriceEl = card.querySelector('.addon-price');
    if (isYearly) {
      addonPriceEl.textContent = addonPriceEl.getAttribute('data-yearly');
    } else {
      addonPriceEl.textContent = addonPriceEl.getAttribute('data-monthly');
    }
  });
});

// ==================== ШАГ 3: ВЫБОР ДОПОЛНИТЕЛЬНЫХ УСЛУГ ====================

const addonCards = document.querySelectorAll('.addon-card');

addonCards.forEach(card => {
  const checkbox = card.querySelector('.addon-checkbox');

  // Клик по всей карточке переключает чекбокс и подсветку
  card.addEventListener('click', (e) => {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }

    if (checkbox.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
});