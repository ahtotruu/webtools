var white = " \t\n\r";
var base10 = "0123456789";
var base16 = "0123456789abcdef";

function formatClicked() {
	document.getElementById("output_text").innerHTML = "";
	if (document.getElementById("input_format").value == "base10") {
		var time = parseText(document.getElementById("input_text").value, base10);
	}
	if (document.getElementById("input_format").value == "base16") {
		var time = parseText(document.getElementById("input_text").value, base16);
	}
	if (!Number.isInteger(time)) {
		return;
	}
	var time = new Date(1000 * time);
	if (document.getElementById("output_format").value == "utc") {
		document.getElementById("output_text").innerHTML = formatTime(
			time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(),
			time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
	}
	if (document.getElementById("output_format").value == "local") {
		document.getElementById("output_text").innerHTML = formatTime(
			time.getFullYear(), time.getMonth(), time.getDate(),
			time.getHours(), time.getMinutes(), time.getSeconds());
	}
}

function parseText(text, chars) {
	text = text.replace(new RegExp("[" + white + "]", "g"), "");
	if (text.length == "0") {
		alert("Error: No input given.");
		return;
	}
	if (text.search(new RegExp("[^" + chars + "]")) != -1) {
		alert("Error: Input contains invalid characters.");
		return;
	}
	return parseInt(text, chars.length);
}

function formatTime(year, month, date, hours, minutes, seconds) {
	return ("0000" + year.toString()).slice(-4) + "-" +
		("00" + (month + 1).toString()).slice(-2) + "-" +
		("00" + date.toString()).slice(-2) + " " +
		("00" + hours.toString()).slice(-2) + ":" +
		("00" + minutes.toString()).slice(-2) + ":" +
		("00" + seconds.toString()).slice(-2);
}
