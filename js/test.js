function recupererFichier(url)
{
	const xhr = new XMLHttpRequest();
  	xhr.open("GET", url, false);
  	xhr.overrideMimeType("text/plain");
  	var txt = '';

	xhr.onreadystatechange = function () {
	if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
	    txt = xhr.responseText;
	}
	xhr.send(null);

	return txt;
}


function importerDepuisListing()
{
	var filename = document.getElementById('selectFileImport').value;
	var filetext = recupererFichier("exemple donnees/" + filename);

	importerFichierTexte(filename, filetext);
}

function letzgo()
{
	var div = document.getElementById('testRapide');
	var tabFichiers = recupererFichier("exemple donnees/listing.txt");
	tabFichiers = tabFichiers.split(/[\r\n]+/);

	var strDiv = '<select id="selectFileImport">';

	for (var i = 0; i < tabFichiers.length; i++)
		strDiv += '<option value="'+ tabFichiers[i] +'">'+ tabFichiers[i] +'</option>';

	strDiv += '</select><br><button onclick="importerDepuisListing()">Zou</button>';
	div.innerHTML = strDiv;
}


//dans main.html
// <div id="testRapide"></div>
// <script src="js/test.js"></script>