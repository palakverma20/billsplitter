let n;
let obj={};
document.querySelector("#first").addEventListener("click", () => {
  document.querySelector(".hide1").style.display = "none";
  document.querySelector(".hide2").style.display = "block";
  document.querySelector(".nav").style.display="none";
});
function storeValue() {
  const inputElement = document.getElementById("people");
  n = parseInt(inputElement.value, 10) || 0; // parse base 10 and default 0
//   console.log("Input value stored:", n);
}
let people = []; // changed from obj -> array of {name, amount}
function clearInput() {
  let inputElement1 = document.getElementById("name");
  let inputElement2 = document.getElementById("amount");
  inputElement1.value = "";
  inputElement2.value = "";
}
function storeValue2() {
  const inputElement1 = document.getElementById("name");
  const inputElement2 = document.getElementById("amount");
  const name = inputElement1.value.trim();
  const amountStr = inputElement2.value.trim();
  obj[name]=parseInt(amountStr);

  if (!name) {
    alert("Please enter a name");
    inputElement1.focus();
    return false;
  }
  if (!/^-?\d+(\.\d+)?$/.test(amountStr)) { // allow integers or decimals
    alert("Please enter a valid number");
    inputElement2.focus();
    return false;
  }

  // push into array to preserve all entries (allow same name multiple times if needed)
  people.push({ name, amount: Number(amountStr) });
  clearInput();
  return true;
}

function formatAmt(a) {
  // format to 2 decimals but drop trailing .00 when integer
  const v = Number(a.toFixed(2));
  return v % 1 === 0 ? v.toString() : v.toFixed(2);
}

async function check() {
  await storeValue();
  let i = 0;
  const secondBtn = document.querySelector("#second");
  if (secondBtn) {
    secondBtn.addEventListener("click", () => {
      if (!n) storeValue();
      if (!n || n <= 0) return;

      const saved = storeValue2(); // validates & stores
      if (!saved) return; // don't count invalid entries
      i += 1;

      if (i >= n) {
        document.querySelector(".hide2").style.display = "none";
        document.querySelector(".hide3").style.display = "flex";

        // compute total and average
        const total = people.reduce((s, p) => s + p.amount, 0);
        const avg = total / people.length;

        // compute balances (positive => should receive, negative => owes)
        const balances = people.map(p => ({ name: p.name, bal: Number((p.amount - avg).toFixed(2)) }));

        // build creditors and debtors
        const creditors = balances.filter(b => b.bal > 0).map(b => ({ ...b }));
        const debtors = balances.filter(b => b.bal < 0).map(b => ({ ...b }));

        // sort creditors descending by bal, debtors ascending (most negative first)
        creditors.sort((a, b) => b.bal - a.bal);
        debtors.sort((a, b) => a.bal - b.bal);

        const transfers = [];
        let ci = 0, di = 0;
        while (ci < creditors.length && di < debtors.length) {
          const credit = creditors[ci];
          const debt = debtors[di];
          const amount = Math.min(credit.bal, Math.abs(debt.bal));
          // debtor pays creditor
          transfers.push({ from: debt.name, to: credit.name, amount: Number(amount.toFixed(2)) });

          // adjust
          credit.bal = Number((credit.bal - amount).toFixed(2));
          debt.bal = Number((debt.bal + amount).toFixed(2)); // note debt.bal is negative

          if (Math.abs(credit.bal) < 0.005) ci++;
          if (Math.abs(debt.bal) < 0.005) di++;
        }

        // show results
        const hello = document.querySelector(".hello");
        const totalHtml = `<p>Total amount: ${formatAmt(total)}</p>`;
        if (transfers.length === 0) {
          hello.innerHTML = `${totalHtml}<p>All settled. No transfers needed.</p>`;
        } else {
          hello.innerHTML = `${totalHtml}` + transfers.map(t => `<p>${t.from} will pay ${formatAmt(t.amount)} to ${t.to}</p>`).join("");
        }
      }
    });
  }
}
check();
document.querySelector("#third").addEventListener("click", () => {
  document.querySelector(".hide3").style.display = "none";
  document.querySelector(".hide1").style.display = "block";
  document.querySelector(".nav").style.display="flex";
  // reset state
  people = [];
  n = 0;
  document.getElementById("people").value = "";
  document.querySelector(".hello").innerHTML = "";
})

document.querySelector("#about").addEventListener("click",()=>{
  document.querySelector(".hide1").style.display="none";
  document.querySelector(".hide2").style.display="none";
  document.querySelector(".hide3").style.display="none";
  document.querySelector(".help").style.display="none";
  document.querySelector(".about").style.display="block";
})
document.querySelector("#home").addEventListener("click",()=>{
  document.querySelector(".hide2").style.display="none";
  document.querySelector(".hide3").style.display="none";
  document.querySelector(".help").style.display="none";
  document.querySelector(".about").style.display="none";
  document.querySelector(".hide1").style.display="block";
})
document.querySelector("#help").addEventListener("click",()=>{
  document.querySelector(".hide1").style.display="none";
  document.querySelector(".hide2").style.display="none";
  document.querySelector(".hide3").style.display="none";
  document.querySelector(".about").style.display="none";
  document.querySelector(".help").style.display="block";
})

// const SHEET_ID = "1NgbFhu2u7YWm0MTwNt_H_y_3xkJRe2y-A_Ujx2cbS4Q";
// const API_KEY = "AIzaSyAOphwM2YQnf4A1RNlxKN2UiCJV7AFXZV0";

// fetch("https://script.google.com/macros/s/AKfycbwuePqAH8bT_iTYMVrW4VMvL_0sYUQn1nV2hIy6-6mzm6l_eFJn9gokJq2pPK4aZn82sw/exec",{
//   method:"POST",
//   body: JSON.stringify(obj)
// }).then(res=>res.text()).then(result=>console.log("Sheet updated:",result)).catch(err=>{
//   console.error("Error:",err)
// })