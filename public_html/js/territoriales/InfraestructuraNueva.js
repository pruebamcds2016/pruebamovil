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
    var tipologia;
    var estado;
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        //alert(elem);
        idProvincia = elem[0];
        idCanton = elem[1];
        idParroquia = elem[2];
        institucion = elem[3];
        tipologia = elem[4];
        estado = elem[5];

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


    //Obras por dpa e institucion
    if ((idProvincia !== "-1") && (institucion !== "-1") && (tipologia === "-1") && (estado === "-1")) {
        //alert("1");
        //provincia e institucion
        if (idCanton === "-1" && idParroquia === "-1") {
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

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla1'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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

                        $('#tabla1').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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
        //por canton e institucion
        //o por parroquia e institucion
        else {
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
                        var cabecera = "<table id='tabla2'><thead><tr><td style=' text-align: center'><u>N°</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla2').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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

    //Obras por dpa y tipologia
    if ((idProvincia !== "-1") && (institucion === "-1") && (tipologia !== "-1") && (estado === "-1")) {
        //alert("2");
        //provincia y topolgia
        if (idCanton === "-1" && idParroquia === "-1") {
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPATipologia/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + tipologia;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla3'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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

                        $('#tabla3').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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
        //por canton y topologia
        //o por parroquia y topologia
        else {
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPATipologia/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + tipologia;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla4'><thead><tr><td style=' text-align: center'><u>N°</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla4').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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

    //Obras por dpa y estado
    if ((idProvincia !== "-1") && (institucion === "-1") && (tipologia === "-1") && (estado !== "-1")) {
        //alert("222");
        //provincia y estado
        if (idCanton === "-1" && idParroquia === "-1") {
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPAEstado/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + estado;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla3'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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

                        $('#tabla3').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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
        //por canton y estado
        //o por parroquia y estado
        else {
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPAEstado/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + estado;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla4'><thead><tr><td style=' text-align: center'><u>N°</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla4').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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
    
    //Obras por DPA, tipologia y estado
    if ((idProvincia !== "-1") && (tipologia !== "-1") && (estado !== "-1")) {
        //alert("3");
        //provincia e institucion
        if (idCanton === "-1" && idParroquia === "-1") {
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPATipologiaEstado/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + tipologia + "/" + estado;
                    $.getJSON(datos, function(resultados) {
                        $(".loadingPag").css("display", "none");

                        $("#provinciaTitulo").html("");
                        $("#provinciaTitulo").html("Provincia");
                        $("#provincia").html(resultados[0].provincia);
                        //$("#cantonTitulo").html("Estado");
                        //$("#canton").html(resultados[0].estadoObra);

                        //alert(resultados);
                        $('#tablaDetalleInfraestructuraEstadoObra').html("");

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " - " + resultados[0].estadoObra + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla5'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla5').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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
        //por canton e institucion
        //o por parroquia e institucion
        else {
            $.ajax({
                url: "cadenaInfraestructura.txt",
                dataType: "text",
                success: function(data) {
                    //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleNueva/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + institucion;
                    ipserver = data;
                    var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleDPATipologiaEstado/" + idProvincia + "/" + idCanton + "/" + idParroquia + "/" + tipologia + "/" + estado;
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

                        var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " - " + resultados[0].estadoObra + " </span></div>";

                        /*Se setea la cabecera*/
                        var cabecera = "<table id='tabla6'><thead><tr><td style=' text-align: center'><u>N°</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla6').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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


    //por DPA al dar clic en total
    if ((idProvincia !== "-1") && (institucion === "-1") && (tipologia === "-1") && (estado === "-1")) {
        //alert("4");
        //provincia
        if (idCanton === "-1" && idParroquia === "-1") {
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
                        var cabecera = "<table id='tabla7'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td><td style=' text-align: center'><u>Entidad</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla7').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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
        //por canton
        //o por parroquia
        else {
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
                        var cabecera = "<table id='tabla8'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Entidad</u></td>"
                                + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                        $('#tabla8').dataTable({
                            "bPaginate": false,
                            "bLengthChange": false,
                            "bFilter": true,
                            "bSort": true,
                            "bInfo": false,
                            "bAutoWidth": false});


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

    //a nivel nacional por institucion
    if ((idProvincia === "-1") && (idCanton === "-1") && (idParroquia === "-1") &&
            (institucion !== "-1") && (tipologia === "-1") && (estado === "-1")) {
        //alert("6");

        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleInstirucion/" + institucion;
                $.getJSON(datos, function(resultados) {
                    $(".loadingPag").css("display", "none");
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
                    var cabecera = "<table id='tabla9'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Provincia</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                            + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                    $('#tabla9').dataTable({
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": false,
                        "bAutoWidth": false});


                }).error(function() { /* assign handler */
                    /* alert(jqXHR.responseText) */
                    //alert("Ocurrio un error" + jqXHR.responseText);
                    $(".loadingPag").css("display", "none");
                    $("#errorLabel").css("display", "block");
                });
            }
        });
        //fin
    }

    //a nivel nacional por tipologia
    if ((idProvincia === "-1") && (idCanton === "-1") && (idParroquia === "-1") &&
            (institucion === "-1") && (tipologia !== "-1") && (estado === "-1")) {
        //alert("5");

        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleTipologia/5;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleTipologia/" + tipologia;
                $.getJSON(datos, function(resultados) {
                    $(".loadingPag").css("display", "none");
                    $("#provinciaTitulo").html("");
                    $("#cantonTitulo").html("");
                    $("#provinciaTitulo").html("Nivel");
                    //$("#cantonTitulo").html("Institucion");
                    $("#provincia").html("Nacional");
                    // $("#canton").html(resultados[0].entidadRequiriente);

                    //alert(resultados);
                    $('#tablaDetalleInfraestructuraEstadoObra').html("");

                    var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " </span></div>";

                    /*Se setea la cabecera*/
                    var cabecera = "<table id='tabla10'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Provincia</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                            + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                    $('#tabla10').dataTable({
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": false,
                        "bAutoWidth": false});


                }).error(function() { /* assign handler */
                    /* alert(jqXHR.responseText) */
                    //alert("Ocurrio un error" + jqXHR.responseText);
                    $(".loadingPag").css("display", "none");
                    $("#errorLabel").css("display", "block");
                });
            }
        });
        //fin
    }

    //a nivel nacional por tipologia y estado
    if ((idProvincia === "-1") && (idCanton === "-1") && (idParroquia === "-1") &&
            (institucion === "-1") && (tipologia !== "-1") && (estado !== "-1")) {
        //alert("55");
        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleTipologiaEstado/" + tipologia + "/" + estado;
                $.getJSON(datos, function(resultados) {
                    $(".loadingPag").css("display", "none");
                    $("#provinciaTitulo").html("");
                    $("#cantonTitulo").html("");
                    $("#provinciaTitulo").html("Nivel");
                    $("#provincia").html('Nacional');
                    //$("#cantonTitulo").html("Estado");
                    //$("#canton").html(resultados[0].estadoObra);

                    //alert(resultados);
                    $('#tablaDetalleInfraestructuraEstadoObra').html("");

                    var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) - " + resultados[0].tipoInfraestructura + " - " + resultados[0].estadoObra + " </span></div>";

                    /*Se setea la cabecera*/
                    var cabecera = "<table id='tabla11'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Provincia</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td>"
                            + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                    $('#tabla11').dataTable({
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": false,
                        "bAutoWidth": false});


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

    //a nivel nacional por estado
    if ((idProvincia === "-1") && (idCanton === "-1") && (idParroquia === "-1") && (institucion === "-1") && (tipologia === "-1") && (estado !== "-1")) {
        //alert("7");
        /*
         *Evento ajax para listar los sectores
         */
        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                //var cadena = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/detalleDPA/" + idProvincia + "/" + idCanton + "/" + idParroquia;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/detalleEstado/"+ estado;
                $.getJSON(datos, function(resultados) {
                    $(".loadingPag").css("display", "none");
                    $("#provinciaTitulo").html("");
                    $("#cantonTitulo").html("");
                    $("#provinciaTitulo").html("Nivel");
                    $("#provincia").html("Nacional");


                    //alert(resultados);
                    $('#tablaDetalleInfraestructuraEstadoObra').html("");

                    var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) </span></div>";

                    /*Se setea la cabecera*/
                    var cabecera = "<table id='tabla12'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Provincia</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td><td style=' text-align: center'><u>Entidad</u></td>"
                            + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                    $('#tabla12').dataTable({
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": false,
                        "bAutoWidth": false});

                }).error(function() { /* assign handler */
                    /* alert(jqXHR.responseText) */
                    //alert("Ocurrio un error" + jqXHR.responseText);
                    $(".loadingPag").css("display", "none");
                    $("#errorLabel").css("display", "block");
                });
            }
        });
        //fin
    }

    //total general a nivel nacional
    if ((idProvincia === "-1") && (idCanton === "-1") && (idParroquia === "-1") &&
            (institucion === "-1") && (tipologia === "-1") && (estado === "-1")) {
        //alert("8");
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
                    $(".loadingPag").css("display", "none");
                    $("#provinciaTitulo").html("");
                    $("#cantonTitulo").html("");
                    $("#provinciaTitulo").html("Nivel");
                    $("#provincia").html("Nacional");


                    //alert(resultados);
                    $('#tablaDetalleInfraestructuraEstadoObra').html("");

                    var titulo = "<div class='tituloTablas'>" + "<span> Infraestructura social emblemática (período 2007-2015) </span></div>";

                    /*Se setea la cabecera*/
                    var cabecera = "<table id='tabla12'><thead><tr><td style=' text-align: center'><u>N°</u></td><td style=' text-align: center'><u>Provincia</u></td><td style=' text-align: center'><u>Cantón</u></td><td style=' text-align: center'><u>Parroquia</u></td><td style=' text-align: center'><u>Entidad</u></td>"
                            + "<td style='text-align: center'><u>Tipología</u></td><td style=' text-align: center'><u>Categoria</u></td><td style=' text-align: center'><u>Capacidad</u></td><td style=' text-align: center'><u>Establecimiento</u></td><td style=' text-align: center'><u>Intervención</u></td><td style=' text-align: center'><u>Estado</u></td><td style=' text-align: center'><u>Ejecutor</u></td></tr></thead>";
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
                    $('#tabla12').dataTable({
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": false,
                        "bAutoWidth": false});

                }).error(function() { /* assign handler */
                    /* alert(jqXHR.responseText) */
                    //alert("Ocurrio un error" + jqXHR.responseText);
                    $(".loadingPag").css("display", "none");
                    $("#errorLabel").css("display", "block");
                });
            }
        });
        //fin

    }

}
//
ko.applyBindings(new ViewModelIndicador());
