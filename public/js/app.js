document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("transactionForm");
  var typeSelect = document.getElementById("transactionType");
  if (form && typeSelect) {
    typeSelect.addEventListener("change", function () {
      form.action = typeSelect.value === "withdraw"
        ? "/transactions/withdraw"
        : "/transactions/deposit";
    });
  }

  if (document.getElementById("editCustomerModal")) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById("editCustomerModal")).show();
  }

  if (document.body.getAttribute("data-open-add") === "customer") {
    var addModal = document.getElementById("addCustomerModal");
    if (addModal) bootstrap.Modal.getOrCreateInstance(addModal).show();
  }

  if (document.body.getAttribute("data-open-add") === "account") {
    var addAccount = document.getElementById("addAccountModal");
    if (addAccount) bootstrap.Modal.getOrCreateInstance(addAccount).show();
  }

  if (document.body.getAttribute("data-open-add") === "loan") {
    var addLoan = document.getElementById("addLoanModal");
    if (addLoan) bootstrap.Modal.getOrCreateInstance(addLoan).show();
  }
});
