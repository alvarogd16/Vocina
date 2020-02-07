document.addEventListener("DOMContentLoaded", function(event) { 
//Editor de codigo
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,  //Incluye los numeros de linea
        //theme: "ambiance",  //El tema de fondo
        lineWrapping: true, //Cuando acabas una linea salta a la siguiente
        //readOnly: true    //Modo de solo lectura
        undoDepth: 20       //Maximo numero de lineas en las que puedes escribir
    })
    editor.setValue("//¿Estás preparado?")  //Valor que se muestra por defecto 

    //Funcion que crea una funcion con el codigo pasado por parametros
    function createFunction(codigo){
        return new Function(codigo);
    }
    
    //Zona que coge el codigo del editor y lo evalua
    document.getElementById("run").onclick = function() {
        let contenidoEditor = editor.getValue();
        var ejecutame = createFunction(contenidoEditor);
        ejecutame();
    };
});