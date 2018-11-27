function getQuestion(name) {
  var ref = firebase.firestore().collection("Courses/" + name + "/Questions");
  var id = 1;
  var section = document.getElementById("qa_section");
  ref.get().then((list) => {
    list.forEach((question) => {
      var post = document.createElement("BUTTON");
      post.setAttribute("id", id.toString());
      post.appendChild(document.createTextNode(question.get("question")));
      
      var stat = question.get("solved");
      if (stat == null || !stat)
        post.setAttribute("style", "background-color:red;");
      else
        post.setAttribute("style", "background-color:#4CAF50;");
      section.appendChild(post);
      
      post.addEventListener("click", (e) => {
        window.location.href = "Project/../question/question" + (e.target.id) + ".html";
      });
      id++;
    });
  });
}