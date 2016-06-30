/* 
 * Javascript localizacion
 * autor: @Adriana.Romero
 * 
 */

/*Declaracion de variables que se usaran en la carga del mapa*/
var mapa;


var cadena = "";
var estiloProvincia;
var control = 0;
var viviendas;
var obrasNacional;
var obrasCantonal;
var obrasParroquial;
var divGrafica;



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
    /*var layerBase = new OpenLayers.Layer.WMS(
     "OpenLayers WMS",
     "http://201.219.3.196:8079/geoserver/wms?service=WMS", {
     layers: "siise:cant_00"
     });*/

    //var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
    var apiKey = "ApzF8URqpsJu0SQpIv9mBKa26rBDJmbg-YrYQmZn_rbmXKwSqpoUhGLV9lFH3nNy";//key de bing


    layerBase = new OpenLayers.Layer.Bing({
        name: "Calles",
        key: apiKey,
        type: "Road",
        visibility: true,
        displayInLayerSwitcher: true
    });

    /*Se añade la capa al mapa*/
    mapa.addLayer(layerBase);
    /*Se oculta el mapa hasta que se cargue toda la información*/
    $("#miMapa").css("display", "none");



    /******************************************************************/
    /*Funcion Knockout.js para mostrar la informacion******************/
    /******************************************************************/
    function ViewCombos() {

        /*Variables que se utilizan en las consultas*/
        var ipserver;
        var codigo_prv;
        var nombre_prv;

        var codigo_ciu;
        var nombre_ciu;

        var codigo_par;
        var nombre_par;



        if (location.search.substr(1)) {
            Variable = location.search.substr(1);
            var elem = Variable.split('&');
            codigo_prv = elem[0];
            codigo_ciu = elem[1];
            codigo_par = elem[2];

        }

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

        /*if (codigo_prv.length === 1) {
         codigo_prv1 = "0" + codigo_prv;
         } else {
         codigo_prv1 = codigo_prv;
         }
         
         if (codigo_ciu.length === 3) {
         codigo_ciu1 = "0" + codigo_ciu;
         
         } else {
         codigo_ciu1 = codigo_ciu;
         }
         
         if (codigo_par.length === 5) {
         codigo_par1 = "0" + codigo_par;
         
         } else {
         codigo_par1 = codigo_par;
         }*/
        if (codigo_prv.length === 1) {
            codigo_prv1 = "0" + codigo_prv;
        } else {
            codigo_prv1 = codigo_prv;
        }

        if (codigo_ciu.length === 1) {
            codigo_ciu1 = "0" + codigo_ciu;
            codigo_ciu1 = codigo_prv1 + codigo_ciu1;
        } else {
            codigo_ciu1 = codigo_prv1 + codigo_ciu;
        }

        codigo_par1 = codigo_ciu1 + codigo_par;


        $.ajax({
            url: "cadenaMapa.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                var cadena = ipserver + "/WSMapas/webresources/territorial/parr/" + codigo_prv1 + "/" + codigo_ciu1 + "/" + codigo_par1;

                $.getJSON(cadena, function(result) {
                    var consulta = result[0];
                    //split
                    var char = consulta[6].split("(");

                    var coordenadas = char[1].split(")");
                    var latlng = coordenadas[0].split(" ");
                    lng = latlng[0];
                    lat = latlng[1];
                    var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            mapa.getProjectionObject());
                    mapa.setCenter(lnglat, 11);


                    var markers = new OpenLayers.Layer.Markers("Marcas");
                    mapa.addLayer(markers);

                    var size = new OpenLayers.Size(21, 25);
                    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                    var icon = new OpenLayers.Icon('puntero.png', size, offset);


                    markers.addMarker(new OpenLayers.Marker(lnglat, icon));
                });
            }
        });


        /************************************/
        /*Funcion para consultar la provincia y el canton*/
        /***********************************/

        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                //var datos = ipserver + "/SWSISEcuador/webresources/territorial/consulta/" + codigo_prv + "/" + codigo_ciu;
                //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/dpaConsulta/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;
                var datos = ipserver + "/SWSISEcuador/webresources/territorial/dpaConsulta/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;

                $.getJSON(datos, function(result1) {

                    //nombre_prv = result1.nombre_provincia;
                    nombre_ciu = result1.nombre_canton;
                    nombre_par = result1.nombre_parroquia;
                    //$(".canton").html(nombre_ciu);
                    //$(".parroquia").html(nombre_par);
                    $("#provincia").html("Usted se encuentra en: " + nombre_ciu + " - " + nombre_par);
                });

                $("#labelUbicacion").html('La ubicación seleccionada es: &nbsp;');

                $(".infoUbicacion").css("display", "block");
                $("#labelUbicacion").css("display", "block");
            }
        });

        //INFORMACION GENERAL

        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaInformacionGeneral/" + codigo_prv + "/" + codigo_ciu;
                var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaInformacionGeneral/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;
                $.getJSON(datos, function(result1) {

                    /*Se arma la tabla dinámica */
                    $("#divInformacionGeneral").html("");
                    $.each(result1, function() {
                        /*Se define la cabecera de la tabla*/
                        var cabecera =
                                "<table><thead><tr><th></th>"
                                + "<th>" + nombre_ciu + "</th><th>" + nombre_par + "</th></tr></thead>"
                                + "<tbody>";
                        var cuerpo = "";
                        /*Se realiza un each recorriendo la lista de los indicadores*/
                        $.each(this.lista, function() {
                            cuerpo = cuerpo
                                    + "<tr>"
                                    + "<td style='text-align: left'>" + this.nombre_indicador + "</td>"
                                    + "<td>" + format(this.valor_indicador_canton) + "</td>"
                                    + "<td>" + format(this.valor_indicador_parroquia) + "</td>"
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
                var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaGraficaPoblacion/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;
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
                            categories: resultados.valoresX_indicador
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



        //Población por ciclo de vida
        $("#moreCicloVida").css("display", "none");
        $("#menosCicloVida").click(function(event) {
            $("#menosCicloVida").hide();
            $("#moreCicloVida").show();
            $("#divCicloVida").hide();
            event.preventDefault();
        });

        $("#moreCicloVida").click(function(event) {
            $("#menosCicloVida").show();
            $("#moreCicloVida").hide();
            $("#divCicloVida").show();
            event.preventDefault();
        });
        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaCicloVida/" + codigo_prv + "/" + codigo_ciu;
                var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaCicloVida/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;

                $.getJSON(datos, function(result1) {

                    /*Se arma la tabla dinámica */
                    $("#divCicloVida").html("");
                    $.each(result1, function() {

                        /*Se define la cabecera de la tabla*/
                        var cabecera =
                                "<table><thead><tr><th></th>"
                                + "<th>" + nombre_ciu + "</th><th>" + nombre_par + "</th></tr></thead>"
                                + "<tbody>";

                        var cuerpo = "";
                        /*Se realiza un each recorriendo la lista de los indicadores*/
                        $.each(this.lista, function() {
                            cuerpo = cuerpo
                                    + "<tr>"
                                    + "<td style='text-align: left'>" + this.nombre_indicador + "</td>"
                                    + "<td>" + format(this.valor_indicador_canton) + "</td>"
                                    + "<td>" + format(this.valor_indicador_parroquia) + "</td>"
                                    + "</tr>";
                        });
                        var pie = "</tbody></table>";
                        var tabla = cabecera + cuerpo + pie;

                        var titulo = "<div class='tituloTablas'>"
                                + "<span>" + this.nombre_grupo + "</span></div>";

                        var tituloMenos = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  " + this.nombre_grupo + "</font></a></span></div>";

                        var tituloMore = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp; " + this.nombre_grupo + "</font></a></span></div>";

                        $('#menosCicloVida').html(tituloMenos);
                        $('#moreCicloVida').html(tituloMore);
                        /*.append: muestra la tabla que se construyo*/
                        $("#divCicloVida").append(tabla);


                    });
                });
            }
        });

        //Indicadores Generales
        $("#moreIndicadorGeneral").css("display", "none");
        $("#menosIndicadorGeneral").click(function(event) {
            $("#menosIndicadorGeneral").hide();
            $("#moreIndicadorGeneral").show();
            $("#todoIndicadorGeneral").hide();
            event.preventDefault();
        });

        $("#moreIndicadorGeneral").click(function(event) {
            $("#menosIndicadorGeneral").show();
            $("#moreIndicadorGeneral").hide();
            $("#todoIndicadorGeneral").show();
            event.preventDefault();
        });

        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                //var datos = "http://localhost:8080/SWSISEcuador/webresources/territorial/consultaIndicadorGeneral/" + codigo_prv + "/" + codigo_ciu;
                var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaIndicadorGeneral/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;
                ;

                $.getJSON(datos, function(result1) {

                    /*Se arma la tabla dinámica */
                    $("#divIndicadorGeneral").html("");
                    $.each(result1, function() {
                        /*Se define la cabecera de la tabla*/
                        var cabecera =
                                "<table><thead><tr><th></th>"
                                + "<th>" + nombre_ciu + "</th><th>" + nombre_par + "</th></tr></thead>"
                                + "<tbody>";
                        var cuerpo = "";
                        /*Se realiza un each recorriendo la lista de los indicadores*/
                        $.each(this.lista, function() {
                            cuerpo = cuerpo
                                    + "<tr>"
                                    + "<td style='text-align: left'>" + this.nombre_indicador + "</td>"
                                    + "<td>" + format(this.valor_indicador_canton) + "</td>"
                                    + "<td>" + format(this.valor_indicador_parroquia) + "</td>"
                                    + "</tr>";
                        });
                        var pie = "</tbody></table>";
                        var tabla = cabecera + cuerpo + pie;

                        var titulo = "<div class='tituloTablas'>"
                                + "<span>" + this.nombre_grupo + "</span></div>";

                        var tituloMenos = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  " + this.nombre_grupo + "</font></a></span></div>";

                        var tituloMore = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp; " + this.nombre_grupo + "</font></a></span></div>";

                        $('#menosIndicadorGeneral').html(tituloMenos);
                        $('#moreIndicadorGeneral').html(tituloMore);

                        $("#divIndicadorGeneral").append(tabla);


                    });
                });
            }
        });


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
                var datos = ipserver + "/SWSISEcuador/webresources/territorial/consultaGraficaVivienda/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;

                $.getJSON(datos, function(resultados) {

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



        /****************************************/
        /*Funcion para consultar distribucion geografica*/
        /****************************************/
        $("#moreDistribucionGeografica").css("display", "none");
        $("#menosDistribucionGeografica").click(function(event) {
            $("#menosDistribucionGeografica").hide();
            $("#moreDistribucionGeografica").show();
            $("#distribucionGeografica").hide();
            event.preventDefault();
        });

        $("#moreDistribucionGeografica").click(function(event) {
            $("#menosDistribucionGeografica").show();
            $("#moreDistribucionGeografica").hide();
            $("#distribucionGeografica").show();
            event.preventDefault();
        });
        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                // var datos = ipserver + "/SWSISEcuador/webresources/distribucionGeografica/canton/17/1";
                //var datos = "http://localhost:8080/SWSISEcuador/webresources/distribucionGeografica/provincia/" + codigo_prv;
                var datos = ipserver + "/SWSISEcuador/webresources/distribucionGeografica/parroquia/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;

                $.getJSON(datos, function(resultados) {

                    // alert(resultados);
                    $('#distribucionGeografica').html("");

                    var titulo = "<div class='tituloTablas'>"
                            + "<span> Distribución geográfica (distritos por cantones) </span></div>";

                    var tituloMenos = "<div class='tituloTablas'>"
                            + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp; Distribución geográfica (distritos por cantones) </font></a></span></div>";

                    var tituloMore = "<div class='tituloTablas'>"
                            + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp; Distribución geográfica (distritos por cantones)</font></a></span></div>";

                    $('#menosDistribucionGeografica').html(tituloMenos);
                    $('#moreDistribucionGeografica').html(tituloMore);

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
                                + " <td style=' text-align: right'>" + format(this.lista[0].valor) + "</td></tr>";
                        for (var i = 1; i < this.lista.length; i++) {
                            cuerpo = cuerpo
                                    + "<tr><td style=' text-align: left'>" + this.lista[i].nombre + "</td>"
                                    + " <td style=' text-align: right'>" + format(this.lista[i].valor) + "</td></tr>";
                        }
                    });
                    var pie = "</tbody></table>";

                    $('#distribucionGeografica').append(cabecera + cuerpo + pie);
                });
            }
        });

        /*************************************************/
        /*Funcion para consultar Distribucion Poblacional*/
        /*************************************************/
        /*
         $.ajax({
         url: "cadena.txt",
         dataType: "text",
         success: function(data) {
         ipserver = data;
         //Se realiza la consulta a nivel de canton y con la informacion se arma la tabla
         // var datos = ipserver + "/SWSISEcuador/webresources/distribucionGeografica/canton/17/1";
         var datos = "http://localhost:8080/SWSISEcuador/webresources/distribucionPoblacional/parroquia/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;
         ;
         
         $.getJSON(datos, function(resultados) {
         
         // alert(resultados);
         $('#distribucionPoblacional').html("");
         
         var titulo = "<div class='tituloTablas'>"
         + "<span> Distribución poblacional (parroquias por cantón) </span></div>";
         
         //*Se setea la cabecera
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
         });*/


        /****************************************/
        /*Funcion para consultar infraestructura*/
        /****************************************/
        $("#moreInfraestructura").css("display", "none");
        $("#menosInfraestructura").click(function(event) {
            $("#menosInfraestructura").hide();
            $("#moreInfraestructura").show();
            $("#infraestructura").hide();
            event.preventDefault();
        });

        $("#moreInfraestructura").click(function(event) {
            $("#menosInfraestructura").show();
            $("#moreInfraestructura").hide();
            $("#infraestructura").show();
            event.preventDefault();
        });

        $.ajax({
            url: "cadena.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                //  var datos = ipserver + "/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;
                //var datos = "http://localhost:8080/SWSISEcuador/webresources/infraestructura/canton/" + codigo_prv + "/" + codigo_ciu;
                var datos = ipserver + "/SWSISEcuador/webresources/infraestructura/parroquia/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;

                $.getJSON(datos, function(resultados) {
                    $('#infraestructura').html("");

                    var titulo = "<div class='tituloTablas'>"
                            + "<span> Oferta de Servicios parroquia " + resultados[0].dpa + "</span></div>";

                    var tituloMenos = "<div class='tituloTablas'>"
                            + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp; Oferta de Servicios parroquia " + resultados[0].dpa + "</font></a></span></div>";

                    var tituloMore = "<div class='tituloTablas'>"
                            + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp; Oferta de Servicios parroquia " + resultados[0].dpa + "</font></a></span></div>";

                    $('#menosInfraestructura').html(tituloMenos);
                    $('#moreInfraestructura').html(tituloMore);


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

                    $('#infraestructura').append(cabecera + cuerpo + pie);
                });
            }
        });




        //para consultar en la base de datos de observatorio se requiere que sea string provincia = 17 y canton = 05
        var codigoProvincia;
        var codigoCanton;
        var codigoParroquia;
        if (codigo_prv.length === 1) {
            codigoProvincia = "0" + codigo_prv;
        } else {
            codigoProvincia = codigo_prv;
        }
        //alert(String(codigo_ciu));
        if (codigo_ciu.length === 1) {
            codigoCanton = "0" + codigo_ciu;
            //alert("ok")
            //codigo_ciu1 = codigo_prv1 + codigo_ciu1;
        } else {
            codigoCanton = codigo_ciu;
            //alert("else");
        }

        if (codigo_par.length === 1) {
            codigoParroquia = "0" + codigo_par;
            //alert("ok")
            //codigo_ciu1 = codigo_prv1 + codigo_ciu1;
        } else {
            codigoParroquia = codigo_par;
            //alert("else");
        }

        /****************************************/
        /*Funcion para crear tabla Infraestru ctura NUEVA obras del sector Nacional*/
        /****************************************/
        $("#moreInfraestructuraNueva").css("display", "none");
        $("#menosInfraestructuraNueva").click(function(event) {
            $("#menosInfraestructuraNueva").hide();
            $("#moreInfraestructuraNueva").show();
            $("#todoInfraestructuraNueva").hide();
            event.preventDefault();
        });

        $("#moreInfraestructuraNueva").click(function(event) {
            $("#menosInfraestructuraNueva").show();
            $("#moreInfraestructuraNueva").hide();
            $("#todoInfraestructuraNueva").show();
            event.preventDefault();
        });
        //inicio con hipervinculos
        /*$.ajax({
         url: "cadenaInfraestructura.txt",
         dataType: "text",
         success: function(data) {
         //Se realiza la consulta a nivel de canton y con la informacion se arma la tabla
         //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia;
         ipserver = data;
         var datos = ipserver + "/WSObservatorio/webresources/infraestructura/obras";
         $.getJSON(datos, function(resultados) {
         if (resultados.valoresYIndicador.length > 0) {
         obrasNacional = resultados;
         $('#tablaInfraestructuraNueva').html("");
         
         var titulo = "Infraestructura Social Emblemática Nacional (período 2007-2015)";
         var tituloMenos = "<div class='tituloTablas'>"
         + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  Infraestructura Social Emblemática Nacional (período 2007-2015) - MCDS</font></a></span></div>";
         
         var tituloMore = "<div class='tituloTablas'>"
         + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp; Infraestructura Social Emblemática Nacional (período 2007-2015) - MCDS</font></a></span></div>";
         
         $('#menosInfraestructuraNueva').html(tituloMenos);
         $('#moreInfraestructuraNueva').html(tituloMore);
         //Se setea la cabecera
         var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>SECTOR</p></td><td style=' text-align: center' rowspan='2'><p>TIPOLOGIA</p></td>"
         + "<td colspan='" + (resultados.valoresYIndicador.length + 1) + "'style=' text-align: center'>ESTADO DE LA OBRA</td></tr><tr>";
         
         for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
         var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
         if (codigo !== 1) {
         cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
         }
         }
         cabecera = cabecera + "<td style=' text-align: center'>TOTAL</td>";
         //completa la cabecera con la columna planificada
         for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
         var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
         if (codigo === 1) {
         cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
         }
         }
         cabecera = cabecera + "</tr></thead>";
         var cuerpo = "<tbody>";
         //datos del estado de la obra por institucion
         var i = 0;
         //alert(resultados.listaSectores[0].totalTipologiaXSector);
         for (var k = 0; k < resultados.listaSectores.length; k++) {
         
         cuerpo = cuerpo + "<tr><td style=' text-align: left' rowspan=" + resultados.listaSectores[k].totalTipologiaXSector + "><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.listaSectores[k].idSector + "&" + "-1" + "&" + "-1" + ">" + resultados.listaSectores[k].sector + "</a></td>"
         var cont = 0;
         //alert(resultados.listaSectores[k].totalTipologiaXSector);
         while (cont < parseInt(resultados.listaSectores[k].totalTipologiaXSector)) {
         if (cont === 0) {
         cuerpo = cuerpo + "<td style=' text-align: left'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + resultados.valoresXClaveValor[i].valor + "</a></td>";
         } else {
         cuerpo = cuerpo + "<tr><td style=' text-align: left'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + resultados.valoresXClaveValor[i].valor + "</a></td>";
         }
         
         var sum = 0;
         //alert(resultados.valoresYIndicador[0].codigo );
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo !== 1) {
         //alert(resultados.valoresYIndicador[j].codigo );
         if (resultados.valoresYIndicador[j].data[i] !== null) {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + resultados.valoresYIndicador[j].codigo + ">" + resultados.valoresYIndicador[j].data[i] + "</a></td>"
         //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
         sum = sum + resultados.valoresYIndicador[j].data[i];
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
         }
         }
         }
         if (sum === 0) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + " </td>"
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + sum + "</a></td>";
         }
         
         
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo === 1) {
         if (resultados.valoresYIndicador[j].data[i] !== null) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
         //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
         //sum = sum + resultados.valoresYIndicador[j].data[i];
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
         }
         }
         }
         cuerpo = cuerpo + "</tr>";
         i++;
         cont++;
         }
         }
         
         
         // Obtener los totales generales
         cuerpo = cuerpo + "<tr><td style=' text-align: left' colspan='2'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1>Total General</a></td>";
         //alert(resultados.valoresYIndicador[0].data.length)
         var totalGeneral = 0;
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var totalColumna = 0;
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo !== 1) {
         for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
         if (resultados.valoresYIndicador[j].data[h] !== null) {
         totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
         totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
         }
         }
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresYIndicador[j].codigo + ">" + totalColumna + "</a></td>"
         }
         }
         if (totalGeneral === 0) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1>" + totalGeneral + "</a></td>";
         }
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var totalColumna = 0;
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo === 1) {
         for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
         if (resultados.valoresYIndicador[j].data[h] !== null) {
         totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
         totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
         }
         }
         cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>"
         }
         }
         
         cuerpo = cuerpo + "</tr>";
         var pie = "</tbody></table>";
         
         $('#tablaInfraestructuraNueva').append(cabecera + cuerpo + pie);
         //$('#tablaInfraestructuraNueva').append(titulo + cabecera + cuerpo + pie);
         
         //grafica de barras
         //divGrafica = '#graficoInfraestructuraNueva';
         //graficar(obrasNacional, divGrafica, titulo);
         
         //grafica de pastel
         divGraficaPie = '#graficoPieInfraestructuraNueva';
         graficarPastel(obrasNacional, divGraficaPie, titulo);
         
         }
         });
         }});*/
        //fin con hipervinculos

        //inicio sin hipervinculos
        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/obras";
                $.getJSON(datos, function(resultados) {
                    if (resultados.valoresYIndicador.length > 0) {
                        obrasNacional = resultados;
                        $('#tablaInfraestructuraNueva').html("");

                        var titulo = "Infraestructura Social Emblemática Nacional (período 2007-2015)";
                        var tituloMenos = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  Infraestructura Social Emblemática Nacional (período 2007-2015) - MCDS</font></a></span></div>";

                        var tituloMore = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp; Infraestructura Social Emblemática Nacional (período 2007-2015) - MCDS</font></a></span></div>";

                        $('#menosInfraestructuraNueva').html(tituloMenos);
                        $('#moreInfraestructuraNueva').html(tituloMore);
                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>SECTOR</p></td><td style=' text-align: center' rowspan='2'><p>TIPOLOGIA</p></td>"
                                + "<td colspan='" + (resultados.valoresYIndicador.length + 1) + "'style=' text-align: center'>ESTADO DE LA OBRA</td></tr><tr>";

                        for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                            var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
                            if (codigo !== 1) {
                                cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
                            }
                        }
                        cabecera = cabecera + "<td style=' text-align: center'>TOTAL</td>";
                        //completa la cabecera con la columna planificada
                        for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                            var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
                            if (codigo === 1) {
                                cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
                            }
                        }
                        cabecera = cabecera + "</tr></thead>";
                        var cuerpo = "<tbody>";
                        //datos del estado de la obra por institucion
                        var i = 0;
                        //alert(resultados.listaSectores[0].totalTipologiaXSector);
                        for (var k = 0; k < resultados.listaSectores.length; k++) {

                            cuerpo = cuerpo + "<tr><td style=' text-align: left' rowspan=" + resultados.listaSectores[k].totalTipologiaXSector + ">" + resultados.listaSectores[k].sector + "</td>";
                            var cont = 0;
                            //alert(resultados.listaSectores[k].totalTipologiaXSector);
                            while (cont < parseInt(resultados.listaSectores[k].totalTipologiaXSector)) {
                                if (cont === 0) {
                                    cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresXClaveValor[i].valor + "</td>";
                                } else {
                                    cuerpo = cuerpo + "<tr><td style=' text-align: left'>" + resultados.valoresXClaveValor[i].valor + "</td>";
                                }

                                var sum = 0;
                                //alert(resultados.valoresYIndicador[0].codigo );
                                for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                                    var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                                    if (codigo !== 1) {
                                        //alert(resultados.valoresYIndicador[j].codigo );
                                        if (resultados.valoresYIndicador[j].data[i] !== null) {
                                            cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
                                            //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
                                            sum = sum + resultados.valoresYIndicador[j].data[i];
                                        } else {
                                            cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
                                        }
                                    }
                                }
                                if (sum === 0) {
                                    cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + " </td>";
                                } else {
                                    cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + "</td>";
                                }


                                for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                                    var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                                    if (codigo === 1) {
                                        if (resultados.valoresYIndicador[j].data[i] !== null) {
                                            cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
                                            //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
                                            //sum = sum + resultados.valoresYIndicador[j].data[i];
                                        } else {
                                            cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
                                        }
                                    }
                                }
                                cuerpo = cuerpo + "</tr>";
                                i++;
                                cont++;
                            }
                        }


                        // Obtener los totales generales
                        cuerpo = cuerpo + "<tr><td style=' text-align: left' colspan='2'>Total General</td>";
                        //alert(resultados.valoresYIndicador[0].data.length)
                        var totalGeneral = 0;
                        for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                            var totalColumna = 0;
                            var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                            if (codigo !== 1) {
                                for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
                                    if (resultados.valoresYIndicador[j].data[h] !== null) {
                                        totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
                                        totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
                                    }
                                }
                                cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>";
                            }
                        }
                        if (totalGeneral === 0) {
                            cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
                        } else {
                            cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
                        }
                        for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                            var totalColumna = 0;
                            var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                            if (codigo === 1) {
                                for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
                                    if (resultados.valoresYIndicador[j].data[h] !== null) {
                                        totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
                                        totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
                                    }
                                }
                                cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>";
                            }
                        }

                        cuerpo = cuerpo + "</tr>";
                        var pie = "</tbody></table>";

                        $('#tablaInfraestructuraNueva').append(cabecera + cuerpo + pie);
                        //$('#tablaInfraestructuraNueva').append(titulo + cabecera + cuerpo + pie);

                        //grafica de barras
                        //divGrafica = '#graficoInfraestructuraNueva';
                        //graficar(obrasNacional, divGrafica, titulo);

                        //grafica de pastel
                        divGraficaPie = '#graficoPieInfraestructuraNueva';
                        graficarPastel(obrasNacional, divGraficaPie, titulo);

                    }
                });
            }});
        //fin sin hipervinculos

        /****************************************/
        /*Funcion para crear tabla Infraestructura nueva obras del sector  PROVINCIA CANTON*/
        /****************************************/
        $("#moreInfraestructuraNuevaProvinciaCanton").css("display", "none");
        $("#menosInfraestructuraNuevaProvinciaCanton").click(function(event) {
            $("#menosInfraestructuraNuevaProvinciaCanton").hide();
            $("#moreInfraestructuraNuevaProvinciaCanton").show();
            $("#todoInfraestructuraNuevaProvinciaCanton").hide();
            event.preventDefault();
        });

        $("#moreInfraestructuraNuevaProvinciaCanton").click(function(event) {
            $("#menosInfraestructuraNuevaProvinciaCanton").show();
            $("#moreInfraestructuraNuevaProvinciaCanton").hide();
            $("#todoInfraestructuraNuevaProvinciaCanton").show();
            event.preventDefault();
        });
        //inicio con hipervinculos
        /*$.ajax({
         url: "cadenaInfraestructura.txt",
         dataType: "text",
         success: function(data) {
         //Se realiza la consulta a nivel de canton y con la informacion se arma la tabla
         //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia;
         ipserver = data;
         var datos = ipserver + "/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia + "/" + codigoCanton;
         //alert(datos);
         $.getJSON(datos, function(resultados) {
         //alert(resultados.valoresYIndicador.length);
         if (resultados.valoresYIndicador.length > 0) {
         obrasCantonal = resultados;
         //alert(resultados);
         $('#tablaInfraestructuraNuevaProvinciaCanton').html("");
         
         var titulo = "<div class='tituloTablas'>"
         + "<span> Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015)</span></div>";
         
         var tituloMenos = "<div class='tituloTablas'>"
         + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";
         
         var tituloMore = "<div class='tituloTablas'>"
         + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";
         
         $('#menosInfraestructuraNuevaProvinciaCanton').html(tituloMenos);
         $('#moreInfraestructuraNuevaProvinciaCanton').html(tituloMore);
         //Se setea la cabecera
         var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>SECTOR</p></td><td style=' text-align: center' rowspan='2'><p>TIPOLOGIA</p></td>"
         + "<td colspan='" + (resultados.valoresYIndicador.length + 1) + "'style=' text-align: center'>ESTADO DE LA OBRA</td></tr><tr>";
         
         for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
         var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
         if (codigo !== 1) {
         cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
         }
         }
         cabecera = cabecera + "<td style=' text-align: center'>TOTAL</td>";
         //completa la cabecera con la columna planificada
         for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
         var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
         if (codigo === 1) {
         cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
         }
         }
         cabecera = cabecera + "</tr></thead>";
         var cuerpo = "<tbody>";
         //datos del estado de la obra por institucion
         var i = 0;
         //alert(resultados.listaSectores[0].totalTipologiaXSector);
         for (var k = 0; k < resultados.listaSectores.length; k++) {
         
         cuerpo = cuerpo + "<tr><td style=' text-align: left' rowspan=" + resultados.listaSectores[k].totalTipologiaXSector + "><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + resultados.listaSectores[k].idSector + "&" + "-1" + "&" + "-1" + ">" + resultados.listaSectores[k].sector + "</a></td>"
         var cont = 0;
         //alert(resultados.listaSectores[k].totalTipologiaXSector);
         while (cont < parseInt(resultados.listaSectores[k].totalTipologiaXSector)) {
         if (cont === 0) {
         cuerpo = cuerpo + "<td style=' text-align: left'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + resultados.valoresXClaveValor[i].valor + "</a></td>";
         } else {
         cuerpo = cuerpo + "<tr><td style=' text-align: left'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + resultados.valoresXClaveValor[i].valor + "</a></td>";
         }
         
         var sum = 0;
         //alert(resultados.valoresYIndicador[0].codigo );
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo !== 1) {
         //alert(resultados.valoresYIndicador[j].codigo );
         if (resultados.valoresYIndicador[j].data[i] !== null) {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + resultados.valoresYIndicador[j].codigo + ">" + resultados.valoresYIndicador[j].data[i] + "</a></td>"
         //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
         sum = sum + resultados.valoresYIndicador[j].data[i];
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
         }
         }
         }
         if (sum === 0) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + " </td>"
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + sum + "</a></td>";
         }
         
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo === 1) {
         if (resultados.valoresYIndicador[j].data[i] !== null) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
         //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
         //sum = sum + resultados.valoresYIndicador[j].data[i];
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> </td>"
         }
         }
         }
         cuerpo = cuerpo + "</tr>";
         i++;
         cont++;
         }
         }
         
         
         // Obtener los totales generales
         cuerpo = cuerpo + "<tr><td style=' text-align: left' colspan='2'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1>Total General</td></a>";
         //alert(resultados.valoresYIndicador[0].data.length)
         var totalGeneral = 0;
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var totalColumna = 0;
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo !== 1) {
         for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
         if (resultados.valoresYIndicador[j].data[h] !== null) {
         totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
         totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
         }
         }
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresYIndicador[j].codigo + ">" + totalColumna + "</a></td>"
         }
         }
         if (totalGeneral === 0) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> <a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + "-1" + "&" + "-1" + "&" + "-1>" + totalGeneral + "</a></td>";
         }
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var totalColumna = 0;
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo === 1) {
         for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
         if (resultados.valoresYIndicador[j].data[h] !== null) {
         totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
         totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
         }
         }
         cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>"
         }
         }
         
         cuerpo = cuerpo + "</tr>";
         var pie = "</tbody></table>";
         
         $('#tablaInfraestructuraNuevaProvinciaCanton').append(cabecera + cuerpo + pie);
         //$('#tablaInfraestructuraNueva').append(titulo + cabecera + cuerpo + pie);
         
         //grafica de barras
         //divGrafica = '#graficoInfraestructuraNuevaProvinciaCanton';
         //graficar(obrasCantonal, divGrafica, titulo);
         
         //grafica de pastel
         divGraficaPie = '#graficoPieInfraestructuraNuevaProvinciaCanton';
         graficarPastel(obrasCantonal, divGraficaPie, titulo);
         
         }
         });
         }});*/
        //fin con hipervinculos

        //inicio sin hipervinculos
        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia + "/" + codigoCanton;
                //alert(datos);
                $.getJSON(datos, function(resultados) {
                    //alert(resultados.valoresYIndicador.length);
                    if (resultados.valoresYIndicador.length > 0) {
                        obrasCantonal = resultados;
                        //alert(resultados);
                        $('#tablaInfraestructuraNuevaProvinciaCanton').html("");

                        var titulo = "<div class='tituloTablas'>"
                                + "<span> Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015)</span></div>";

                        var tituloMenos = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";

                        var tituloMore = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";

                        $('#menosInfraestructuraNuevaProvinciaCanton').html(tituloMenos);
                        $('#moreInfraestructuraNuevaProvinciaCanton').html(tituloMore);
                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>SECTOR</p></td><td style=' text-align: center' rowspan='2'><p>TIPOLOGIA</p></td>"
                                + "<td colspan='" + (resultados.valoresYIndicador.length + 1) + "'style=' text-align: center'>ESTADO DE LA OBRA</td></tr><tr>";

                        for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                            var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
                            if (codigo !== 1) {
                                cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
                            }
                        }
                        cabecera = cabecera + "<td style=' text-align: center'>TOTAL</td>";
                        //completa la cabecera con la columna planificada
                        for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                            var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
                            if (codigo === 1) {
                                cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
                            }
                        }
                        cabecera = cabecera + "</tr></thead>";
                        var cuerpo = "<tbody>";
                        //datos del estado de la obra por institucion
                        var i = 0;
                        //alert(resultados.listaSectores[0].totalTipologiaXSector);
                        for (var k = 0; k < resultados.listaSectores.length; k++) {

                            cuerpo = cuerpo + "<tr><td style=' text-align: left' rowspan=" + resultados.listaSectores[k].totalTipologiaXSector + ">" + resultados.listaSectores[k].sector + "</td>";
                            var cont = 0;
                            //alert(resultados.listaSectores[k].totalTipologiaXSector);
                            while (cont < parseInt(resultados.listaSectores[k].totalTipologiaXSector)) {
                                if (cont === 0) {
                                    cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresXClaveValor[i].valor + "</td>";
                                } else {
                                    cuerpo = cuerpo + "<tr><td style=' text-align: left'>" + resultados.valoresXClaveValor[i].valor + "</td>";
                                }

                                var sum = 0;
                                //alert(resultados.valoresYIndicador[0].codigo );
                                for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                                    var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                                    if (codigo !== 1) {
                                        //alert(resultados.valoresYIndicador[j].codigo );
                                        if (resultados.valoresYIndicador[j].data[i] !== null) {
                                            cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
                                            //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
                                            sum = sum + resultados.valoresYIndicador[j].data[i];
                                        } else {
                                            cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
                                        }
                                    }
                                }
                                if (sum === 0) {
                                    cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + " </td>";
                                } else {
                                    cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + "</td>";
                                }

                                for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                                    var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                                    if (codigo === 1) {
                                        if (resultados.valoresYIndicador[j].data[i] !== null) {
                                            cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
                                            //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
                                            //sum = sum + resultados.valoresYIndicador[j].data[i];
                                        } else {
                                            cuerpo = cuerpo + "<td style=' text-align: right'> </td>"
                                        }
                                    }
                                }
                                cuerpo = cuerpo + "</tr>";
                                i++;
                                cont++;
                            }
                        }


                        // Obtener los totales generales
                        cuerpo = cuerpo + "<tr><td style=' text-align: left' colspan='2'>Total General</td>";
                        //alert(resultados.valoresYIndicador[0].data.length)
                        var totalGeneral = 0;
                        for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                            var totalColumna = 0;
                            var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                            if (codigo !== 1) {
                                for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
                                    if (resultados.valoresYIndicador[j].data[h] !== null) {
                                        totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
                                        totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
                                    }
                                }
                                cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>";
                            }
                        }
                        if (totalGeneral === 0) {
                            cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
                        } else {
                            cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
                        }
                        for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                            var totalColumna = 0;
                            var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                            if (codigo === 1) {
                                for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
                                    if (resultados.valoresYIndicador[j].data[h] !== null) {
                                        totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
                                        totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
                                    }
                                }
                                cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>";
                            }
                        }

                        cuerpo = cuerpo + "</tr>";
                        var pie = "</tbody></table>";

                        $('#tablaInfraestructuraNuevaProvinciaCanton').append(cabecera + cuerpo + pie);
                        //$('#tablaInfraestructuraNueva').append(titulo + cabecera + cuerpo + pie);

                        //grafica de barras
                        //divGrafica = '#graficoInfraestructuraNuevaProvinciaCanton';
                        //graficar(obrasCantonal, divGrafica, titulo);

                        //grafica de pastel
                        divGraficaPie = '#graficoPieInfraestructuraNuevaProvinciaCanton';
                        graficarPastel(obrasCantonal, divGraficaPie, titulo);

                    }
                });
            }});
        //fin sin hipervinculos

        /****************************************/
        /*Funcion para crear tabla Infraestructura nueva PROVINCIA Y CANTON Y PARROQUIA*/
        /****************************************/
        $("#moreInfraestructuraNuevaProvinciaCantonParroquia").css("display", "none");
        $("#menosInfraestructuraNuevaProvinciaCantonParroquia").click(function(event) {
            $("#menosInfraestructuraNuevaProvinciaCantonParroquia").hide();
            $("#moreInfraestructuraNuevaProvinciaCantonParroquia").show();
            $("#todoInfraestructuraNuevaProvinciaCantonParroquia").hide();
            event.preventDefault();
        });

        $("#moreInfraestructuraNuevaProvinciaCantonParroquia").click(function(event) {
            $("#menosInfraestructuraNuevaProvinciaCantonParroquia").show();
            $("#moreInfraestructuraNuevaProvinciaCantonParroquia").hide();
            $("#todoInfraestructuraNuevaProvinciaCantonParroquia").show();
            event.preventDefault();
        });
        //inicio con hipervinculos
        /*$.ajax({
         url: "cadenaInfraestructura.txt",
         dataType: "text",
         success: function(data) {
         //Se realiza la consulta a nivel de canton y con la informacion se arma la tabla
         //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia;
         ipserver = data;
         var datos = ipserver + "/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia + "/" + codigoCanton + "/" + codigoParroquia;
         //alert(datos);
         $.getJSON(datos, function(resultados) {
         //alert(resultados.valoresYIndicador.length);
         if (resultados.valoresYIndicador.length > 0) {
         obrasParroquial = resultados;
         //alert(resultados);
         $('#tablaInfraestructuraNuevaProvinciaCantonParroquia').html("");
         
         var titulo = "<div class='tituloTablas'>"
         + "<span> Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015)</span></div>";
         
         var tituloMenos = "<div class='tituloTablas'>"
         + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";
         
         var tituloMore = "<div class='tituloTablas'>"
         + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";
         
         $('#menosInfraestructuraNuevaProvinciaCantonParroquia').html(tituloMenos);
         $('#moreInfraestructuraNuevaProvinciaCantonParroquia').html(tituloMore);
         //Se setea la cabecera
         var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>SECTOR</p></td><td style=' text-align: center' rowspan='2'><p>TIPOLOGIA</p></td>"
         + "<td colspan='" + (resultados.valoresYIndicador.length + 1) + "'style=' text-align: center'>ESTADO DE LA OBRA</td></tr><tr>";
         
         for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
         var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
         if (codigo !== 1) {
         cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
         }
         }
         cabecera = cabecera + "<td style=' text-align: center'>TOTAL</td>";
         //completa la cabecera con la columna planificada
         for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
         var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
         if (codigo === 1) {
         cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
         }
         }
         cabecera = cabecera + "</tr></thead>";
         var cuerpo = "<tbody>";
         //datos del estado de la obra por institucion
         var i = 0;
         //alert(resultados.listaSectores[0].totalTipologiaXSector);
         for (var k = 0; k < resultados.listaSectores.length; k++) {
         
         cuerpo = cuerpo + "<tr><td style=' text-align: left' rowspan=" + resultados.listaSectores[k].totalTipologiaXSector + "><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + "-1" + "&" + resultados.listaSectores[k].idSector + "&" + "-1" + "&" + "-1" + ">" + resultados.listaSectores[k].sector + "</a></td>"
         var cont = 0;
         //alert(resultados.listaSectores[k].totalTipologiaXSector);
         while (cont < parseInt(resultados.listaSectores[k].totalTipologiaXSector)) {
         if (cont === 0) {
         cuerpo = cuerpo + "<td style=' text-align: left'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + resultados.valoresXClaveValor[i].valor + "</a></td>";
         } else {
         cuerpo = cuerpo + "<tr><td style=' text-align: left'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + resultados.valoresXClaveValor[i].valor + "</a></td>";
         }
         
         var sum = 0;
         //alert(resultados.valoresYIndicador[0].codigo );
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo !== 1) {
         //alert(resultados.valoresYIndicador[j].codigo );
         if (resultados.valoresYIndicador[j].data[i] !== null) {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + resultados.valoresYIndicador[j].codigo + ">" + resultados.valoresYIndicador[j].data[i] + "</a></td>"
         //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
         sum = sum + resultados.valoresYIndicador[j].data[i];
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
         }
         }
         }
         if (sum === 0) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + " </td>"
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + resultados.valoresXClaveValor[i].codigo + "&" + "-1" + ">" + sum + "</a></td>";
         }
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo === 1) {
         if (resultados.valoresYIndicador[j].data[i] !== null) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
         //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
         //sum = sum + resultados.valoresYIndicador[j].data[i];
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'> </td>"
         }
         }
         }
         cuerpo = cuerpo + "</tr>";
         i++;
         cont++;
         }
         }
         
         
         // Obtener los totales generales
         cuerpo = cuerpo + "<tr><td style=' text-align: left' colspan='2'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + "-1" + "&" + "-1>Total General</td></a>";
         //alert(resultados.valoresYIndicador[0].data.length)
         var totalGeneral = 0;
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var totalColumna = 0;
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo !== 1) {
         for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
         if (resultados.valoresYIndicador[j].data[h] !== null) {
         totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
         totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
         }
         }
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + "-1" + "&" + resultados.valoresYIndicador[j].codigo + ">" + totalColumna + "</a></td>"
         }
         }
         if (totalGeneral === 0) {
         cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
         } else {
         cuerpo = cuerpo + "<td style=' text-align: right'><a href= InfraestructuraNueva.html?" + codigoProvincia + "&" + codigoCanton + "&" + codigoParroquia + "&" + "-1" + "&" + "-1" + "&" + "-1>" + totalGeneral + "</a></td>";
         }
         for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
         var totalColumna = 0;
         var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
         if (codigo === 1) {
         for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
         if (resultados.valoresYIndicador[j].data[h] !== null) {
         totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
         totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
         }
         }
         cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>"
         }
         }
         
         cuerpo = cuerpo + "</tr>";
         var pie = "</tbody></table>";
         
         $('#tablaInfraestructuraNuevaProvinciaCantonParroquia').append(cabecera + cuerpo + pie);
         //$('#tablaInfraestructuraNueva').append(titulo + cabecera + cuerpo + pie);
         
         //grafica de barras
         //divGrafica = '#graficoInfraestructuraNuevaProvinciaCantonParroquia';
         //graficar(obrasParroquial, divGrafica, titulo);
         
         //grafica de pastel
         divGraficaPie = '#graficoPieInfraestructuraNuevaProvinciaCantonParroquia';
         graficarPastel(obrasParroquial, divGraficaPie, titulo);
         
         }
         });
         }});*/
        //fin con hipervinculos

        //inicio sin hipervinculos
        $.ajax({
            url: "cadenaInfraestructura.txt",
            dataType: "text",
            success: function(data) {
                /*Se realiza la consulta a nivel de canton y con la informacion se arma la tabla*/
                //var datos = "http://192.168.50.76:8080/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia;
                ipserver = data;
                var datos = ipserver + "/WSObservatorio/webresources/infraestructura/obras/" + codigoProvincia + "/" + codigoCanton + "/" + codigoParroquia;
                //alert(datos);
                $.getJSON(datos, function(resultados) {
                    //alert(resultados.valoresYIndicador.length);
                    if (resultados.valoresYIndicador.length > 0) {
                        obrasParroquial = resultados;
                        //alert(resultados);
                        $('#tablaInfraestructuraNuevaProvinciaCantonParroquia').html("");

                        var titulo = "<div class='tituloTablas'>"
                                + "<span> Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015)</span></div>";

                        var tituloMenos = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> - &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";

                        var tituloMore = "<div class='tituloTablas'>"
                                + "<span><a href='#' style='text-decoration:none'> <font size='3' color='black'> + &nbsp;&nbsp;  Infraestructura Social Emblemática cantón " + resultados.canton + " (período 2007-2015) - MCDS</font></a></span></div>";

                        $('#menosInfraestructuraNuevaProvinciaCantonParroquia').html(tituloMenos);
                        $('#moreInfraestructuraNuevaProvinciaCantonParroquia').html(tituloMore);
                        /*Se setea la cabecera*/
                        var cabecera = "<table><thead><tr><td style=' text-align: center' rowspan='2'><p>SECTOR</p></td><td style=' text-align: center' rowspan='2'><p>TIPOLOGIA</p></td>"
                                + "<td colspan='" + (resultados.valoresYIndicador.length + 1) + "'style=' text-align: center'>ESTADO DE LA OBRA</td></tr><tr>";

                        for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                            var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
                            if (codigo !== 1) {
                                cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
                            }
                        }
                        cabecera = cabecera + "<td style=' text-align: center'>TOTAL</td>";
                        //completa la cabecera con la columna planificada
                        for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                            var codigo = parseInt(resultados.valoresYIndicador[i].codigo);
                            if (codigo === 1) {
                                cabecera = cabecera + "<td style=' text-align: center'>" + resultados.valoresYIndicador[i].name + "</td>"
                            }
                        }
                        cabecera = cabecera + "</tr></thead>";
                        var cuerpo = "<tbody>";
                        //datos del estado de la obra por institucion
                        var i = 0;
                        //alert(resultados.listaSectores[0].totalTipologiaXSector);
                        for (var k = 0; k < resultados.listaSectores.length; k++) {

                            cuerpo = cuerpo + "<tr><td style=' text-align: left' rowspan=" + resultados.listaSectores[k].totalTipologiaXSector + ">" + resultados.listaSectores[k].sector + "</td>";
                            var cont = 0;
                            //alert(resultados.listaSectores[k].totalTipologiaXSector);
                            while (cont < parseInt(resultados.listaSectores[k].totalTipologiaXSector)) {
                                if (cont === 0) {
                                    cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresXClaveValor[i].valor + "</td>";
                                } else {
                                    cuerpo = cuerpo + "<tr><td style=' text-align: left'>" + resultados.valoresXClaveValor[i].valor + "</td>";
                                }

                                var sum = 0;
                                //alert(resultados.valoresYIndicador[0].codigo );
                                for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                                    var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                                    if (codigo !== 1) {
                                        //alert(resultados.valoresYIndicador[j].codigo );
                                        if (resultados.valoresYIndicador[j].data[i] !== null) {
                                            cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
                                            //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
                                            sum = sum + resultados.valoresYIndicador[j].data[i];
                                        } else {
                                            cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
                                        }
                                    }
                                }
                                if (sum === 0) {
                                    cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + " </td>";
                                } else {
                                    cuerpo = cuerpo + "<td style=' text-align: right'>" + sum + "</td>";
                                }
                                for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                                    var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                                    if (codigo === 1) {
                                        if (resultados.valoresYIndicador[j].data[i] !== null) {
                                            cuerpo = cuerpo + "<td style=' text-align: right'>" + resultados.valoresYIndicador[j].data[i] + "</td>";
                                            //cuerpo = cuerpo + "<td style=' text-align: left'>" + resultados.valoresYIndicador[j].data[i] + "</td>"
                                            //sum = sum + resultados.valoresYIndicador[j].data[i];
                                        } else {
                                            cuerpo = cuerpo + "<td style=' text-align: right'> </td>";
                                        }
                                    }
                                }
                                cuerpo = cuerpo + "</tr>";
                                i++;
                                cont++;
                            }
                        }


                        // Obtener los totales generales
                        cuerpo = cuerpo + "<tr><td style=' text-align: left' colspan='2'>Total General</td>";
                        //alert(resultados.valoresYIndicador[0].data.length)
                        var totalGeneral = 0;
                        for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                            var totalColumna = 0;
                            var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                            if (codigo !== 1) {
                                for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
                                    if (resultados.valoresYIndicador[j].data[h] !== null) {
                                        to0talColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
                                        totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
                                    }
                                }
                                cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>";
                            }
                        }
                        if (totalGeneral === 0) {
                            cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
                        } else {
                            cuerpo = cuerpo + "<td style=' text-align: right'>" + totalGeneral + "</td>";
                        }
                        for (var j = 0; j < resultados.valoresYIndicador.length; j++) {
                            var totalColumna = 0;
                            var codigo = parseInt(resultados.valoresYIndicador[j].codigo);
                            if (codigo === 1) {
                                for (var h = 0; h < resultados.valoresYIndicador[j].data.length; h++) {
                                    if (resultados.valoresYIndicador[j].data[h] !== null) {
                                        totalColumna = totalColumna + resultados.valoresYIndicador[j].data[h];
                                        totalGeneral = totalGeneral + resultados.valoresYIndicador[j].data[h];
                                    }
                                }
                                cuerpo = cuerpo + "<td style=' text-align: right'>" + totalColumna + "</td>";
                            }
                        }

                        cuerpo = cuerpo + "</tr>";
                        var pie = "</tbody></table>";

                        $('#tablaInfraestructuraNuevaProvinciaCantonParroquia').append(cabecera + cuerpo + pie);
                        //$('#tablaInfraestructuraNueva').append(titulo + cabecera + cuerpo + pie);

                        //grafica de barras
                        //divGrafica = '#graficoInfraestructuraNuevaProvinciaCantonParroquia';
                        //graficar(obrasParroquial, divGrafica, titulo);

                        //grafica de pastel
                        divGraficaPie = '#graficoPieInfraestructuraNuevaProvinciaCantonParroquia';
                        graficarPastel(obrasParroquial, divGraficaPie, titulo);

                    }
                });
            }});
        //fin sin hipervinculos

        //funcion para graficar un pastel
        function graficarPastel(resultados, divGrafica, titulo) {
            ///
            $(divGrafica).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: titulo
                },
                subtitle: {
                    //text: resultados.fuenteIndicador
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: []
            });
            var chart = $(divGrafica).highcharts();
            var listaTotal = new Array();
            for (var i = 0; i < resultados.listaSectores.length; i++) {

                var objeto;
                //educacion
                if (resultados.listaSectores[i].idSector === "1") {
                    objeto = {
                        name: resultados.listaSectores[i].sector,
                        y: parseInt(resultados.listaSectores[i].total),
                        color: "#f8941d"
                    };
                } else {
                    //desarrollo urbano y vivienda
                    if (resultados.listaSectores[i].idSector === "2") {
                        objeto = {
                            name: resultados.listaSectores[i].sector,
                            y: parseInt(resultados.listaSectores[i].total),
                            color: "#c4d82e"
                        };
                    } else {
                        //deportes
                        if (resultados.listaSectores[i].idSector === "4") {
                            objeto = {
                                name: resultados.listaSectores[i].sector,
                                y: parseInt(resultados.listaSectores[i].total),
                                color: "#00a94e"
                            };
                        } else {
                            //salud
                            if (resultados.listaSectores[i].idSector === "5") {
                                objeto = {
                                    name: resultados.listaSectores[i].sector,
                                    y: parseInt(resultados.listaSectores[i].total),
                                    color: "#0f75bc"
                                };
                            } else {
                                //inclusion economica
                                if (resultados.listaSectores[i].idSector === "6") {
                                    objeto = {
                                        name: resultados.listaSectores[i].sector,
                                        y: parseInt(resultados.listaSectores[i].total),
                                        color: "#a153a0"
                                    };
                                }
                            }
                        }
                    }
                }

                listaTotal.push(objeto);
            }
            chart.addSeries({
                name: "Cantidad",
                data: listaTotal
            });
        }


        //realiza la grafica en higchrt de la infraestructura
        function graficar(resultados, divGrafica, titulo) {

            var listaEjecucion = null;
            var listaTerminada = null;
            var estadoEjecutada = 0;
            var estadoTerminada = 0;
            //alert(resultados.valoresYIndicador.length);
            for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                if (resultados.valoresYIndicador[i].codigo === '2') {
                    //alert("ejecutadas");
                    listaEjecucion = resultados.valoresYIndicador[i].data;
                    estadoEjecutada = 1;
                }
                if (resultados.valoresYIndicador[i].codigo === '4') {
                    //alert("terminadas");
                    listaTerminada = resultados.valoresYIndicador[i].data;
                    estadoTerminada = 1;
                }
            }
            //cuadno haya datos en las dos listas y eliminar los null
            if ((estadoEjecutada === 1) && (estadoTerminada === 1)) {
                for (var i = 0; i < listaEjecucion.length; i++) {
                    if ((listaEjecucion[i] === null) && (listaTerminada[i] === null)) {
                        listaEjecucion.splice(i, 1);
                        listaTerminada.splice(i, 1);
                    }
                }
            } else {
                //cuando haya datos solo en la lista e ejecucion y eliminar los null
                if (estadoEjecutada === 1) {
                    for (var i = 0; i < listaEjecucion.length; i++) {
                        if (listaEjecucion[i] === null) {
                            listaEjecucion.splice(i, 1);
                        }
                    }
                } else {
                    //cuando haya datos solo en la lista terminada y eliminar los null
                    if (estadoTerminada === 1) {
                        for (var i = 0; i < listaTerminada.length; i++) {
                            if (listaTerminada[i] === null) {
                                listaTerminada.splice(i, 1);
                            }
                        }

                    }
                }
            }
            if ((estadoEjecutada === 1) || (estadoTerminada === 1)) {
                /*
                 * Gráfico en HighCharts
                 */
                $(divGrafica).highcharts({
                    chart: {
                        type: 'column',
                        style: {
                            fontFamily: 'Helvetica' // default font

                        }
                    },
                    title: {
                        text: titulo
                    },
                    subtitle: {
                        text: resultados.fuenteIndicador
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: resultados.valoresXIndicador
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Cantidad'
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
                var chart = $(divGrafica).highcharts();
                for (var i = 0; i < resultados.valoresYIndicador.length; i++) {
                    var nombre = resultados.valoresYIndicador[i].name;
                    /*chart.addSeries({
                     name: nombre,
                     data: resultados.valoresYIndicador[i].data
                     
                     });*/
                    //palnificada
                    /*if (resultados.valoresYIndicador[i].codigo === '1') {
                     chart.addSeries({
                     name: nombre,
                     data: resultados.valoresYIndicador[i].data,
                     color: '#90ed7d'
                     });
                     }*/
                    //En ejecucion
                    if (resultados.valoresYIndicador[i].codigo === '2') {
                        chart.addSeries({
                            name: nombre,
                            //data: resultados.valoresYIndicador[i].data,
                            data: listaEjecucion,
                            color: '#98df8a'
                        });
                    }

                    //Terminada
                    if (resultados.valoresYIndicador[i].codigo === '4') {
                        chart.addSeries({
                            name: nombre,
                            //data: resultados.valoresYIndicador[i].data,
                            data: listaTerminada,
                            color: '#2ca02c'

                        });
                    }

                }
                //chart.tooltip.refresh(chart.series[0].data[resultados.valoresXIndicador.length - 1]);
            }
        }
        //fin



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

