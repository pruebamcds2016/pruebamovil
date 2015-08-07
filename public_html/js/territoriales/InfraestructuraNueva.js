/* 
 * Javascript indicadores
 * autor: @Adriana.Romero
 * 
 */

function ViewModelIndicador() {
    var principal = this;
    //document.write("<script type='text/javascript' src='js/libs/sortable/sortable.js'></script>");
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
    var estado;
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        //alert(elem);
        idProvincia = elem[0];
        idCanton = elem[1];
        idParroquia = elem[2]
        institucion = elem[3];
        estado = elem[4];
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

    //Obras por DPA e institucion
    if (idProvincia !== "-1" && institucion !== "-1" && estado === "-1") {

        if (idCanton === "-1" && idParroquia === "-1") {
            //alert("aqui");

            //Provincia e institucion
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPAInstitucion/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].entidadRequiriente + " </span></div>";
                        
                        //var g = "<table class='sortable' id='mitbla'><thead class='sortable'><tr><th class='sorttable_sorted'>Nombre<span id='sorttable_sortfwdind'>&nbsp;▾</span></th></tr></thead><tr><td>a</td></tr><tr><td>z</td></tr></table>";
                       
                        //var g = "<table class='sortable' id='mitbla'><thead class='sortable'><tr><th>Nombre</th></tr></thead><tr><td>a</td></tr><tr><td>z</td></tr></table>";
                        //var g = "<table class='sortable' sid='mitbla'><tr><th><a href='#' class='sortheader' onclick='ts_resortTable(this, 0);return false;'>Nombre<span class='sortarrow' sortdir='down'><img src='css/images/arrow-up.gif' alt='↑'></span></a></th></tr><tr><td class'odd'>a</td></tr><tr><td class= 'even'>z</td></tr></table>";
                       
                        //$('#a').html(g);
                        
                        
                        /*Se setea la cabecera*/
                        var cabecera = "<table id='myTabled' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].canton + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].parroquia + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            /*if (resultados[i].idEstado === "4") {
                             cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                             } else {
                             cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                             }*/
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].avanceObra + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].fechaEntregaObra + "</td>";
                            cuerpo = cuerpo + "</tr>";
                        }

                        var pie = "</tbody>";
                        //alert(titulo + cabecera + cuerpo + pie);
                        $('#tablaDetalleInfraestructuraEstadoObra').append(titulo + cabecera + cuerpo + pie);



                       /* for (var i = 0; i < resultados.length; i++) {
                            cuerpo1 = cuerpo1 + "<tr>";
                            cuerpo1 = cuerpo1 + "<td style='text-align: left'>" + $("#canton1").html(resultados[0].canton); + "</td>";
                            cuerpo1 = cuerpo1 + "</tr>";
                            $('#prueba').append(cuerpo1);

                        }*/





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
            //alert("3");
            /*
             *por canton o parroquia e institucion
             */
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPAInstitucion/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].entidadRequiriente + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            /*if (resultados[i].idEstado === "4") {
                             cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                             } else {
                             cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                             }*/
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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

    else {

        //Obras por DPA e institucion y estado
        if ((institucion !== "-1") && (estado !== "-1")) {
            //por provincia institucion y estado
            if (idCanton === "-1" && idParroquia === "-1") {
                //alert("4");
                $.ajax({
                    url: "cadenaInfraestructura.txt",
                    dataType: "text",
                    success: function(data) {
                        //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                        ipserver = data;
                        var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPAInstitucionEstado/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion + "/" + estado;
                        $.getJSON(datos, function(resultados) {
                            $(".loadingPag").css("display", "none");

                            $("#provinciaTitulo").html("");
                            $("#provinciaTitulo").html("Provincia");
                            $("#provincia").html(resultados[0].provincia);
                            //$("#cantonTitulo").html("Estado");
                            //$("#canton").html(resultados[0].estadoObra);

                            //alert(resultados);
                            $('#tablaDetalleInfraestructuraEstadoObra').html("");

                            var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].entidadRequiriente + " - " + resultados[0].estadoObra + " </span></div>";

                            /*Se setea la cabecera*/
                            var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td>"
                                    + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                            //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                            var cuerpo = "<tbody>";

                            //var dato = resultados[0];
                            //alert (resultados[0].entidadRequiriente);
                            for (var i = 0; i < resultados.length; i++) {
                                cuerpo = cuerpo + "<tr>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].canton + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].parroquia + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                                /*if (resultados[i].idEstado === "4") {
                                 cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                                 } else {
                                 cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                                 }*/
                                //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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

                //alert("5");
                //por canton y parroquia , institucion y estado
                $.ajax({
                    url: "cadenaInfraestructura.txt",
                    dataType: "text",
                    success: function(data) {
                        //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                        ipserver = data;
                        var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPAInstitucionEstado/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion + "/" + estado;
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

                            var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].entidadRequiriente + " - " + resultados[0].estadoObra + " </span></div>";

                            /*Se setea la cabecera*/
                            var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td>"
                                    + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                            //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                            var cuerpo = "<tbody>";

                            //var dato = resultados[0];
                            //alert (resultados[0].entidadRequiriente);
                            for (var i = 0; i < resultados.length; i++) {
                                cuerpo = cuerpo + "<tr>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                                /*if (resultados[i].idEstado === "4") {
                                 cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                                 } else {
                                 cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                                 }*/
                                //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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



        else {
            //por DPA al dar clic en total
            if (idCanton === "-1" && idParroquia === "-1") {
                //alert("6");
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

                            var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) </span></div>";

                            /*Se setea la cabecera*/
                            var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td><td style=' text-align: center'>Entidad</td>"
                                    + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                            //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                            var cuerpo = "<tbody>";

                            //var dato = resultados[0];
                            //alert (resultados[0].entidadRequiriente);
                            for (var i = 0; i < resultados.length; i++) {
                                cuerpo = cuerpo + "<tr>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].canton + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].parroquia + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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
                //alert("7");

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

                            var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) </span></div>";

                            /*Se setea la cabecera*/
                            var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Entidad</td>"
                                    + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                            //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                            var cuerpo = "<tbody>";

                            //var dato = resultados[0];
                            //alert (resultados[0].entidadRequiriente);
                            for (var i = 0; i < resultados.length; i++) {
                                cuerpo = cuerpo + "<tr>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                                /*if (resultados[i].idEstado === "4") {
                                 cuerpo = cuerpo + "<td style='text-align: center'>Terminada</td>";
                                 } else {
                                 cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].estadoObra + "</td>";
                                 }*/
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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

        //a nivel nacional por institucion yestado
        if (idProvincia === '-1' && idCanton === "-1" && idParroquia === "-1" && institucion !== '-1' && estado !== '-1') {
            //alert("20");

            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleInstitucionEstado/" + institucion + "/" + estado;
                    $.getJSON(datos, function(resultados) {

                        $("#provinciaTitulo").html("");
                        $("#cantonTitulo").html("");
                        $("#provinciaTitulo").html("Nivel");
                        $("#provincia").html('Nacional');
                        //$("#cantonTitulo").html("Estado");
                        //$("#canton").html(resultados[0].estadoObra);

                        //alert(resultados);
                        $('#tablaDetalleInfraestructuraEstadoObra').html("");

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].entidadRequiriente + "-" + resultados[0].estadoObra + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Provincia</td><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td>"
                                + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                        //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                        var cuerpo = "<tbody>";

                        //var dato = resultados[0];
                        //alert (resultados[0].entidadRequiriente);
                        for (var i = 0; i < resultados.length; i++) {
                            cuerpo = cuerpo + "<tr>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].provincia + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].canton + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].parroquia + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                            //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                            cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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

        //dar clic en institucion NAcional totla general
        else {
            if (idProvincia === '-1' && idCanton === "-1" && idParroquia === "-1" && institucion === '-1') {
                //alert("9");
                /*
                 *Evento ajax para listar los sectores
                 */
                $.ajax({
                    url: "cadenaInfraestructura.txt",
                    dataType: "text",
                    success: function(data) {
                        //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                        ipserver = data;
                        var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalle";
                        $.getJSON(datos, function(resultados) {

                            $("#provinciaTitulo").html("");
                            $("#cantonTitulo").html("");
                            $("#provinciaTitulo").html("Nivel");
                            $("#provincia").html("Nacional");


                            //alert(resultados);
                            $('#tablaDetalleInfraestructuraEstadoObra').html("");

                            var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) </span></div>";

                            /*Se setea la cabecera*/
                            var cabecera = "<table table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Provincia</td><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td><td style=' text-align: center'>Entidad</td>"
                                    + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                            //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                            var cuerpo = "<tbody>";

                            //var dato = resultados[0];
                            //alert (resultados[0].entidadRequiriente);
                            for (var i = 0; i < resultados.length; i++) {
                                cuerpo = cuerpo + "<tr>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].provincia + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].canton + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].parroquia + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                                //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                                cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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

                //dar clic en institucion NAcional por institucion
                if (idProvincia === '-1' && idCanton === "-1" && idParroquia === "-1" && institucion !== '-1' && estado === '-1') {
                   //alert("8");

                    $.ajax({
                        url: "cadenaInfraestructura.txt",
                        dataType: "text",
                        success: function(data) {
                            //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                            ipserver = data;
                            var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleInstirucion/" + institucion;
                            $.getJSON(datos, function(resultados) {

                                $("#provinciaTitulo").html("");
                                $("#cantonTitulo").html("");
                                $("#provinciaTitulo").html("Nivel");
                                //$("#cantonTitulo").html("Institucion");
                                $("#provincia").html("Nacional");
                                // $("#canton").html(resultados[0].entidadRequiriente);

                                //alert(resultados);
                                $('#tablaDetalleInfraestructuraEstadoObra').html("");

                                var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].entidadRequiriente + " </span></div>";

                                /*Se setea la cabecera*/
                                var cabecera = "<table id='myTable' class='sortable'><thead><tr><td style=' text-align: center'>N°</td><td style=' text-align: center'>Provincia</td><td style=' text-align: center'>Cantón</td><td style=' text-align: center'>Parroquia</td>"
                                        + "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td></tr></thead>";
                                //+ "<td style='text-align: center'>Tipología</td><td style=' text-align: center'>Categoria</td><td style=' text-align: center'>Capacidad</td><td style=' text-align: center'>Establecimiento</td><td style=' text-align: center'>Intervención</td><td style=' text-align: center'>Descripción</td><td style=' text-align: center'>Obra</td><td style=' text-align: center'>Ejecutor</td><td style=' text-align: center'>Avance</td><td style=' text-align: center'>Fecha Entrega</td></tr></thead>";

                                var cuerpo = "<tbody>";

                                //var dato = resultados[0];
                                //alert (resultados[0].entidadRequiriente);
                                for (var i = 0; i < resultados.length; i++) {
                                    //alert (i+1 );
                                    cuerpo = cuerpo + "<tr>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + (i + 1) + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].provincia + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].canton + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].parroquia + "</td>";
                                    //cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadRequiriente + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].tipoInfraestructura + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].categoria + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].capacidad + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].obra + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].intervencion + "</td>";
                                    //cuerpo = cuerpo + "<td style='text-align: center'>" + resultados[i].descripcionIntervencion + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].estadoObra + "</td>";
                                    cuerpo = cuerpo + "<td style='text-align: left'>" + resultados[i].entidadEjecutora + "</td>";
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

    }

}
//
ko.applyBindings(new ViewModelIndicador());
