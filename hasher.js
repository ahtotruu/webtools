var cryptoApi = window.crypto || window.msCrypto;
var cryptoApiOk = cryptoApi && cryptoApi.subtle;
var fileApiOk = window.File && window.FileReader && window.FileList && window.Blob;

function initPage() {
	if (!cryptoApiOk) {
		document.getElementById("content_section").innerHTML = "<p>Sorry, your browser does not seem to support the Web Crypto API this page relies on.</p>";
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

function computeClicked() {
	document.getElementById("result").innerHTML = "";
	if (document.getElementById("source_file").checked) {
		hashFile();
		return;
	}
	if (document.getElementById("source_text").checked) {
		hashText();
		return;
	}
	alert("Error: No input given.");
}

function hashFile() {
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
		hashData(event.target.result);
	};
	reader.readAsArrayBuffer(files[0]);
}

function hashText() {
	var text = document.getElementById("input_text").value.replace(/[ \t\n\r]/g, "");
	if (text.search(/[^0-9a-fA-F]/) != -1) {
		alert("Error: Input contains non-hexadecimal characters.");
		return;
	}
	if (text.length % 2 != 0) {
		alert("Error: Input contains odd number of hexadecimal characters.");
		return;
	}
	var data = new ArrayBuffer(text.length / 2);
	var view = new DataView(data);
	for (var i = 0; i < text.length / 2; i += 1) {
		view.setUint8(i, parseInt(text.substr(2 * i, 2), 16));
	}
	hashData(data);
}

function hashData(data) {
	cryptoApi.subtle.digest(document.getElementById("hash_function").value, data).then(function(hash) {
		var view = new DataView(hash);
		var text = "";
		for (var i = 0; i < hash.byteLength; i += 1) {
			text = text + ("00" + view.getUint8(i).toString(16)).slice(-2);
		}
		document.getElementById("result").innerHTML = text;
	});
}
