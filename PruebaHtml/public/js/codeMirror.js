$(document).ready(function (){
    //Editor de codigo
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,  //Incluye los numeros de linea
        //theme: "ambiance",  //El tema de fondo
        lineWrapping: true, //Cuando acabas una linea salta a la siguiente
        //readOnly: true    //Modo de solo lectura
        undoDepth: 20       //Maximo numero de lineas en las que puedes escribir
    })
    editor.setValue("//¿Estás preparado?")  //Valor que se muestra por defecto 


    //Zona que coge el codigo del editor y lo evalua
    $("#run").click(function(){
        $("#chalfunction").remove()
        let jsx = editor.getValue()
        let cad = jsx.split('\n')
        let s = document.createElement('script')
        s.setAttribute("id", "chalfunction")
        s.textContent = jsx
        console.log(cad)
        document.body.appendChild(s)
    })
})