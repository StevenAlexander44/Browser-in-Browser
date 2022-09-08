var wrapper = document.createElement("div");
wrapper.id = "window";

function applyStyles(elem, obj) {
	for (var prop in obj) elem.style[prop] = obj[prop]
}
applyStyles(wrapper, {
	top: "10px",
	right: "10px",
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
function enter() {
	wrapper.style.opacity = "1"
}
function leave() {
	wrapper.style.opacity = "0";
}
wrapper.addEventListener("mouseenter", enter, false);
wrapper.addEventListener("mouseleave", leave, false);
document.body.parentNode.appendChild(wrapper);
wrapper.innerHTML = `<style scoped>#urlBar {
width: calc(100% + 2px);
height: 28px;
background-color: #1b1a1a;
display: flex;
align-items: center;
white-space: nowrap;
}
#urlBar::-webkit-scrollbar {
display: none;
}
#previous, #forward {
font-size: 24px;
padding-left: 8px;
padding-right: 8px;
margin-bottom: 6px;
}
#previous, #forward, #refresh {
color: white;
user-select: none;
}
#refresh {
font-size: 18px;
padding: 0px 4px;
margin-right: 10px;
}
#addressBar {
padding-top: 4px;
display: flex;
border: 2px solid black;
border-radius: 4px;
background-color: black;
width: calc(100% - 150px);
}
#addressBar, #protocol, #host, #path {
font-size: 14px;
font-family: "system";
overflow: hidden;
}
#addressBar, #host {
color: white;
}
#protocol, #path {
color: #9c9898;
}
#exit {
position: absolute;
overflow: hidden;
color: white;
background-color: black;
font-size: 15px;
right: 0px;
padding: 4px 16px;
}
#content {
width: 100%;
height: calc(100% - 29px);
border: 0px;
}</style>
<div id="urlBar">
<span id="previous">‹</span>
<span id="forward">›</span>
<span id="refresh">⟳</span>
<div id="addressBar" contentEditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>
<span id="exit">✕</span>
</div>
<iframe id="content" allowFullscreen="true" src="https://www.google.com/?igu=1"></iframe>`
var window = document.getElementById("window");
var content = document.getElementById("content");
var previous = document.getElementById("previous");
var forward = document.getElementById("forward");
var refresh = document.getElementById("refresh");
var addressBar = document.getElementById("addressBar");
var exit = document.getElementById("exit");
var urlBar = document.getElementById("urlBar");

function handleMouseOver(i) {
	i[0].style.backgroundColor = i[1];
	i[0].style.cursor = "context-menu";
}

function handleMouseOut(i) {
	i[0].style.backgroundColor = i[2];
	i[0].style.cursor = "default";
}
for (var i of [
		[previous, "#696969", "#1b1a1a"],
		[forward, "#696969", "#1b1a1a"],
		[refresh, "#696969", "#1b1a1a"],
		[exit, "red", "black"]
	]) {
	i[0].addEventListener("mouseover", handleMouseOver.bind(this, i), false);
	i[0].addEventListener("mouseout", handleMouseOut.bind(this, i), false);
}
urlBar.addEventListener("mouseover", function handleMouseOver() {
	urlBar.style.cursor = "context-menu";
});
urlBar.addEventListener("mouseout", function handleMouseOut() {
	urlBar.style.cursor = "default";
});
// Onclick listeners
refresh.onclick = function () {
	content.src += "";
};
addressBar.addEventListener('keydown', function (e) {
	if (e.key == "Enter") {
		var usrURL = addressBar.innerText.split('\n').join('');
		var newURL = "";
		if (getYoutubeId(usrURL) != null) {
			newURL = "https://youtube.com/embed/" + getYoutubeId(usrURL);
		} else if (usrURL.includes('google.com')) {
			newURL = "https://google.com/?igu=1";
		} else if (usrURL.includes('.')) {
			newURL = usrURL.includes('http') ? usrURL : "https://" + usrURL;
		} else {
			newURL = "https://www.google.com/search?q=" + usrURL + "&igu=1";
		}
		setURL(newURL);
	}
	if (e.key == "Escape") {
		resetAddressBar(content.src);
	}
});
exit.onclick = function () {
	window.style.display = "none";
};
// Make the DIV element draggable:
(function (elementSelector) {
	var dragTarget = document.querySelector(elementSelector);
	var dragStartX, dragStartY;
	var objInitLeft, objInitTop;
	var inDrag = false;
	urlBar.addEventListener("mousedown", function (e) {
		inDrag = true;
		objInitLeft = dragTarget.offsetLeft;
		objInitTop = dragTarget.offsetTop;
		dragStartX = e.pageX;
		dragStartY = e.pageY;
	});
	document.addEventListener("mousemove", function (e) {
		if (!inDrag) {
			return;
		}
		dragTarget.style.left = (objInitLeft + e.pageX - dragStartX) + "px";
		dragTarget.style.top = (objInitTop + e.pageY - dragStartY) + "px";
	});
	document.addEventListener("mouseup", function (e) {
		inDrag = false;
	});
}("#window"))
function setURL(newURL) {
	content.src = newURL;
	resetAddressBar(newURL);
}
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
setURL(content.src);
function getYoutubeId(url) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return (match && match[2].length === 11) ? match[2] : null;
}
