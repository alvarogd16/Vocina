
//component string
//value boolean 
function raspiWrite(component, value){
	const data = {
		Value: value
	};

	const option = {
		method: 'POST',
		body: JSON.stringify(data), 
		headers:{
			'Content-Type': 'application/json'
		}
	}
	fetch('/raspi/' + component, option)
	.then(console.log("LED actualizado"));
}

async function raspiRead(component){
	/*fetch('/raspi/' + component)
	.then(res => res.json())
	.then(json => {
		console.log('LED: ', json)
		return json;
	});*/
	let response = await fetch('/raspi/' + component);
	let json = await response.json();
	return json;
}