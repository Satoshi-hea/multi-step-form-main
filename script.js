// Текущий активный шаг (от 1 до 4)
let currentStep = 1;

// DOM Элементы навигации и шагов
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

// Сообщения об ошибках первого шага
const errorName = document.getElementById('error-name');
const errorEmail = document.getElementById('error-email');
const errorPhone = document.getElementById('error-phone');

// ==================== ВАЛИДАЦИЯ ШАГА 1 ====================

function validateStep1() {
  let isValid = true;
  clearErrors();

  if (nameInput.value.trim() === '') {
    showError(nameInput, errorName, 'This field is required');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === '') {
    showError(emailInput, errorEmail, 'This field is required');
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    showError(emailInput, errorEmail, 'Invalid email format');
    isValid = false;
  }

  if (phoneInput.value.trim() === '') {
    showError(phoneInput, errorPhone, 'This field is required');
    isValid = false;
  }

  return isValid;
}

function showError(inputElement, errorElement, message) {
  inputElement.parentElement.classList.add('has-error');
  errorElement.textContent = message;
}

function clearErrors() {
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach(group => group.classList.remove('has-error'));
  errorName.textContent = '';
  errorEmail.textContent = '';
  errorPhone.textContent = '';
}

// ==================== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА (UI) ====================

function updateUI() {
  formSteps.forEach(step => {
    step.classList.remove('active');
    if (step.id === `step-${currentStep}`) {
      step.classList.add('active');
    }
  });

  stepIndicators.forEach(indicator => {
    const stepNum = parseInt(indicator.getAttribute('data-step'), 10);
    if (stepNum === currentStep) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });

  if (currentStep === 1) {
    btnBack.classList.add('hidden');
  } else {
    btnBack.classList.remove('hidden');
  }

  if (currentStep === 4) {
    btnNext.textContent = 'Confirm';
    btnNext.classList.add('btn-confirm');
  } else {
    btnNext.textContent = 'Next Step';
    btnNext.classList.remove('btn-confirm');
  }
}

// ==================== КНОПКИ НАВИГАЦИИ ====================

btnNext.addEventListener('click', () => {
  if (currentStep === 1) {
    const isStep1Valid = validateStep1();
    if (!isStep1Valid) return;
  }

  if (currentStep < 4) {
    currentStep++;
    if (currentStep === 4) {
      renderSummary();
    }
    updateUI();
  } else if (currentStep === 4) {
    formSteps.forEach(step => step.classList.remove('active'));
    navigationBar.classList.add('hidden');
    thankYouScreen.classList.remove('hidden');
  }
});

btnBack.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    updateUI();
  }
});

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

planCards.forEach(card => {
  card.addEventListener('click', () => {
    planCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

billingToggle.addEventListener('change', () => {
  const isYearly = billingToggle.checked;

  if (isYearly) {
    yearlyLabel.classList.add('active');
    monthlyLabel.classList.remove('active');
  } else {
    monthlyLabel.classList.add('active');
    yearlyLabel.classList.remove('active');
  }

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

// ==================== ШАГ 3: ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ ====================

const addonCards = document.querySelectorAll('.addon-card');

addonCards.forEach(card => {
  const checkbox = card.querySelector('.addon-checkbox');

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

// ==================== ШАГ 4: СВОДКА И РАСЧЕТ ИТОГО ====================

const pricingData = {
  plans: {
    arcade: { name: 'Arcade', monthly: 9, yearly: 90 },
    advanced: { name: 'Advanced', monthly: 12, yearly: 120 },
    pro: { name: 'Pro', monthly: 15, yearly: 150 }
  },
  addons: {
    'addon-online': { name: 'Online service', monthly: 1, yearly: 10 },
    'addon-storage': { name: 'Larger storage', monthly: 2, yearly: 20 },
    'addon-profile': { name: 'Customizable profile', monthly: 2, yearly: 20 }
  }
};

function renderSummary() {
  const isYearly = billingToggle.checked;
  const periodSuffix = isYearly ? '/yr' : '/mo';
  const periodText = isYearly ? 'Yearly' : 'Monthly';

  const selectedPlanInput = document.querySelector('input[name="plan"]:checked');
  const planKey = selectedPlanInput ? selectedPlanInput.value : 'arcade';
  const planInfo = pricingData.plans[planKey];
  const planPrice = isYearly ? planInfo.yearly : planInfo.monthly;

  const summaryPlanName = document.getElementById('summary-plan-name');
  const summaryPlanPrice = document.getElementById('summary-plan-price');
  summaryPlanName.textContent = `${planInfo.name} (${periodText})`;
  summaryPlanPrice.textContent = `$${planPrice}${periodSuffix}`;

  const summaryAddonsList = document.getElementById('summary-addons-list');
  summaryAddonsList.innerHTML = '';
  let addonsTotal = 0;

  addonCards.forEach(card => {
    const checkbox = card.querySelector('.addon-checkbox');
    if (checkbox && checkbox.checked) {
      const addonId = checkbox.id;
      const addonInfo = pricingData.addons[addonId];
      if (addonInfo) {
        const addonPrice = isYearly ? addonInfo.yearly : addonInfo.monthly;
        addonsTotal += addonPrice;

        const row = document.createElement('div');
        row.className = 'summary-addon-row';
        row.innerHTML = `
          <span class="addon-name-summary">${addonInfo.name}</span>
          <span class="addon-price-summary">+$${addonPrice}${periodSuffix}</span>
        `;
        summaryAddonsList.appendChild(row);
      }
    }
  });

  const grandTotal = planPrice + addonsTotal;
  const totalLabel = document.getElementById('summary-total-label');
  const totalPrice = document.getElementById('summary-total-price');

  totalLabel.textContent = isYearly ? 'Total (per year)' : 'Total (per month)';
  totalPrice.textContent = `$${grandTotal}${periodSuffix}`;
}