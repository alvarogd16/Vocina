
//Send information to a raspberry
//component is a string 
//value is a number
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

//Get a promise with the value of the component
//readRead().then(value => do something with value)
async function raspiRead(component){
	let response = await fetch('/raspi/' + component);
	let json = await response.json();
	return json;
}