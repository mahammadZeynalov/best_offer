class Calculator {
    constructor(bankList) {
      this.bankList = bankList;
    }
  
    //функция фильтра исходя из введенных
  
    filter(deposit) {
      this.bankList = this.bankList.filter(function (bank) {
        return bank.currency == deposit.currency &&
          bank.sumMin <= deposit.startDeposit &&
          bank.sumMax >= deposit.startDeposit &&
          bank.termMin <= deposit.time &&
          bank.termMax >= deposit.time &&
          !(bank.canDeposit == false && deposit.monthlyAdded > 0)
      });
  
      this.bankList = this.bankList.sort(function (firstBank, secondBank) {
        return firstBank.incomeType - secondBank.incomeType;
      });
  
      this.bankList = this.bankList.filter(function (bank) {
        return bank.incomeType == this.bankList[this.bankList.length - 1].incomeType;
      });
      return this;
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
        Application.table.style.visibility = 'hidden';
        setTimeout(function() { alert('Нет подходящих вариантов по вашему вкладу.') }, 1);
        return;
      }
      return result;
    }
  }