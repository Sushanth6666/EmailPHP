let currentUser = '';
let users = {
  'ramu': { password: '1234', phone: '1234567890', balance: 1000 },
  'raju': { password: '7890', phone: '9876543210', balance: 1000 }
};
let transactions = [];

function login() {
  const username = $('#username').val();
  const password = $('#password').val();

  if (users[username] && users[username].password === password) {
    currentUser = username;
    $('#loginForm').hide();
    $('#userPanel').show();
    $('#userWelcome').text(currentUser);
    updateBalance();
    loadTransactionHistory();
  } else {
    $('#loginMessage').text('Invalid username or password').addClass('error');
  }
}

function adminLogin() {
  const username = $('#username').val();
  const password = $('#password').val();

  if (username === 'admin' && password === 'admin') {
    $('#loginForm').hide();
    $('#adminPanel').show();
    loadUserList();
    loadAdminTransactionHistory();
  } else {
    $('#loginMessage').text('Invalid admin credentials').addClass('error');
  }
}

function logout() {
  currentUser = '';
  $('#loginForm').show();
  $('#userPanel').hide();
  $('#adminPanel').hide();
  $('#username').val('');
  $('#password').val('');
  $('#loginMessage').text('').removeClass('error');
}

function updateBalance() {
  $('#userBalance').text(users[currentUser].balance.toFixed(2));
}

function transfer() {
  const recipient = $('#recipient').val();
  const recipientPhone = $('#recipientPhone').val();
  const amount = parseFloat($('#amount').val());

  if (!users[recipient]) {
    $('#transferMessage').text('Recipient not found').addClass('error');
    return;
  }

  if (users[recipient].phone !== recipientPhone) {
    $('#transferMessage').text('Incorrect recipient phone number').addClass('error');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    $('#transferMessage').text('Invalid amount').addClass('error');
    return;
  }

  if (users[currentUser].balance < amount) {
    $('#transferMessage').text('Insufficient balance').addClass('error');
    return;
  }

  users[currentUser].balance -= amount;
  users[recipient].balance += amount;
  const transaction = {
    dateTime: new Date().toLocaleString(),
    type: 'Transfer',
    amount: amount.toFixed(2),
    from: currentUser,
    to: recipient,
    phoneNumber: recipientPhone,
    status: 'Success'
  };
  transactions.push(transaction);
  $('#transferMessage').text('Transfer successful').removeClass('error').addClass('success');
  updateBalance();
  loadTransactionHistory();
}

function loadTransactionHistory() {
  $('#transactionBody').empty();
  transactions.forEach(transaction => {
    $('#transactionBody').append(
      `<tr>
        <td>${transaction.dateTime}</td>
        <td>${transaction.type}</td>
        <td>₹${transaction.amount}</td>
        <td>${transaction.from} to ${transaction.to}</td>
        <td>${transaction.phoneNumber}</td>
        <td>${transaction.status}</td>
      </tr>`
    );
  });
}

function loadUserList() {
  $('#userListBody').empty();
  for (const [username, user] of Object.entries(users)) {
    $('#userListBody').append(
      `<tr>
        <td>${username}</td>
        <td>${user.phone}</td>
        <td>₹${user.balance}</td>
      </tr>`
    );
  }
}

function addUser() {
  const username = $('#newUsername').val();
  const password = $('#newPassword').val();
  const phone = $('#newPhone').val();
  const balance = parseFloat($('#initialBalance').val());

  if (users[username]) {
    alert('Username already exists');
    return;
  }

  users[username] = { password, phone, balance };
  alert('User added successfully');
  loadUserList();
}

function deleteUser() {
  const username = $('#deleteUsername').val();

  if (!users[username]) {
    alert('User not found');
    return;
  }

  delete users[username];
  alert('User deleted successfully');
  loadUserList();
  loadTransactionHistory(); // Refresh transaction history if needed
}

function loadAdminTransactionHistory() {
  $('#adminTransactionBody').empty();
  transactions.forEach(transaction => {
    $('#adminTransactionBody').append(
      `<tr>
        <td>${transaction.dateTime}</td>
        <td>${transaction.from}</td>
        <td>${transaction.to}</td>
        <td>₹${transaction.amount}</td>
        <td>${transaction.status}</td>
      </tr>`
    );
  });
}
