Vocina 🚀
=========
Un proyecto del Smart Open Lab para incentivar la elección de carreras tecnológicas en jóvenes.

Si no tienes uno de los KSD puedes construirlo tú mismo. Para ello ve a la parte de Hazlo tú mismo.

También puedes contribuir mejorando el código 😁

# Actualización 🆕
Se ha subido una nueva release con la nueva imagen para la Raspberry Pi.

Para poder configurarla hay que seguir los siguientes pasos:
* Descarga el fichero comprimido en la sección de Release de este repositorio.
* Una vez descargado, descomprime el archivo.
* Introduce la tarjeta microSD en tu ordenador y descarga el programa [Win32](https://sourceforge.net/projects/win32diskimager/)
* Selecciona la imagen y escribelá en tu microSD con el botón _Write_

Ahora tienes que configurar el wifi porque la imagen viene con el SSID y la contraseña por defecto (_raspi1_ y _es1134pm_)

Para cambiar esto tendrás que editar el fichero _/etc/hostapd/hostapd.conf_ y cambiar las lineas de _ssid_ y _wpa_passphrase_ 
con el SSID y la contraseña de cada kit.

Por ejemplo para el kit con SSID _raspi02_ el fichero quedaría así:
<pre>
country_code=ES
interface=wlan0
ssid=raspi02
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=es0024am
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
</pre>


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

## Patrocinadores

<img src="https://www.convocatoria.fecyt.es/Publico/Logotipos/__Recursos/ministerio-fecyt-impreso_JPG.jpg"
     alt="FECYT"
     height="70%"
     width="70%" />
<img src="https://github.com/SmartOpenLab/Escudo-SmartOpenLab/blob/master/to%20use%20(final_exports)/logo_y_letras_fondo_transparente.png"
     alt="SOL"
     height="15%"
     width="15%" />
<img src="https://www.unex.es/conoce-la-uex/centros/plasencia/temporal/especialista-universitario-en-patologia-ungueal/Logo%20UEx.jpg"
     alt="UEX"
     height="7%"
     width="7%" />

