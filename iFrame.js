if (document.getElementById("content") != null && document.getElementById("content").parentNode.style.display == "none") {
  document.getElementById("content").parentNode.outerHTML="";
}
if (document.getElementById("content") == null) {
var wrapper = document.createElement("div");
wrapper.id = "window";
function applyStyles(elem, obj) {
  for (var prop in obj) elem.style[prop] = obj[prop]
}
applyStyles(wrapper, {
  top: "10px",
  left: "10px",
  height: "389px",
  width: "640px",
  resize: "both",
  overflow: "hidden",
  position: "fixed",
  zIndex: 2147483647,
  display: "block",
  transition: "opacity 0.1s",
  transform: "scale(1)"
});
document.body.parentNode.appendChild(wrapper);
// Some CSS taken from https://github.com/mrd0x/BITB
wrapper.innerHTML = `<style scoped>input{width:50px}#addressBar,#exit,#host{color:#fff}
#addressBar,#exit{background-color:#000}
#urlBar{width:calc(100% + 2px);height:28px;background-color:#1b1a1a;display:flex;align-items:center;white-space:nowrap}
#urlBar::-webkit-scrollbar{display:none}
#refresh{color:#fff;user-select:none;font-size:18px;padding:2px 6px}
#addressBar{padding-top:4px;margin-right:2px;display:flex;border:2px solid #000;border-radius:4px;width:calc(100% - 325px)}
#addressBar,#host,#path,#protocol{font-size:14px;font-family:system;overflow:hidden}
#path,#protocol{color:#9c9898}
#exit{position:absolute;overflow:hidden;font-size:15px;right:0;padding:4px 16px}
#content{width:100%;height:calc(100% - 29px);border:0}</style>
<div id="urlBar">
<span id="refresh">&#10227;</span>
<div id="addressBar" contentEditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>
<div id="inputs">
<input id="widthCheck" type="number" value="640">
<input id="heightCheck" type="number" value="360">
<input id="leftCheck" type="number" value="10">
<input id="topCheck" type="number" value="10">
</div>
<span id="exit">&#10005;</span>
</div>
<iframe id="content" allowFullscreen="true" src="https://www.google.com/?igu=1"></iframe>`
var content = document.getElementById("content");
var refresh = document.getElementById("refresh");
var addressBar = document.getElementById("addressBar");
var exit = document.getElementById("exit");
var urlBar = document.getElementById("urlBar");
var widthCheck = document.getElementById("widthCheck");
var heightCheck = document.getElementById("heightCheck");
// Change color on mouseover
function handleMouseOver(i) {
  i[0].style.backgroundColor = i[1];
}
function handleMouseOut(i) {
  i[0].style.backgroundColor = i[2];
}
for (var i of [ [refresh, "#696969", "#1b1a1a"], [exit, "red", "black"] ]) {
  i[0].addEventListener("mouseover", handleMouseOver.bind(this, i), false);
  i[0].addEventListener("mouseout", handleMouseOut.bind(this, i), false);
}
refresh.onclick = function () { applyNumbers(); content.src += ""; };
// Watches while typing in address bar
addressBar.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    var usrURL = addressBar.innerText.split("\n").join("");
    var newURL = "";
    if (getYoutubeId(usrURL) != null) {
      newURL = "https://youtube.com/embed/"+getYoutubeId(usrURL)+"?autoplay=1";
    } else if (usrURL.includes("google.com")) {
      newURL = "https://google.com/?igu=1";
    } else if (usrURL.includes(".")) {
      newURL = usrURL.includes("http") ? usrURL : "https://"+usrURL;
    } else {
      newURL = "https://www.google.com/search?q="+usrURL+"&igu=1";
    }
    setURL(newURL);
  }
  if (e.key == "Escape") {
    resetAddressBar(content.src);
  }
});
heightCheck.addEventListener("keydown", function (e) {
  if (e.key == "Enter") { applyNumbers() }
});
widthCheck.addEventListener("keydown", function (e) {
  if (e.key == "Enter") { applyNumbers() }
});
topCheck.addEventListener("keydown", function (e) {
  if (e.key == "Enter") { applyNumbers() }
});
leftCheck.addEventListener("keydown", function (e) {
  if (e.key == "Enter") { applyNumbers() }
});
function applyNumbers() {
  wrapper.style.width = widthCheck.value + "px";
  wrapper.style.height = (parseInt(heightCheck.value) + 29) + "px";
  wrapper.style.left = leftCheck.value + "px";
  wrapper.style.top = topCheck.value + "px";
}
// Hide window when X is clicked
exit.onclick = function () {
  wrapper.style.display = "none";
};
// Make the DIV element draggable:
var dragTarget = wrapper;
var dragStartX, dragStartY; var objInitLeft, objInitTop;
var inDrag = false;
urlBar.addEventListener("mousedown", function(e) {
  inDrag = true;
  objInitLeft = dragTarget.offsetLeft; objInitTop = dragTarget.offsetTop;
  dragStartX = e.pageX; dragStartY = e.pageY;
});
document.addEventListener("mousemove", function(e) {
  if (!inDrag) {return;}
  dragTarget.style.left = (objInitLeft + e.pageX-dragStartX) + "px";
  dragTarget.style.top = (objInitTop + e.pageY-dragStartY) + "px";
});
document.addEventListener("mouseup", function(e) {inDrag = false;});
// Change URL
function resetAddressBar(newURL) {
  addressBar.innerHTML = "";
  const frameSrc = new URL(newURL);
  var protocolSpan = document.createElement("span");
  protocolSpan.id = "protocol";
  protocolSpan.innerText = frameSrc.protocol + "//";
  addressBar.appendChild(protocolSpan);
  var hostSpan = document.createElement("span");
  hostSpan.id = "host";
  hostSpan.innerText = frameSrc.host;
  addressBar.appendChild(hostSpan);
  var pathSpan = document.createElement("span");
  pathSpan.id = "path";
  pathSpan.innerText = frameSrc.pathname + frameSrc.search + frameSrc.hash;
  addressBar.appendChild(pathSpan);
}
function setURL(newURL) {
  content.src = newURL;
  resetAddressBar(newURL);
}
setURL(content.src);
// RegEx to get id from youtube video url
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
} else {document.getElementById("content").parentNode.outerHTML=""}
