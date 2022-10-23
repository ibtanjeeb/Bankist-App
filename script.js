'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-08-20T17:01:17.194Z',
    '2022-07-22T23:36:17.929Z',
    '2022-08-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const FormatDate = function (date, locale) {
  const calPassedday = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const PassedDays = calPassedday(new Date(), date);
  if (PassedDays === 0) return 'Today';
  if (PassedDays === 1) return 'Yesterday';
  if (PassedDays <= 7) return `${PassedDays} days ago`;

  console.log(PassedDays);

  labelDate.textContent = new Intl.DateTimeFormat(locale).format(date);
  return labelDate.textContent;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const years = date.getFullYear();

  // return `${day}/${month}/${years}`;
};
const MoveFormating = function (acc, mov) {
  const Formmated = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(mov);
  return Formmated;
};

const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //.textContent=0
  const Sorted = acc.movements.slice().sort((a, b) => a - b);
  const movs = sort ? Sorted : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = FormatDate(date, acc.locale);
    // const Formmated = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);
    const html = `<div class="movements__row">
   
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${MoveFormating(acc, mov)}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovement(account1.movements);

const displayMovementBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${MoveFormating(acc, acc.balance)}`;
};
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${MoveFormating(acc, incomes)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${MoveFormating(acc, Math.abs(out))}`;
  const Interest = acc.movements
    .filter(mov => mov > 0)

    .map(dep => dep * (acc.interestRate / 100))
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${MoveFormating(acc, Interest)}`;
};
// calcDisplaySummery(account1.movements, account1.interestRate);
// displayMovementBalance(account1.movements);
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUserName(accounts);
const updateUI = function (acc) {
  //Display Movement
  displayMovement(acc);
  //Display Balance
  displayMovementBalance(acc);

  // Display Summery
  calcDisplaySummery(acc);
};
const StartLogout = function () {
  const tick = function () {
    //Call back the seconds
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    //when time 0 UI Logout
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent =
        'Time Out your logging Account,Please Login Again!';
    }
    time--;
    
  };
  //Set time in 5min

  let time = 300;
  tick();

  const timer = setInterval(tick, 1000);
  return timer;

  //In each call print the timer In UI
};
// Even handler use
let CurrentAccount, timer;

//Fake a Loggin
// CurrentAccount = account1;

// updateUI(CurrentAccount);
// containerApp.style.opacity = 100;

// labelDate.textContent = now;
btnLogin.addEventListener('click', function (e) {
  //prevent from submitting
  e.preventDefault();
  CurrentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  //console.log(CurrentAccount);
  if (CurrentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI And welcome message
    labelWelcome.textContent = `Welcome back, ${
      CurrentAccount.owner.split(' ')[0]
    }`;
    //Create Date Time Using IntlDatetimeformat
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      CurrentAccount.locale,
      options
    ).format(now);
    //Create Date Time
    // // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const years = now.getFullYear();
    // //need to add padstart///
    // const hour = now.getHours();
    // const minutes = now.getMinutes();
    if (timer) clearInterval(timer);
    timer = StartLogout();

    // labelDate.textContent = `Date:${day}/${month}/${years},Time: ${hour}:${minutes}`;
    inputLoginUsername.value = inputLoginPin.value = '';
    //clear input field
    inputLoginPin.blur();
    updateUI(CurrentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receivedAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  // console.log(amount, receivedAcc);
  if (
    amount > 0 &&
    receivedAcc &&
    CurrentAccount.balance >= amount &&
    receivedAcc?.userName !== CurrentAccount.userName
  ) {
    setTimeout(function () {
      CurrentAccount.movements.push(-amount);
      receivedAcc.movements.push(amount);
      CurrentAccount.movementsDates.push(new Date().toISOString());
      receivedAcc.movementsDates.push(new Date().toISOString());

      updateUI(CurrentAccount);
      clearInterval(timer);
      timer = StartLogout();
    }, 2500);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // const UserName = accounts.find(
  //   acc => acc.userName === inputCloseUsername.value
  // );
  //const userPin = Number(inputClosePin.value);
  //console.log(UserName, userPin);
  if (
    inputCloseUsername.value === CurrentAccount.userName &&
    Number(inputClosePin.value) === CurrentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === CurrentAccount.userName
    );
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && CurrentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      CurrentAccount.movements.push(amount);
      CurrentAccount.movementsDates.push(new Date().toISOString());

      updateUI(CurrentAccount);
      //Reset Timer
      clearInterval(timer);
      timer = StartLogout();
    }, 2500);
  }

  //console.log(CurrentAccount);
  inputLoanAmount.value = '';
});
let Sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovement(CurrentAccount.movements, !Sorted);
  Sorted = !Sorted;
});
