var size = 0;
var aid = 0;

function makePage(id, name) {
  var ref = firebase.firestore().collection("Courses/" + name + "/Questions");
  getQuestion(id, ref);
  getAnswer(id, ref);
  console.log("Courses/" + name + "/Questions");
}

function getQuestion(id, ref) {
  ref.doc("Question " + id).get().then((result) => {
    displayQuestion(result);
  });
}

function getAnswer(id, ref) {
  var ansSection = document.getElementById("answers");
  var header = document.createElement("H2");
  header.setAttribute("align", "center");
  header.setAttribute("style", "font-size: 16pt;");
  ansSection.appendChild(header.appendChild(document.createTextNode("Answers:")));

  ref.doc("Question " + id).collection("Answers").get().then((list) => {
    list.forEach((ans) => {
      aid++;
      displayAnswer(ans, ansSection, id, aid);
    });
    size = list.size + 1;
    postAnswer(id, ref);
  });
}

function displayQuestion(data) {
  var title = document.getElementById("title");
  title.innerHTML = data.get("question");
  title.setAttribute("style", "color:red;");
}

function displayAnswer(data, section, id, aid, ref) {
  var ansbox = document.createElement("DIV");
  ansbox.setAttribute("id", "answer");
  var ans = document.createElement("P");
  
  var iconbtn = document.createElement("BUTTON");
  var icon = document.createElement("I");
  icon.setAttribute("class", "material-icons");
  icon.setAttribute("id", "icon");
  icon.appendChild(document.createTextNode("border_color"));
  
  iconbtn.setAttribute("style", "width: 30px;\nheight: 30px;");
  iconbtn.setAttribute("align", "center");
  iconbtn.appendChild(icon);
  
  ans.appendChild(document.createTextNode(data.get("value")));
  ansbox.appendChild(ans);
  ansbox.appendChild(iconbtn);
  section.appendChild(ansbox);
  
  iconbtn.addEventListener("click", () => {
    ansbox.removeChild(iconbtn);
    ansbox.removeChild(ans);
    
    var myAns = document.createElement("INPUT");
    myAns.setAttribute("type", "text");
    myAns.setAttribute("value", ans.innerHTML);
    myAns.setAttribute("id", "myans");
        
    var divSubmit = document.createElement("DIV");
    var submitBtn = document.createElement("BUTTON");
    submitBtn.setAttribute("type", "submit");
    submitBtn.appendChild(document.createTextNode("Submit"));
    submitBtn.setAttribute("style", "height: 28px;\n margin-left: 10px;");
    
    ansbox.appendChild(myAns);
    ansbox.appendChild(submitBtn);
    
    submitBtn.addEventListener("click", () => {
      var newAns = ref.doc("Question " + id).collection("Answers").doc("Answer " + aid);
      newAns.set({value: myAns.value, id: aid});
      ans.innerHTML = myAns.value;
      
      ansbox.removeChild(submitBtn);
      ansbox.removeChild(myAns);
      ansbox.appendChild(ans);
      ansbox.appendChild(iconbtn);
    });
  });
}

function postAnswer(id, ref) {
  var ansSection = document.getElementById("answers"); 
  var divSubmit = document.createElement("DIV");
  
  var myAns = document.createElement("INPUT");
  myAns.setAttribute("type", "text");
  myAns.setAttribute("id", "myans");
  myAns.setAttribute("placeholder", "Answer this question!");
  
  var submitBtn = document.createElement("BUTTON");
  submitBtn.setAttribute("style", "height: 28px;\nmargin-left: 10px;");
  submitBtn.setAttribute("type", "submit");
  submitBtn.appendChild(document.createTextNode("Submit"));
  
  submitBtn.addEventListener("click", () => {
    console.log("yo");
    var newAns = ref.doc("Question " + id).collection("Answers").doc("Answer " + size);
    newAns.set({value: myAns.value, id: size}).then(() => {
      window.location.reload(true);
    });
  });
  
  var statusBtn = document.createElement("BUTTON");
  statusBtn.setAttribute("style", "height: 28px;\nfloat: right;\n");
  statusBtn.appendChild(document.createTextNode("Resolved"));
  
  statusBtn.addEventListener("click", () => {
    ref.doc("Question " + id).set({solved: true}).then(() => {
      var title = document.getElementById("title");
      title.setAttribute("style", "color:#4CAF50;");
    });
  });
  
  divSubmit.appendChild(myAns);
  divSubmit.appendChild(submitBtn);
  divSubmit.appendChild(statusBtn);
  ansSection.appendChild(divSubmit);
}