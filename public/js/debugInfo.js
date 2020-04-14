function showInfoCameras(size, mapX, mapY, center, zoom, clear){
	if(clear) console.clear();

	console.groupCollapsed("Debug camera");
	console.table({
		"Size": size,
		"Map X": mapX,
		"Map Y": mapY,
		"Center": center,
		"Zoom": zoom});
	console.groupEnd("Debug camera");
}

function showInfoTile(tileSize, numOfTile, sizeMap, level, clear){
	if(clear) console.clear();

	console.groupCollapsed("Debug tile");
	console.table({
		"Tile size": tileSize,
		"Nº tile": numOfTile,
		"Size map": sizeMap,
		"Level": level});
	console.groupEnd("Debug tile");
}

function showInfoAndy(andyX, andyY, andyScale, clear){
	if(clear) console.clear();

	console.groupCollapsed("Debug andy");
	console.table({
		"Andy X": andyX,
		"Andy Y": andyY,
		"Scale": andyScale});
	console.groupEnd("Debug andy");
}


/*TO DO*/
function showInfoRaspi(clear){
	if(clear) console.clear();

	let isRaspi;

	console.groupCollapsed("Debug rapi");
	raspiRead("CONNECTED").then(value => {
		isRaspi = value;
		raspiRead("LED").then(value => {
			console.table({
				"Connected": isRaspi,
				"LED": value});
			console.groupEnd("Debug rapi");
		})
	});	
}