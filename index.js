const axios = require("axios");

let form = document.querySelector("#mainForm"),
  formInput = form.querySelector('input[type="number"]');

form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  let id = formInput.value;

  if (id !== "") {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (document.querySelector("table")) {
          document.querySelector("table").remove();
        }
        return makeTable(data, true);
      })
      .then(_ => {
        document
          .querySelectorAll(".viewComment")
          .forEach(el => el.addEventListener("click", getComments));
      });
  }
}

////////////  2 davaleba ////////////
function getComments(e) {
  let btn = e.target,
    id = btn.getAttribute("data-id"),
    tr = btn.parentNode.parentNode;
  isActive(tr);

  if (id) {
    axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)
      .then(res => {
        if (document.querySelectorAll("table")[1]) {
          document.querySelectorAll("table")[1].remove();
        }
        return makeTable(res.data);
      });
  }
}

function isActive(currElem) {
  document.querySelectorAll("tr").forEach(elems => {
    return elems === currElem
      ? currElem.classList.add("active")
      : elems.classList.remove("active");
  });
}

function makeTable(arr, hasBtn) {
  if (Array.isArray(arr) && arr.length !== 0) {
    let table = document.createElement("table"),
      trHead = document.createElement("tr");
    thTitle = Object.keys(arr[0]).filter(
      el => el !== "id" && !el.endsWith("Id")
    );

    if (hasBtn) thTitle.push("Actions");

    // Table header
    thTitle.forEach(title => {
      trHead.innerHTML += `<th>${title}</th>`;
      table.append(trHead);
    });
    // Table Body
    arr.forEach(el => {
      let _tr = document.createElement("tr");
      table.append(_tr);

      for (let k in el) {
        if (thTitle.includes(k)) {
          _tr.innerHTML += `<td>${el[k]}</td>`;
        }
      }

      if (hasBtn)
        _tr.innerHTML += `<td><button class="viewComment" data-id="${
          el.id
        }">კომენტარების ნახვა
</button></td>`;
    });

    return document.body.appendChild(table);
  }
}