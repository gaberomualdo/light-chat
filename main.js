window.onload = check_chat_hash;
window.onhashchange = function(){location.reload();};
var chatname = "";
var username = localStorage.getItem("cmdchat_username");
var chat = [];

function check_chat_hash(hashchangefunc){
  if(window.location.hash) {
    chatname = window.location.hash.substring(1);
    init_chat();
  }else{
    window.location.href = "about.html";
  }
}
function init_chat(){
  document.title = "#" + chatname + " | lightchat";
  if(!username) {
    document.querySelector("div.container").classList.add("get_username");
    document.querySelector("div.container div.username textarea").focus();
    _vendors_setCaretToPos(document.querySelector("div.container div.username textarea"),document.querySelector("div.container div.username textarea").value.length);
  }else{
    document.querySelector("div.container div.send_message textarea").innerHTML = "";
    document.querySelector("div.container div.send_message textarea").focus();
    _vendors_setCaretToPos(document.querySelector("div.container div.send_message textarea"),document.querySelector("div.container div.send_message textarea").value.length);
  }
  firebase.database().ref(chatname).on('value', function(snapshot) {
    var newchat = JSON.parse(snapshot.val());
    if(newchat.length - chat.length == 1){
      chat = newchat;
      name = chat[chat.length - 1].split("&gt; ")[0].split("&lt;").join("");
      msg = chat[chat.length - 1].split("&gt; ");
	  msg.shift();
	  msg = msg.join("> ");
      var usernamecode = "";
	  if(name == localStorage.getItem("cmdchat_username")){
	    usernamecode = "right";
	  }
	  document.querySelector(".container .chat").innerHTML += "<div class='" + usernamecode + "'><span>" + name + "</span><p>" + msg + "</p></div>";
    }else{
      chat = newchat;
      chat.forEach(function(item,index){
      	name = item.split("&gt; ")[0].split("&lt;").join("");
      	msg = item.split("&gt; ");
      	msg.shift();
      	msg = msg.join("> ");
      	var usernamecode = "";
      	if(name == localStorage.getItem("cmdchat_username")){
      		usernamecode = "right";
      	}
        document.querySelector(".container .chat").innerHTML += "<div class='" + usernamecode + "'><span>" + name + "</span><p>" + msg + "</p></div>";
      });
    }
    var element = document.querySelector(".container .chat");
    element.scrollTop = element.scrollHeight - element.clientHeight;
  });
}
document.querySelector("div.container div.username textarea").onkeydown = function(e){
  if(e.keyCode == 13){
    localStorage.setItem("cmdchat_username",this.value);
    username = localStorage.getItem("cmdchat_username");
    this.value = "";
    location.reload();
  }
}
document.querySelector("div.container div.send_message textarea").onkeydown = function(e){
  if(e.keyCode == 13){
    e.preventDefault();
    var message = this.value;
    if(message.length > 0 && message != "/clear"){
      var newchat = chat.slice(0);
      newchat.push("&lt;" + username + "&gt; " + message);
      firebase.database().ref(chatname).set(JSON.stringify(newchat));
    }else if(message == "/clear"){
      var newchat = [];
      document.querySelector(".container .chat").innerHTML = "";
      firebase.database().ref(chatname).set(JSON.stringify(newchat));
    }
    this.value = "";
    this.focus();
    _vendors_setCaretToPos(this,this.value.length);
  }
}
