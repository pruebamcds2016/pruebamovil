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
    $("#labelUbicacion").css("display", "block");
    var idProvincia;
    var idCanton;
    var idParroquia;
    var institucion;
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        //alert(elem);
        idProvincia = elem[0];
        idCanton = elem[1];
        idParroquia = elem[2]
        institucion = elem[3];
    }
    //alert(elem);
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


    if (institucion !== "-1") {
        //Obras por DPA  institucion
        if (idCanton === "-1" && idParroquia === "-1") {
            /*
             *Evento ajax para listar los sectores
             */
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    $.getJSON(datos, function(resultados) {
                        $(".loadingPag").css("display", "none");
                        if (idParroquia === "-1") {
                            $("#provinciaTitulo").html("");
                            $("#provinciaTitulo").html("Provincia");
                            $("#provincia").html(resultados[0].provincia);
                        } else {
                            $("#provinciaTitulo").html("");
                            $("#provinciaTitulo").html("Cantón");
                            $("#provincia").html(resultados[0].canton);
                        }

                        //alert(resultados);
                        $('#tablaDetalleInfraestructuraEstadoObra').html("");

                        var titulo = "<div class='tituloTablas'>" + "<span> Obras del sector social </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td><td style=' text-align: center'>Entidad</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].canton + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].parroquia + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            if (resultados[i].idEstado === "4") {
                                cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                            } else {
                                cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                            }

                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadEjecutora + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].avanceObra + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].fechaEntregaObra + "</td>";
                            cuerpo = cuerpo + "</tr>";
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
            //fin
        } else {
            /*
             *Evento ajax para listar los sectores
             */
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    $.getJSON(datos, function(resultados) {
                        $(".loadingPag").css("display", "none");
                        if (idParroquia === "-1") {
                            $("#provinciaTitulo").html("");
                            $("#cantonTitulo").html("");
                            $("#provinciaTitulo").html("Provincia");
                            $("#cantonTitulo").html("Cantón");
                            $("#provincia").html(resultados[0].provincia);
                            $("#canton").html(resultados[0].canton);
                        } else {
                            $("#provinciaTitulo").html("");
                            $("#cantonTitulo").html("");
                            $("#provinciaTitulo").html("Cantón");
                            $("#cantonTitulo").html("Parroquia");
                            $("#provincia").html(resultados[0].canton);
                            $("#canton").html(resultados[0].parroquia);
                        }

                        //alert(resultados);
                        $('#tablaDetalleInfraestructuraEstadoObra').html("");

                        var titulo = "<div class='tituloTablas'>" + "<span> Obras del sector social </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center'>Entidad</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            if (resultados[i].idEstado === "4") {
                                cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                            } else {
                                cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                            }

                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadEjecutora + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].avanceObra + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].fechaEntregaObra + "</td>";
                            cuerpo = cuerpo + "</tr>";
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
            //fin
        }
    }
//POR DPA    
    else {
        if (idCanton === "-1" && idParroquia === "-1") {
            /*
             *Evento ajax para listar los sectores
             */
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                    $.getJSON(datos, function(resultados) {
                        $(".loadingPag").css("display", "none");
                        if (idParroquia === "-1") {
                            $("#provinciaTitulo").html("");
                            $("#provinciaTitulo").html("Provincia");
                            $("#provincia").html(resultados[0].provincia);
                        } else {
                            $("#provinciaTitulo").html("");
                            $("#provinciaTitulo").html("Cantón");
                            $("#provincia").html(resultados[0].canton);
                        }

                        //alert(resultados);
                        $('#tablaDetalleInfraestructuraEstadoObra').html("");

                        var titulo = "<div class='tituloTablas'>" + "<span> Obras del sector social </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td><td style=' text-align: center'>Entidad</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].canton + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].parroquia + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadEjecutora + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].avanceObra + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].fechaEntregaObra + "</td>";
                            cuerpo = cuerpo + "</tr>";
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
            //fin
        } else {
            /*
             *Evento ajax para listar los sectores
             */
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                    $.getJSON(datos, function(resultados) {
                        $(".loadingPag").css("display", "none");
                        if (idParroquia === "-1") {
                            $("#provinciaTitulo").html("");
                            $("#cantonTitulo").html("");
                            $("#provinciaTitulo").html("Provincia");
                            $("#cantonTitulo").html("Cantón");
                            $("#provincia").html(resultados[0].provincia);
                            $("#canton").html(resultados[0].canton);
                        } else {
                            $("#provinciaTitulo").html("");
                            $("#cantonTitulo").html("");
                            $("#provinciaTitulo").html("Cantón");
                            $("#cantonTitulo").html("Parroquia");
                            $("#provincia").html(resultados[0].canton);
                            $("#canton").html(resultados[0].parroquia);
                        }

                        //alert(resultados);
                        $('#tablaDetalleInfraestructuraEstadoObra').html("");

                        var titulo = "<div class='tituloTablas'>" + "<span> Obras del sector social </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center'>Entidad</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            if (resultados[i].idEstado === "4") {
                                cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                            } else {
                                cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                            }

                            cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].entidadEjecutora + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].avanceObra + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].fechaEntregaObra + "</td>";
                            cuerpo = cuerpo + "</tr>";
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
            //fin
        }

    }



}
//
ko.applyBindings(new ViewModelIndicador());
