Vocina 🚀
=========
Un proyecto del Smart Open Lab para incentivar la elección de carreras tecnológicas en jóvenes.

Si no tienes uno de los KSD puedes construirlo tú mismo. Para ello ve a la parte de Hazlo tú mismo.

También puedes contribuir mejorando el código 😁

# Uso del KSD 🧟
Para poder usar tu KSD necesitarás un dispositivo móvil o un ordenador con WiFi.

Los pasos para jugar son los siguientes:
* Conecta la Raspberry Pi (el mini ordenador verde) con el USB como si fueras a cargar tu móvil. Se conecta en el micro USB exterior.
* Una vez conectado una luz parpadeará. Eso es buena señal.
* Ahora con tu móvil u ordenador conéctate a la red WiFi indicada en la caja del KSD (por ejemplo _raspi1_ y contraseña _12es4567_)
* Una vez conectada verás que no tienes internet. Es normal tranquilo.
* Abre tú navegador favorito y escribe lo que pone al final en la caja de tu KSD.
* Ahora ya puedes disfrutar del juego 😄

# Hazlo tú mismo 👷
## Componentes 💾
Necesitarás los siguientes:
- [ ] Raspberri Pi Zero W
- [ ] LED
- [ ] Botón
- [ ] Sensor de temperatura DHT11
- [ ] Encoder de tres pines
- [ ] Resistencias pull up (nosotros usamos de 4.6K)

## Hardware 🤖
Para conectar todo correctamente dejamos un esquema de conexión. Nosotros usamos una placa entre medias de los componentes y la Rasberry pero no es necesaria.

## Instalación ⚙️
Lo primero será instalar [Raspberry Pi OS] (https://www.raspberrypi.org/software/) en la tarjeta SD de nuestra Raspberry.

Después necesitarás instalar [node](https://nodejs.org/es/) y la carpeta del proyecto.

Para que cree el servidor y te puedas conectar a la Wifi de la Rapsberry sigue este [tutorial](https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md)

Ahora puedes instalar las dependencias de node con el siguiente comando:
```bash
npm install
```

## Uso 🎮
Para iniciar el servidor usa:
```bash
npm start
```

Si todo ha ido bien podrás conectarte a la Wifi de tu Raspberry y poniendo en el navegador _TODO_ se iniciará el juego.

Ahora ya puedes disfrutar de él 😄
