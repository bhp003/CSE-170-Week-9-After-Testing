var ref = firebase.firestore().collection("History");

function autocomplete(inp, arr) {
  var currentFocus;
  var currItem;
  
  inp.addEventListener("input", function(e) {
    var a, b, val = this.value;
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    
    this.parentNode.appendChild(a);
    for (var i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
          var path = (inp.value + ".html").replace(/\s/g, "");
          ref.doc(inp.value).set({id: inp.value}).then(() => {
            window.location.href = "Project/../html/" + inp.value + "/" + path;
          });
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } 
    else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } 
    else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1)
        if (x) x[currentFocus].click();
    }
  });
  
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  
  function removeActive(x) {
    for (var i = 0; i < x.length; i++)
      x[i].classList.remove("autocomplete-active");
  }
  
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp)
        x[i].parentNode.removeChild(x[i]);
    }
  }
  document.getElementById("input").addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function getAllClass() {
  var courses = new Array();
  var ref = firebase.firestore().collection("Courses");
  ref.get().then((list) => {
    list.forEach((doc) => {
      courses.push(doc.id);
    });
  });
  autocomplete(document.getElementById("input"), courses);
}
function getHistory() {
  var section = document.getElementById("hist");
  ref.get().then((list) => {          
    list.forEach((item) => {
      var btn = document.createElement("BUTTON");
      btn.appendChild(document.createTextNode(item.id));
      section.appendChild(btn);
      
      btn.addEventListener("click", () => {
        var path = (item.id + ".html").replace(/\s/g, "");
        window.location.href = "Project/../html/" + item.id + "/" + path;
      });
    });
  });
}

getAllClass();
getHistory();