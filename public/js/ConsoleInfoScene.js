// A small screen showing console data to the player
// Appears and disappears depending on the needs
class ConsoleInfoScene{
	constructor(scene) {
		this.text = scene.add.text(16, 16, 'HOLAA', { 
			fontFamily: 'monospace',
			fontSize: '32px', 
			fill: '#fff', 
			backgroundColor: '#000', 
			padding: {x: 10, y: 10}
		});
		
		this.text.setVisible(false);
	}

	escribir(texto){
		this.text.setVisible(true);
		this.text.setText(texto);
		let cnsl = this;
		setTimeout(() => cnsl.text.setVisible(false), 2000);
	}
}