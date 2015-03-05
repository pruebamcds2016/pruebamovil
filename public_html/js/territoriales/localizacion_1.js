/* 
 * Javascript localizacion
 * autor: @Adriana.Romero
 * 
 */

/*Declaracion de variables que se usaran en la carga del mapa*/
var mapa;
var lat = -0.20300087;
var lng = -78.4987696;

var cadena = "";
var estiloProvincia;
var control = 0;


/*Funcion init() ubicada en el Onload de la pagina*/
function init() {
    /**************************************************************/
    /*Se setean los parametros de presentacion de los componentes*/
    /*************************************************************/

    /*Se muestra la gráfica de "cargando"*/
    $(".loadingPag").css("display", "block");
    /*Se oculta la tabla de informacion territorial*/
    $(".infoTerritorial").css("display", "none");
    /*Se oculta la tabla donde se encuentra la informacion que muestra la ubicacion*/
    $(".infoUbicacion").css("display", "none");
    /*Se oculta el DIV donde aparece la ubicacion actual*/
    $("#labelUbicacion").css("display", "none");
    /*Se desactiva el combo de cantones hasta que se elija una provincia*/
    $('#cantonCombo').attr("disabled", true);
    /*Se desactiva el combo de parroquias hasta que se elija un canton*/
    $('#parroquiaCombo').attr("disabled", true);
    /*Se desactiva el boton de busqueda hasta que se elija un canton o parroquia*/

    $('input[type="submit"]').attr('disabled', 'disabled');


    /**********************************************/
    /*Ubicacion y mapa*/
    /**********************************************/

    /*Se declara una variable mapa donde se colocara la capa de OPENLAYERS desde el servidor del SIISE*/
    mapa = new OpenLayers.Map("miMapa");

    /*Se consulta el servico WMS desde el servidor del SIISE Mapas, el mapa se pintará a nivel de canton*/
    var layerBase = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://201.219.3.196:8079/geoserver/wms?service=WMS", {
        layers: "siise:cant_00"
    });
    /*Se añade la capa al mapa*/
    mapa.addLayer(layerBase);
    /*Se oculta el mapa hasta que se cargue toda la información*/
    $("#miMapa").css("display", "none");

//Recupera la posicion del dispositivo
    navigator.geolocation.getCurrentPosition(success, error);

    /*Si no se recuperan las coordenadas, se mostrará por defecto la localizacion de Quito*/
    if (!navigator.geolocation) {
        /*Se muestran lso div que contienen el nombre de la DPA*/
        $(".infoUbicacion").css("display", "block");
        $("#labelUbicacion").css("display", "block");

        /*Se setean por defecto las coordenadas de Quito*/
        lat = -0.20300087;
        lng = -78.4987696;
        /*Se crea una proyeccion con las coordenadas entregadas*/
        var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                mapa.getProjectionObject());
        mapa.setCenter(lnglat, 9);
        var markers = new OpenLayers.Layer.Markers("Marcas");
        mapa.addLayer(markers);

        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        /*Se añade el icono indicando el punto donde se encuentra*/
        var icon = new OpenLayers.Icon('puntero.png', size, offset);
        markers.addMarker(new OpenLayers.Marker(lnglat, icon));
        return;
    }

    /*Se dibuja el mapa de acuerdo a las coordenadas proporcionadas en el dispositivo*/

    function success(position) {

        /*Se muestran la leyendas de ubicacion*/
        $(".infoUbicacion").css("display", "block");
        $("#labelUbicacion").html("Usted se encuentra en:");
        $("#labelUbicacion").css("display", "block");

        /*Se toman las coordenadas*/
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                mapa.getProjectionObject());
        mapa.setCenter(lnglat, 9);
        var markers = new OpenLayers.Layer.Markers("Marcas");
        mapa.addLayer(markers);

        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('puntero.png', size, offset);
        markers.addMarker(new OpenLayers.Marker(lnglat, icon));
        ViewCombos();
    }
    ;
    /*Si hay un error de conexion o falla de datos de mostrara por defecto la ciudad de Quito*/
    function error() {
        $(".infoUbicacion").css("display", "block");
        $("#labelUbicacion").css("display", "block");
        lat = -0.20300087;
        lng = -78.4987696;
        var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                mapa.getProjectionObject());
        mapa.setCenter(lnglat, 9);
        var markers = new OpenLayers.Layer.Markers("Marcas");
        mapa.addLayer(markers);

        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('puntero.png', size, offset);
        markers.addMarker(new OpenLayers.Marker(lnglat, icon));
        ViewCombos();
    }
    ;

    /******************************************************************/
    /*Funcion Knockout.js para mostrar la informacion******************/
    /******************************************************************/
    function ViewCombos() {

        /*Se oculta la imagen de cargando se muestra el mapa*/
        $(".loadingPag").css("display", "none");
        $(".infoTerritorial").css("display", "block");
        $("#miMapa").css("display", "block");

        /*self es el objeto que se va a usar*/

        /*Se declaran las variables a usar en la carga de los combos de busqueda rapida*/
        var self = this;
        var serialProvinciaG;
        var serialCantonG;
        var banderaRedirigir;

        self.provincias = ko.observableArray();
        self.cantones = ko.observableArray();
        self.parroquias = ko.observableArray();
        self.provinciaSeleccionada = ko.observable();
        self.cantonSeleccionado = ko.observable();
        self.parrSeleccionada = ko.observable();


        /*Funcion ajax para llenar los combos de busqueda*/
        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                /*devuelve las provincias a nivel nacional*/
                var cadena = ipserver + "/SWSISEcuador/webresources/ridpa/provincias";
                /*Se almacena la cadena json en la variable result*/
                $.getJSON(cadena, function(result) {
                    /*Se recorre el arreglo*/
                    $.each(result, function() {
                        self.provincias.push({
                            serialPrv: this.codigo_provincia,
                            nombrePrv: this.nombre_provincia
                        });

                    });
                });
            }
        });

        /*Una vez seleccionada la provincia, su serial se almacena en serialProvincia y se realiza la consulta
         de los cantones correspondientes*/
        self.provinciaSeleccionada.subscribe(function(serialProvincia) {
            /*Se limpia el combo*/
            self.cantones([]);
            /*Funcion ajax para consultar cantones por provincia*/
            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/SWSISEcuador/webresources/ridpa/cantones/" + serialProvincia;
                    serialProvinciaG = serialProvincia;
                    $.getJSON(cadena, function(result) {
                        /*Se habilita el combo de cantones*/
                        $('#cantonCombo').attr("disabled", false);
                        $('#parroquiaCombo').attr("disabled", true);

                        $.each(result, function() {
                            self.cantones.push({
                                serialCiu: this.codigo_canton,
                                nombreCiu: this.nombre_canton
                            });

                        });
                    });

                }
            });

        });
        /*Una vez seleccionada el canton, su serial se almacena en serialCanton y se realiza la consulta
         de las parroquias correspondientes*/
        self.cantonSeleccionado.subscribe(function(serialCanton) {
            self.parroquias([]);

            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/SWSISEcuador/webresources/ridpa/parroquias/" + serialProvinciaG + "/" + serialCanton;

                    $.getJSON(cadena, function(result) {
                        serialCantonG = serialCanton;
                        banderaRedirigir = "cnsT2.html?" + serialProvinciaG + "&" + serialCanton + "&" + 0;

                        $('#parroquiaCombo').attr("disabled", false);
                        $('input[type="submit"]').removeAttr('disabled');
                        $.each(result, function() {
                            self.parroquias.push({
                                serialPar: this.codigo_parroquia,
                                nombrePar: this.nombre_parroquia
                            });

                        });
                    });

                }
            });

        });
        /*Una vez seleccionada la parroquia, su serial se almacena en serialParroquia y se realiza la consulta
         de las parroquias correspondientes*/
        self.parrSeleccionada.subscribe(function(serialParroquia) {
            banderaRedirigir = "cnsT3.html?" + serialProvinciaG + "&" + serialCantonG + "&" + serialParroquia;

        });
        /*Se asigna la variable a banderaRedirigir para que envie a otra pagina*/
        self.redirigir = function() {
            location.href = banderaRedirigir;
        };


        /************************************/
        /*Funcion para consultar indicadores*/
        /***********************************/

        /*Variables que se utilizan en las consultas*/
        var ipserver;
        var nombre_prv;
        var nombre_ciu;
        var codigo_prv;
        var codigo_ciu;

        /*Funcion ajax para consultar la DPA dadas las coordenadas */
        $.ajax({
            /*Se envia la consulta al servidor de mapas de SIISE*/
            url: "cadenaMapa.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                var cadena = ipserver + "/WSMapas/webresources/territorial/3/" + lng + "/" + lat;

                $.getJSON(cadena, function(result) {
                    var objeto = result[0];
                    nombre_prv = objeto[5];
                    nombre_ciu = objeto[3];
                    /*Se setea en los divs el nombre de el canton y parroquia*/
                    $("#provincia").html(nombre_prv);
                    $("#canton").html(nombre_ciu);

                    var prv = objeto[4];
                    var canton = objeto[2];
                    codigo_ciu = Number(canton.substring(2, 4));
                    codigo_prv = Number(prv);

                    //INFORMACION GENERAL

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaInformacionGeneral/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaInformacionGeneral/" + codigo_prv + "/" + codigo_ciu;
                            $.getJSON(datos, function(result1) {

                                /*Se arma la tabla dinámica */
                                $("#divInformacionGeneral").html("");
                                $.each(result1, function() {
                                    /*Se define la cabecera de la tabla*/
                                    var cabecera =
                                            "<table><thead><tr><th></th>"
                                            + "<th>" + nombre_prv + "</th><th>" + nombre_ciu + "</th></tr></thead>"
                                            + "<tbody>";
                                    var cuerpo = "";
                                    /*Se realiza un each recorriendo la lista de los indicadores*/
                                    $.each(this.lista, function() {
                                        cuerpo = cuerpo
                                                + "<tr>"
                                                + "<td style='text-align: left'>" + this.nombre_indicador + "</td>"
                                                + "<td>" + format(this.valor_indicador_provincia) + "</td>"
                                                + "<td>" + format(this.valor_indicador_canton) + "</td>"
                                                + "</tr>";
                                    });
                                    var pie = "</tbody></table>";
                                    var tabla = cabecera + cuerpo + pie;

                                    var titulo = "<div class='tituloTablas'>"
                                            + "<span>" + this.nombre_grupo + "</span></div>";
                                    var grafica = "";

                                    /*.append: muestra la tabla que se construyo*/
                                    $("#divInformacionGeneral").append(titulo + tabla + grafica);


                                });
                            });
                        }
                    });

                    //POBLACION POR CICLO DE VIDA

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaCicloVida/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaCicloVida/" + codigo_prv + "/" + codigo_ciu;

                            $.getJSON(datos, function(result1) {

                                /*Se arma la tabla dinámica */
                                $("#divCicloVida").html("");
                                $.each(result1, function() {
                                    /*Se define la cabecera de la tabla*/
                                    var cabecera =
                                            "<table><thead><tr><th></th>"
                                            + "<th>" + nombre_prv + "</th><th>" + nombre_ciu + "</th></tr></thead>"
                                            + "<tbody>";
                                    var cuerpo = "";
                                    /*Se realiza un each recorriendo la lista de los indicadores*/
                                    $.each(this.lista, function() {
                                        cuerpo = cuerpo
                                                + "<tr>"
                                                + "<td style='text-align: left'>" + this.nombre_indicador + "</td>"
                                                + "<td>" + format(this.valor_indicador_provincia) + "</td>"
                                                + "<td>" + format(this.valor_indicador_canton) + "</td>"
                                                + "</tr>";
                                    });
                                    var pie = "</tbody></table>";
                                    var tabla = cabecera + cuerpo + pie;

                                    var titulo = "<div class='tituloTablas'>"
                                            + "<span>" + this.nombre_grupo + "</span></div>";
                                    var grafica = "";
                                    // if (this.lista[0].serial_tema === 65) {


                                    // grafica = "<div id='divPoblacion'></div>";
                                    //}
                                    //if (this.lista[0].serial_tema === 67) {


                                    //grafica = "<div id='divVivienda'></div>";
                                    // }

                                    /*.append: muestra la tabla que se construyo*/
                                    $("#divCicloVida").append(titulo + tabla + grafica);


                                });
                            });
                        }
                    });

                    //INDICADORES GENERALES

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaIndicadorGeneral/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaIndicadorGeneral/" + codigo_prv + "/" + codigo_ciu;

                            $.getJSON(datos, function(result1) {

                                /*Se arma la tabla dinámica */
                                $("#divIndicadorGeneral").html("");
                                $.each(result1, function() {
                                    /*Se define la cabecera de la tabla*/
                                    var cabecera =
                                            "<table><thead><tr><th></th>"
                                            + "<th>" + nombre_prv + "</th><th>" + nombre_ciu + "</th></tr></thead>"
                                            + "<tbody>";
                                    var cuerpo = "";
                                    /*Se realiza un each recorriendo la lista de los indicadores*/
                                    $.each(this.lista, function() {
                                        cuerpo = cuerpo
                                                + "<tr>"
                                                + "<td style='text-align: left'>" + this.nombre_indicador + "</td>"
                                                + "<td>" + format(this.valor_indicador_provincia) + "</td>"
                                                + "<td>" + format(this.valor_indicador_canton) + "</td>"
                                                + "</tr>";
                                    });
                                    var pie = "</tbody></table>";
                                    var tabla = cabecera + cuerpo + pie;

                                    var titulo = "<div class='tituloTablas'>"
                                            + "<span>" + this.nombre_grupo + "</span></div>";
                                    var grafica = "";

                                    $("#divIndicadorGeneral").append(titulo + tabla + grafica);


                                });
                            });
                        }
                    });

                    /****************************************/
                    /*Funcion para consultar distribucion geografica*/
                    /****************************************/

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                            // var datos = ipserver + "/SWSISEcuador/webresources/distribucionGeografica/canton/17/1";
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/distribucionGeografica/provincia/" + codigo_prv;
                            var datos = ipserver + "/SWSISEcuador/webresources/distribucionGeografica/provincia/" + codigo_prv;

                            $.getJSON(datos, function(resultados) {

                                // alert(resultados);
                                $('#distribucionGeografica').html("");

                                var titulo = "<div class='tituloTablas'>"
                                        + "<span> Distribución geográfica (distritos por cantones) </span></div>";

                                /*Se setea la cabecera*/
                                var cabecera = "<table><thead><tr><td style=' text-align: center'><p>Distrito</p></td>\n\
                                <td style=' text-align: center'><p>Cantón</p></td>\n\
                                <td style=' text-align: center'><p>Personas</p></td></tr></thead>";


                                var cuerpo = "<tbody>";

                                //alert(resultados.length);
                                $.each(resultados, function() {
                                    /*Se agrupan las filas y las columnas para dar formato a la tabla*/
                                    cuerpo = cuerpo + "<td style=' text-align: center' rowspan='" + this.lista.length + "'>" + this.distrito + "</td>"
                                            + "<td style=' text-align: left'>" + this.lista[0].nombre + "</td>"
                                            + " <td style=' text-align: right'>" + this.lista[0].valor + "</td></tr>";
                                    for (var i = 1; i < this.lista.length; i++) {
                                        cuerpo = cuerpo
                                                + "<tr><td style=' text-align: left'>" + this.lista[i].nombre + "</td>"
                                                + " <td style=' text-align: right'>" + this.lista[i].valor + "</td></tr>";
                                    }
                                });
                                var pie = "</tbody></table>";

                                $('#distribucionGeografica').append(titulo + cabecera + cuerpo + pie);
                            });
                        }
                    });

                    /*************************************************/
                    /*Funcion para consultar Distribucion Poblacional*/
                    /*************************************************/

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                            // var datos = ipserver + "/SWSISEcuador/webresources/distribucionGeografica/canton/17/1";
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/distribucionPoblacional/canton/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/distribucionPoblacional/canton/" + codigo_prv + "/" + codigo_ciu;

                            $.getJSON(datos, function(resultados) {

                                // alert(resultados);
                                $('#distribucionPoblacional').html("");

                                var titulo = "<div class='tituloTablas'>"
                                        + "<span> Distribución poblacional (parroquias por cantón) </span></div>";

                                /*Se setea la cabecera*/
                                var cabecera = "<table><thead><tr><td style=' text-align: center'><p>Cantón</p></td>\n\
                                <td style=' text-align: center'><p>Poblacion</p></td></tr></thead>";

                                var cuerpo = "<tbody>";
                                //alert(resultados.length);
                                //alert(resultados[i].nombre);
                                for (var i = 0; i < resultados.length; i++) {

                                    cuerpo = cuerpo
                                            + "<tr><td style=' text-align: left'>" + resultados[i].nombre + "</td>"
                                            + " <td style=' text-align: right'>" + resultados[i].valor + "</td></tr>";

                                }
                                ;

                                var pie = "</tbody></table>";

                                $('#distribucionPoblacional').append(titulo + cabecera + cuerpo + pie);
                            });
                        }
                    });


                    /****************************************/
                    /*Funcion para consultar infraestructura*/
                    /****************************************/


                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                            //  var datos = ipserver + "/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;

                            $.getJSON(datos, function(resultados) {
                                $('#infraestructura').html("");

                                var titulo = "<div class='tituloTablas'>"
                                        + "<span> Infraestructura cantón " + resultados[0].dpa + "</span></div>";

                                /*Se setea la cabecera*/
                                var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>Ministerios</p></td>"
                                        + "<td colspan='2'style=' text-align: center'>Infraestructura actual</td></tr><tr><td style=' text-align: center'>Tipo</td>"
                                        + "<td style=' text-align: center'>Unidades</td></tr></thead>";

                                var cuerpo = "<tbody>";

                                // alert(resultados[0].canton);

                                $.each(resultados, function() {

                                    /*Se agrupan las filas y las columnas para dar formato a la tabla*/
                                    cuerpo = cuerpo + "<td style=' text-align: center' rowspan='" + this.lista.length + "'>" + this.institucion + "</td>"
                                            + "<td style=' text-align: left'>" + this.lista[0].nombre_infraestructura + "</td>"
                                            + " <td style=' text-align: right'>" + this.lista[0].valor + "</td></tr>";
                                    for (var i = 1; i < this.lista.length; i++) {
                                        cuerpo = cuerpo
                                                + "<tr><td style=' text-align: left'>" + this.lista[i].nombre_infraestructura + "</td>"
                                                + " <td style=' text-align: right'>" + this.lista[i].valor + "</td></tr>";
                                    }
                                });
                                var pie = "</tr></tbody></table>";

                                $('#infraestructura').append(titulo + cabecera + cuerpo + pie);
                            });
                        }
                    });

                    /****************************************/
                    /*Funcion para crear graficas Poblacion*/
                    /****************************************/

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                            //  var datos = ipserver + "/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaGraficaPoblacion/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaGraficaPoblacion/" + codigo_prv + "/" + codigo_ciu;


                            $.getJSON(datos, function(resultados) {
                                //  $('#container').html("");
                                //alert(resultados)
                                /*
                                 * Gráfico en HighCharts
                                 */
                                $('#divPoblacion').highcharts({
                                    chart: {
                                        type: 'column',
                                        style: {
                                            fontFamily: 'Helvetica' // default font

                                        }
                                    },
                                    title: {
                                        text: resultados.nombre_indicador
                                    },
                                    subtitle: {
                                        text: resultados.fuente_indicador + "/" + resultados.institucion_fuente
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    xAxis: {
                                        categories: resultados.valoresX_indicador,
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Porcentaje'
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            stacking: 'normal',
                                            dataLabels: {
                                                enabled: true,
                                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                                style: {
                                                    textShadow: '0 0 3px black, 0 0 3px black'
                                                }
                                            }
                                        }
                                    },
                                    series: []
                                });
                                // Creación dinámica de series
                                var chart = $('#divPoblacion').highcharts();
                                for (var i = 0; i < resultados.valoresY_indicador.length; i++) {
                                    var nombre = resultados.valoresY_indicador[i].name;
                                    chart.addSeries({
                                        name: nombre,
                                        data: resultados.valoresY_indicador[i].data

                                    });
                                }


                                chart.tooltip.refresh(chart.series[0].data[resultados.valoresX_indicador.length - 1]);


                            });



                        }});


                    /****************************************/
                    /*Funcion para crear graficas Vivienda*/
                    /****************************************/

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                            //  var datos = ipserver + "/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;
                            //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaGraficaVivienda/" + codigo_prv + "/" + codigo_ciu;
                            var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaGraficaVivienda/" + codigo_prv + "/" + codigo_ciu;
                            
                            $.getJSON(datos, function(resultados) {
                                // $('#graficaViviendas').html("");

                                /*
                                 * Gráfico en HighCharts
                                 */
                                $('#divVivienda').highcharts({
                                    chart: {
                                        type: 'column',
                                        style: {
                                            fontFamily: 'Helvetica' // default font

                                        }
                                    },
                                    title: {
                                        text: resultados.nombre_indicador
                                    },
                                    subtitle: {
                                        text: resultados.fuente_indicador + "/" + resultados.institucion_fuente
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    xAxis: {
                                        categories: resultados.valoresX_indicador,
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: 'Porcentaje'
                                        }
                                    },
                                    plotOptions: {
                                        column: {
                                            stacking: 'normal',
                                            dataLabels: {
                                                enabled: true,
                                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                                            }
                                        }
                                    },
                                    series: []
                                });
                                // Creación dinámica de series
                                var chart = $('#divVivienda').highcharts();
                                for (var i = 0; i < resultados.valoresY_indicador.length; i++) {
                                    var nombre = resultados.valoresY_indicador[i].name;
                                    chart.addSeries({
                                        name: nombre,
                                        data: resultados.valoresY_indicador[i].data

                                    });
                                }


                                chart.tooltip.refresh(chart.series[0].data[resultados.valoresX_indicador.length - 1]);



                            });

                        }});

                    /**fin**/


                });
            }
        });

    }
    /*Se inicializa knockout*/
    ko.applyBindings(new ViewCombos());

    /*
     * Funcion separador de miles y decimales
     */
    function format(numero, decimales, separador_decimal, separador_miles) {
        numero = parseFloat(numero);
        if (isNaN(numero)) {
            return "";
        }

        if (decimales !== undefined) {
            // Redondeamos
            numero = numero.toFixed(decimales);
        }

        // Convertimos el punto en separador_decimal
        numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ".");
        separador_miles = ",";
        if (separador_miles) {
            // Añadimos los separadores de miles
            var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
            while (miles.test(numero)) {
                numero = numero.replace(miles, "$1" + separador_miles + "$2");
            }
        }

        return numero;
    }
    ;
}





