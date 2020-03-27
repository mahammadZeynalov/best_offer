class Deposit {
  constructor(startDeposit, monthlyAdded, time, currency, wantsToAddMonthly) {
    this.startDeposit = startDeposit;
    this.monthlyAdded = monthlyAdded;
    this.time = time;
    this.currency = currency;
    this.wantsToAddMonthly = wantsToAddMonthly;
  }
}

class BankProduct {
  constructor(bankName, investName, currency, incomeType, sumMin, sumMax, termMin, termMax, canDeposit) {
    this.bankName = bankName;
    this.investName = investName;
    this.currency = currency;
    this.incomeType = incomeType;
    this.sumMin = sumMin;
    this.sumMax = sumMax;
    this.termMin = termMin;
    this.termMax = termMax;
    this.canDeposit = canDeposit;
  }
}

class Calculator {
  constructor(bankList) {
    this.bankList = bankList;
  }

  //функция фильтра исходя из введенных

  filter(deposit) {
    let filteredBanks = this.bankList.filter(function (bank) {
      return bank.currency == deposit.currency &&
        bank.sumMin <= deposit.startDeposit &&
        bank.sumMax >= deposit.startDeposit &&
        bank.termMin <= deposit.time &&
        bank.termMax >= deposit.time &&
        !(bank.canDeposit == false && deposit.monthlyAdded > 0)
    });

    let sortByBestPercent = filteredBanks.sort(function (firstBank, secondBank) {
      return firstBank.incomeType - secondBank.incomeType;
    });

    let result = sortByBestPercent.filter(function (bank) {
      return bank.incomeType == sortByBestPercent[sortByBestPercent.length - 1].incomeType;
    });
    console.log(result);
    return result;
  }

  calculate(deposit) {
    let offers = this.filter(deposit);
    let result = [];
    if (offers.length > 0) {
      for (let i = 0; i < offers.length; i++) {
        let amount = deposit.startDeposit * (1 + offers[i].incomeType / 12 / 100);
        for (let j = 0; j < deposit.time - 1; j++) {
          amount += deposit.monthlyAdded;
          amount *= (1 + offers[i].incomeType / 12 / 100);
        }
        amount = Math.round(amount);

        let bestBank = {
          bank: offers[i].bankName,
          depositType: offers[i].investName,
          percent: offers[i].incomeType,
          amount: amount
        }
        result.push(bestBank);
      }
    } else {
      alert('Нет подходящих вариантов по вашему вкладу.')
      return;
    }
    return result;
  }
}

class Application {
  constructor() {
    this.table = document.getElementById('banks');
    this.button = document.getElementById('calculate');
    let self = this;
    this.button.addEventListener('click', function () {
      self.start();
    });
    console.log(this);
  }

  start() {
    let itself = this;
    let deposit = itself.getValues();
    if(deposit == false) {
      return;
    }
    let calculator = new Calculator(bankProductsArray);
    let toShow = calculator.calculate(deposit);
    console.log(toShow);
    itself.displayToUser(toShow);
  }

  getValues() {
    let inputDeposit = document.getElementById('start-balance').value;
    let inputMonthlyAdded = document.getElementById('period').value;
    let inputTime = document.getElementById('duration').value;
    let inputCurrency = document.getElementById('currency').value;
    let wantsToAddMonthly = false;

    if (inputDeposit > 0 &&
      inputMonthlyAdded >= 0 &&
      inputTime > 0 && inputTime % 1 == 0 &&
      (inputCurrency == 'RUB' || inputCurrency == 'USD') &&
      !isNaN(inputDeposit) &&
      !isNaN(inputMonthlyAdded) &&
      !isNaN(inputTime)) {

      if (inputMonthlyAdded > 0) {
        wantsToAddMonthly = true;
      }

      let deposit = new Deposit(+inputDeposit, +inputMonthlyAdded, +inputTime, inputCurrency, wantsToAddMonthly);
      return deposit;
    } else {
      alert('Данные введены неверно');
      return false;
    }
  }

  displayToUser(bestBanks) {
    let myTable = this.table;

    if (bestBanks.length > 0) {
      myTable.style.visibility = 'visible';

      let array = '';
      array += "<tr><th>Название банка</th><th>Вклад</th><th>Процент</th><th>Итоговая сумма</th></tr>";
      for (let bank of bestBanks) {
        array += `<tr><td>${bank.bank}</td><td>${bank.depositType}</td><td>${bank.percent}</td><td>${bank.amount}</td></tr>`;
      }
      myTable.innerHTML = array;
    } else {
      myTable.style.visibility = 'hidden';
    }
  }
}

//#region Manipulation with BankProduct
let arrayOfBanks = [
  {
    bankName: "Газпромбанк",
    investName: "Ваш успех",
    currency: "RUB",
    incomeType: 6.22,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: false,
  },
  {
    bankName: "Кредит Европа Банк",
    investName: "Оптимальный на 2 года",
    currency: "RUB",
    incomeType: 6.45,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 24,
    termMax: 24,
    canDeposit: false,
  },
  {
    bankName: "Банк Зенит",
    investName: "Праздничный 500+",
    currency: "RUB",
    incomeType: 6,
    sumMin: 30000,
    sumMax: Infinity,
    termMin: 17,
    termMax: 17,
    canDeposit: false,
  },
  {
    bankName: "Еврофинанс Моснарбанк",
    investName: "Классический",
    currency: "RUB",
    incomeType: 6.95,
    sumMin: 30000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 24,
    canDeposit: false,
  },
  {
    bankName: "Джей энд Ти Банк",
    investName: "Магнус-Онлайн",
    currency: "RUB",
    incomeType: 6.8,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 6,
    termMax: 6,
    canDeposit: false,
  },
  {
    bankName: "МТС Банк",
    investName: "В вашу пользу",
    currency: "RUB",
    incomeType: 6.75,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Эс-Би-Ай Банк",
    investName: "Свои правила Онлайн",
    currency: "RUB",
    incomeType: 6.7,
    sumMin: 30000,
    sumMax: 30000000,
    termMin: 24,
    termMax: 24,
    canDeposit: false,
  },
  {
    bankName: "Банк Уралсиб",
    investName: "Прогноз отличный",
    currency: "RUB",
    incomeType: 6.7,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 37,
    termMax: 37,
    canDeposit: false,
  },
  {
    bankName: "Инвестторгбанк",
    investName: "ИТБ-Постоянный доход",
    currency: "RUB",
    incomeType: 6.6,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 37,
    termMax: 37,
    canDeposit: false,
  },
  {
    bankName: "Транскапиталбанк",
    investName: "ТКБ.Постоянный доход",
    currency: "RUB",
    incomeType: 6.6,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 37,
    termMax: 37,
    canDeposit: false,
  },
  {
    bankName: "Совкомбанк",
    investName: "Зимний праздник с Халвой",
    currency: "RUB",
    incomeType: 5.6,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 2,
    termMax: 2,
    canDeposit: true,
  },
  {
    bankName: "Агророс",
    investName: "Медовый месяц",
    currency: "RUB",
    incomeType: 5.51,
    sumMin: 20000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 1,
    canDeposit: true,
  },
  {
    bankName: "Росдорбанк",
    investName: "Онлайн-1",
    currency: "RUB",
    incomeType: 5.1,
    sumMin: 100000,
    sumMax: 150000000,
    termMin: 1,
    termMax: 1,
    canDeposit: true,
  },
  {
    bankName: "Национальный Стандарт",
    investName: "Сберегательный стандарт",
    currency: "RUB",
    incomeType: 5.1,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Россия",
    investName: "Морозные узоры",
    currency: "RUB",
    incomeType: 5,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 1,
    canDeposit: true,
  },
  {
    bankName: "Кузнецкий Мост",
    investName: "Накопительный",
    currency: "RUB",
    incomeType: 4.85,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Тексбанк",
    investName: "Универсальный",
    currency: "RUB",
    incomeType: 4.6,
    sumMin: 10000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 1,
    canDeposit: true,
  },
  {
    bankName: "Морской Банк",
    investName: "Правильным курсом +",
    currency: "RUB",
    incomeType: 4.55,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Норвик Банк",
    investName: "Лаконичный",
    currency: "RUB",
    incomeType: 4.5,
    sumMin: 500,
    sumMax: 50000000,
    termMin: 1,
    termMax: 1,
    canDeposit: true,
  },
  {
    bankName: "Промсельхозбанк",
    investName: "Конструктор",
    currency: "RUB",
    incomeType: 4.5,
    sumMin: 10000,
    sumMax: Infinity,
    termMin: 1,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Акибанк",
    investName: "Онлайн",
    currency: "RUB",
    incomeType: 6.5,
    sumMin: 1000,
    sumMax: Infinity,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Банк БКФ",
    investName: "Ключевой стандарт",
    currency: "RUB",
    incomeType: 6.5,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 6,
    termMax: 13,
    canDeposit: true,
  },
  {
    bankName: "Экспобанк",
    investName: "Специальный (в конце срока)",
    currency: "RUB",
    incomeType: 6.35,
    sumMin: 50000,
    sumMax: 10000000,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Инвестторгбанк",
    investName: "ИТБ-Пополняемый",
    currency: "RUB",
    incomeType: 6.15,
    sumMin: 50000,
    sumMax: 30000000,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Транскапиталбанк",
    investName: "ТКБ.Пополняемый",
    currency: "RUB",
    incomeType: 6.15,
    sumMin: 50000,
    sumMax: 30000000,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Евроазиатский Инвестиционный Банк",
    investName: "Классика",
    currency: "RUB",
    incomeType: 6.1,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 6,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Тимер Банк",
    investName: "Надежный выбор",
    currency: "RUB",
    incomeType: 6,
    sumMin: 10000,
    sumMax: Infinity,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Евразийский Банк",
    investName: "TURBO MAXIMUM",
    currency: "RUB",
    incomeType: 6,
    sumMin: 30000,
    sumMax: 299999,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Таврический Банк",
    investName: "Достижимый (онлайн)",
    currency: "RUB",
    incomeType: 6,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 6,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Экспобанк",
    investName: "Юбилейный 25 (в конце срока)",
    currency: "RUB",
    incomeType: 6.5,
    sumMin: 100000,
    sumMax: 20000000,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Крокус-Банк",
    investName: "Ежемесячный доход",
    currency: "RUB",
    incomeType: 6.35,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Промсельхозбанк",
    investName: "Ваш выбор",
    currency: "RUB",
    incomeType: 6.3,
    sumMin: 10000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Нацинвестпромбанк",
    investName: "Прибыльный",
    currency: "RUB",
    incomeType: 6.3,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Ишбанк",
    investName: "Накопительный",
    currency: "RUB",
    incomeType: 6.25,
    sumMin: 100000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Примсоцбанк",
    investName: "Новогодний чулок (333 дня)",
    currency: "RUB",
    incomeType: 6.2,
    sumMin: 10000,
    sumMax: Infinity,
    termMin: 11,
    termMax: 11,
    canDeposit: true,
  },
  {
    bankName: "Еврофинанс Моснарбанк",
    investName: "Пополняемый",
    currency: "RUB",
    incomeType: 6.75,
    sumMin: 1000000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 24,
    canDeposit: true,
  },
  {
    bankName: "Евроазиатский Инвестиционный Банк",
    investName: "VIP",
    currency: "RUB",
    incomeType: 6.35,
    sumMin: 1000000,
    sumMax: Infinity,
    termMin: 9,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Российская Финансовая Корпорация",
    investName: "Универсальный",
    currency: "RUB",
    incomeType: 6,
    sumMin: 5000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Московский Кредитный Банк",
    investName: "МЕГА Онлайн",
    currency: "RUB",
    incomeType: 5.8,
    sumMin: 1000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 5,
    canDeposit: true,
  },
  {
    bankName: "Александровский",
    investName: "Черника 19/20",
    currency: "RUB",
    incomeType: 5.6,
    sumMin: 20000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Финанс Бизнес Банк",
    investName: "Мандариновый!",
    currency: "RUB",
    incomeType: 5.6,
    sumMin: 50000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "ЦентроКредит",
    investName: "Доход Плюс",
    currency: "USD",
    incomeType: 1.15,
    sumMin: 5000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Совкомбанк",
    investName: "Удобный (в долларах)",
    currency: "USD",
    incomeType: 1,
    sumMin: 500,
    sumMax: Infinity,
    termMin: 3,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Веста",
    investName: "Веста - Копилка",
    currency: "USD",
    incomeType: 1,
    sumMin: 10000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "Славия",
    investName: "Славный Капитал",
    currency: "USD",
    incomeType: 0.85,
    sumMin: 5000,
    sumMax: Infinity,
    termMin: 3,
    termMax: 4,
    canDeposit: true,
  },
  {
    bankName: "Роскосмосбанк",
    investName: "Комфортный",
    currency: "USD",
    incomeType: 0.8,
    sumMin: 500,
    sumMax: Infinity,
    termMin: 3,
    termMax: 6,
    canDeposit: true,
  },
  {
    bankName: "ФорБанк",
    investName: "Срочный накопительный",
    currency: "USD",
    incomeType: 0.8,
    sumMin: 10000,
    sumMax: 500000,
    termMin: 3,
    termMax: 3,
    canDeposit: true,
  },
  {
    bankName: "Московский Областной Банк",
    investName: "Гарантированный доллар",
    currency: "USD",
    incomeType: 0.75,
    sumMin: 50,
    sumMax: Infinity,
    termMin: 4,
    termMax: 4,
    canDeposit: true,
  },
  {
    bankName: "Объединенный Резервный Банк",
    investName: "ОРБ-Накопительный (в конце срока)",
    currency: "USD",
    incomeType: 1.6,
    sumMin: 1000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Банк Агора",
    investName: "Срочный",
    currency: "USD",
    incomeType: 1.5,
    sumMin: 1000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Тинькофф Банк",
    investName: "СмартВклад (с повышенной ставкой)",
    currency: "USD",
    incomeType: 1.5,
    sumMin: 1000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Первый Инвестиционный Банк",
    investName: "Закон сохранения",
    currency: "USD",
    incomeType: 1.5,
    sumMin: 1000,
    sumMax: Infinity,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
  {
    bankName: "Новый Век",
    investName: "Сберегательный",
    currency: "USD",
    incomeType: 1.5,
    sumMin: 5000,
    sumMax: 20000,
    termMin: 12,
    termMax: 12,
    canDeposit: true,
  },
];
function pushArray(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let newBank = new BankProduct(
      array[i].bankName,
      array[i].investName,
      array[i].currency,
      array[i].incomeType,
      array[i].sumMin,
      array[i].sumMax,
      array[i].termMin,
      array[i].termMax,
      array[i].canDeposit);
    result.push(newBank);
  };
  return result;
}
let bankProductsArray = pushArray(arrayOfBanks);
//#endregion


let application = new Application();