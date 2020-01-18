//I mrivasperez, heavily commented this file to help others learning JS better understand the code. I understand I did not follow the correct commenting rules. This is intentional to be as helpful as possible. If you are using this JS file to learn, make note that you should not be as messy as I am with your comments :)

//I used class ui > constructor because it's preferred in ES6 and to make it easier to call methods and prebuild the UI selectors
class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  // submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value;
    //check if value is empty
    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      //return error
      this.budgetFeedback.innerHTML = `<p>value cannot be emtpy or negative</p>`;
      const self = this;
      //hide error after 3 secs
      setTimeout(function() {
        self.budgetFeedback.classList.remove("showItem");
      }, 3000);
      //else statement if value is valid
    } else {
      this.budgetAmount.textContent = value;
      //empty budget input
      this.budgetInput.value = "";
      this.showBalance();
    }
  }
  //check balance
  showBalance() {
    const expense = this.totalExpense();
    //get the budget amount and turn it to integer, subtract expense
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    //if total is less than 0 make it red
    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
      //else if total is greate than 0 make it green
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
      //but, else if else IS 0 then make it black
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }
  // submit expense
  submitExpenseForm() {
    //make the value of expense be the input of expense and the value of amount the input of it
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    //if any fields are empty or amount value is 0, show an error
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>values cannot be empty or negative</p>`;
      //help "this" be available to items of lower scope since it's not a global variable
      const self = this;
      //make timer hide after 3 seconds
      setTimeout(function() {
        self.expenseFeedback.classList.remove("showItem");
      }, 3000);
      //if it's valid, clear input and then push their values to respective variable
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      };
      //this is where we beging to build the array
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }
  // add expense
  addExpense(expense) {
    //create a new div
    const div = document.createElement("div");
    //add expense as a class to that new div
    div.classList.add("expense");
    //input the new expense and expense amount (this is where making that array came helpful)
    div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">
       <h6 class="expense-title mb-0 text-uppercase list-item">- ${
         expense.title
       }</h6>
       <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
       <!-- icons -->
      <div class="expense-icons list-item">
          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
      </div>
   `;
    this.expenseList.appendChild(div);
  }
  //calculate total expense
  totalExpense() {
    let total = 0;
    //if there are expenses do this:
    if (this.itemList.length > 0) {
      total = this.itemList.reduce(function(acc, curr) {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    //once done counting expenses do this, or if there's 0 there will basically be no output
    this.expenseAmount.textContent = total;
    return total;
  }
  // edit expense
  editExpense(element) {
    //
    let id = parseInt(element.dataset.id);

    let parent = element.parentElement.parentElement.parentElement;
    // remove from dom
    this.expenseList.removeChild(parent);
    //remove from list;
    let expense = this.itemList.filter(function(item) {
      return item.id === id;
    });

    // show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    // delete item
    let tempList = this.itemList.filter(function(expense) {
      return expense.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
  //delete expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // remove from dom
    this.expenseList.removeChild(parent);

    // delete item
    let tempList = this.itemList.filter(function(expense) {
      return expense.id !== id;
    });
    this.itemList = tempList;
    //update balance
    this.showBalance();
  }
}
//make all them event listeners!
function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //new instance of UI class
  const ui = new UI();
  //budget form submit form;
  budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();
    ui.submitBudgetForm();
  });
  expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();
    ui.submitExpenseForm();
  });
  expenseList.addEventListener("click", function() {
    if (event.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  eventListeners();
});

//Wow! We did it :)

//to view the original tutorial visit Coding Addict's YouTube channel! https://www.youtube.com/codingaddict