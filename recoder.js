var dataApiOk = window.ArrayBuffer;
var fileApiOk = window.File && window.FileReader && window.FileList && window.Blob;

var white = " \t\n\r";
var base16 = "0123456789abcdef";
var base32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
var base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function initPage() {
	if (!dataApiOk) {
		document.getElementById("content_section").innerHTML = "<p>Sorry, your browser does not seem to support the Buffer API this page relies on.</p>";
	}
	if (!fileApiOk) {
		document.getElementById("input_file_section").innerHTML = "<p>Sorry, your browser does not seem to support the File API this page relies on.</p>";
	}
	sourceChanged();
}

function sourceChanged() {
	document.getElementById("input_file_section").hidden = !document.getElementById("source_file").checked;
	document.getElementById("input_text_section").hidden = !document.getElementById("source_text").checked;
}

function recodeClicked() {
	document.getElementById("output_data").innerHTML = "";
	if (document.getElementById("source_file").checked) {
		loadFile();
		return;
	}
	if (document.getElementById("source_text").checked) {
		parseText();
		return;
	}
	alert("Error: No input given.");
}

function loadFile() {
	var files = document.getElementById("input_file").files;
	if (!files[0]) {
		alert("Error: No file given.");
		return;
	}
	var reader = new FileReader();
	reader.onload = function(event) {
		if (event.target.error) {
			alert("Error: File reading failed.");
			return;
		}
		encodeData(event.target.result);
	};
	reader.readAsArrayBuffer(files[0]);
}

function parseText() {
	if (document.getElementById("input_format").value == "base16") {
		var data = fromBaseX(document.getElementById("input_text").value.toLowerCase(), base16, 4, 2);
	}
	if (document.getElementById("input_format").value == "base32") {
		var data = fromBaseX(document.getElementById("input_text").value.toUpperCase(), base32, 5, 8);
	}
	if (document.getElementById("input_format").value == "base64") {
		var data = fromBaseX(document.getElementById("input_text").value, base64, 6, 4);
	}
	if (data) {
		encodeData(data);
	}
}

function encodeData(data) {
	if (document.getElementById("output_format").value == "base16") {
		document.getElementById("output_data").innerHTML = toBaseX(data, base16, 4, 2);
	}
	if (document.getElementById("output_format").value == "base32") {
		document.getElementById("output_data").innerHTML = toBaseX(data, base32, 5, 8);
	}
	if (document.getElementById("output_format").value == "base64") {
		document.getElementById("output_data").innerHTML = toBaseX(data, base64, 6, 4);
	}
}

// inefficient, but simple and clear
function fromBaseX(text, chars, bits, block) {
	text = text.replace(new RegExp("[" + white + "]", "g"), "");
	if (text.length % block > 0) {
		alert("Error: Input has invalid length.");
		return;
	}
	while (text.length > 0 && text.slice(-1) == "=") {
		text = text.slice(0, text.length - 1);
	}
	if (text.search(new RegExp("[^" + chars + "]")) != -1) {
		alert("Error: Input contains invalid characters.");
		return;
	}
	var data = new ArrayBuffer(Math.floor(text.length * bits / 8));
	var view = new DataView(data);
	var pos = 0;
	var buf = "";
	for (var i = 0; i < text.length; ++i) {
		var n = chars.indexOf(text.charAt(i));
		buf = buf + ("00000000" + n.toString(2)).slice(-bits);
		while (buf.length >= 8) {
			view.setUint8(pos, parseInt(buf.slice(0, 8), 2));
			buf = buf.slice(8);
			pos = pos + 1;
		}
	}
	return data;
}

// inefficient, but simple and clear
function toBaseX(data, chars, bits, block) {
	var view = new DataView(data);
	var text = "";
	var buf = "";
	for (var i = 0; i < data.byteLength; ++i) {
		buf = buf + ("00000000" + view.getUint8(i).toString(2)).slice(-8);
		while (buf.length >= bits) {
			text = text + chars.charAt(parseInt(buf.slice(0, bits), 2));
			buf = buf.slice(bits);
		}
	}
	if (buf.length > 0) {
		text = text + chars.charAt(parseInt((buf + "00000000").slice(0, bits), 2));
	}
	while (text.length % block > 0) {
		text = text + "=";
	}
	return text;
}
