/* 
 * Javascript indicadores
 * autor: @Adriana.Romero
 * 
 */

function ViewModelIndicador() {
    var principal = this;

    /*Se oculta la tabla donde se encuentra la informacion que muestra la ubicacion*/
    $(".infoUbicacion").css("display", "none");
    /*Se oculta el DIV donde aparece la ubicacion actual*/
    $("#labelUbicacion").css("display", "none");

    $(".infoUbicacion").css("display", "block");
    $("#labelUbicacion").html("Usted se encuentra en:");
    $("#labelUbicacion").css("display", "block");

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        //alert(elem);
        idProvincia = elem[0];
        idCanton = elem[1];
        institucion = elem[2];
    }
    /*
     * Variables globales y de knockout.js
     */
    var ipserver;
    principal.ejemploLista = ko.observableArray();
    principal.firstName = ko.observable("");
    /*
     * Visibilidad de los elementos html
     */
    $(".loadingPag").css("display", "block");
    $("#errorLabel").css("display", "none");


    /*
     *Evento ajax para listar los sectores
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            //http://201.219.3.75:8080/SWSISEcuador/webresources/indanalisis/indicador/1/24
            //var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/indicador/" + id_tema + "/" + id_subtema;
            var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/" + idProvincia + "/" + idCanton + "/" + institucion;
            $.getJSON(cadena, function(resultados) {
                $(".loadingPag").css("display", "none");
                //alert(resultados);
                $('#tablaDetalleInfraestructuraEstadoObra').html("");

                var titulo = "<div class='tituloTablas'>"
                        + "<span> Obras del sector social en el cantón </span></div>";

                /*Se setea la cabecera*/
                var cabecera = "<table><thead><tr><td style=' text-align: center'>Entidad Requiriente</td>"
                        + "<td style=' text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Nombre del Establecimiento</td><td style=' text-align: center'>Tipo de Intervención</td><td style=' text-align: center'>Descripción de la Intervención</td><td style=' text-align: center'>Estado de la Obra</td><td style=' text-align: center'>Entidad Ejecutora</td><td style=' text-align: center'>Avance de la Obra</td><td style=' text-align: center'>Fecha Entrega de la Obra</td></tr></thead>";

                var cuerpo = "<tbody>";

                alert(resultados[0].idEntidadRequiriente);
                for (var i = 0; i < resultados.length; i++) {
                    cuerpo = cuerpo + "<tr>";

                    for (var j = 0; j < resultados[i].length; j++) {
                        cuerpo = cuerpo + "<td>  </td>";

                    }
                    cuerpo = cuerpo + "/<tr>";
                }

                var pie = "</tbody>";
                $('#tablaDetalleInfraestructuraEstadoObra').append(titulo + cabecera + cuerpo + pie);



            }).error(function() { /* assign handler */
                /* alert(jqXHR.responseText) */
//                alert("Ocurrio un error" + jqXHR.responseText);
                $(".loadingPag").css("display", "none");
                $("#errorLabel").css("display", "block");
            });
        }
    });


}
//
ko.applyBindings(new ViewModelIndicador());
