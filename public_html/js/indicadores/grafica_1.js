/* 
 * Javascript grafica
 * autor: @Adriana.Romero
 * 
 */

function ViewModelGrafica() {
    var principal = this;
    /*
     * Variables globales y de knockout.js
     * Se recupera las variables responsive
     * @id_ib
     * @id_tema
     */

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        id_tema = elem[0];
        id_ib = elem[1];
        id_subtema = elem[2];
    }


    /*
     * Visibilidad de los elementos html
     */

    $(".loadingPag").css("display", "block");
    $("#divFuente").css("display", "none");
    $(".nombreIndicador").css("display", "none");
    /*
     * Variables globales y de knockout.js
     */
    var cadena = "";
    principal.ejemploLista = ko.observableArray();
    principal.fichaList = ko.observableArray();
    var ipserver;

    /*
     *Evento ajax para la grafica
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
//            http://201.219.3.75:8080/SWSISEcuador/webresources/indanalisis/conPobRef/943/24
            cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/conPobRef/" + id_ib + "/" + id_subtema;

            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                $(".mapaSitio").html(result.tema_indicador);

                for (var j = 0; j < 1; j++) {
                    principal.fichaList.push({
                        url: ko.observable("ficha.html?" + result.path_indicador),
                        details: ko.observable(""),
                        textoBoton: ko.observable("Ver ficha")
                    });
                }


                $(".nombreIndicador").css("display", "block");
                $("#tblCabecera").css("display", "block");
                $("#pageNavPosition").css("display", "block");
                $("#results").css("display", "block");
                $("#divFuente").css("display", "block");

                $('#ficha').html(result.definicion_grafica);
                $(".lblFuente").html(result.fuente_indicador + " - " + result.institucion_fuente);
                $(".lblAnio").html(result.anio_indicador);
                $(".nombreIndicador").html(result.nombre_indicador + " (" + result.anio_indicador + ")");
                $("#labelTool").html('&nbsp;' + result.titulo_tablaDatos);
                /**
                 * Función para paginación tabla datos
                 */
                var i;

                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var datoR = result.valoresY_indicador[i].data;
                    //alert(result.valoresX_indicador.length);
                    // var listaP = datoR.data.split(',');
                    principal.ejemploLista.push({
                        dato1: result.valoresY_indicador[i].name,
                        dato2: "",
                        dato3: ""

                    });
                    for (var j = 0; j < datoR.length; j++) {
                        if (datoR[j] !== null)
                        {
                            if (result.valoresX_indicador[j] === "2017") {

                                principal.ejemploLista.push({
                                    dato1: "",
                                    dato2: result.valoresX_indicador[j] + "- meta",
                                    dato3: format(datoR[j], result.numero_decimales)
                                });


                            } else {

                                principal.ejemploLista.push({
                                    dato1: "",
                                    dato2: result.valoresX_indicador[j],
                                    dato3: format(datoR[j], result.numero_decimales)
                                });

                            }
                        }

                    }
                }


                //Los valores que se necesitan son arrays
                var valoresX = result.valoresX_indicador;
                var intervalo;
                if (valoresX.length > 4) {
                    intervalo = 4;
                } else {
                    intervalo = 1;
                }
                //alert(intervalo);
                //alert(result.etiquetaY_indicador);

                /*
                 * Gráfico en HighCharts
                 */
                $('#container').highcharts({
                    //Type spline: suaviza las curvas
                    chart: {
                        type: result.tipo_grafica

                    },
                    title: {
                        text: result.nombre_indicador + " (" + result.anio_indicador + ")",
                        align: 'left'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: valoresX,
                        minTickInterval: intervalo,
                        title: {
                            text: result.etiquetaX_indicador
                        }
                    },
                    yAxis: {
                        floor: 0,
                        title: {
                            text: result.etiquetaY_indicador
                        },
                        plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]

                    },
                    tooltip: {
                        valueSuffix: ' ' + result.tooltip_indicador
                    }
                    ,
                    exporting: {
                        enabled: false}
                    ,
                    series: []
                });

                //alert(result.tipo_grafica);
                /*if (result.tipo_grafica === 'column') {
                    alert(result.tipo_grafica);
                } else {
                    if (result.tipo_grafica === 'spline')
                        alert(result.tipo_grafica);
                }*/
                /*********************INICIO AGREGARLE EL AÑO BASE A LOS INDICADORES DED SERIE***********************/

                //alert(result.valoresY_indicador.length);
                //alert(result.valoresY_indicador[0].data[0])
                var seriesY = [];
                //alert(result.valoresX_indicador.length);
                //alert(result.valoresY_indicador[0].data.length);
                //alert(result.valoresX_indicador[14]);
                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var valoresY = [];
                    for (var j = 0; j < result.valoresY_indicador[i].data.length; j++) {


                        if (result.valoresX_indicador[j] === "2010") {

                            if (result.tipo_grafica === 'column') {
                                valoresY.push({y: result.valoresY_indicador[i].data[j], marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}, color: 'green'});
                                //valoresY.push({y: result.valoresY_indicador[i].data[j], marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}});

                            }
                            else {
                                if (result.tipo_grafica === 'spline') {
                                    valoresY.push({y: result.valoresY_indicador[i].data[j], marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}});


                                }
                            }


                            //valoresY.push({y: result.valoresY_indicador[i].data[j]});

                            /*{
                             y: 26.5,
                             marker: {
                             symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'
                             }
                             }*/
                        } else {

                            valoresY.push(result.valoresY_indicador[i].data[j]);
                        }
                        //alert(i);

                    }
                    seriesY.push(valoresY);
                }
                //valoresY.push({marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}});
                //seriesY.push(valoresY);

                //alert(seriesY.length);
                //alert(seriesY[0]);

                /*********FIN**********/





                // Creación dinámica de series
                var chart = $('#container').highcharts();
                //alert(result.valoresY_indicador.length)
                for (var i = 0; i < result.valoresY_indicador.length; i++) {

                    var nombre = result.valoresY_indicador[i].name;
                    chart.addSeries({
                        name: nombre,
                        data: seriesY[i]
                                //data: result.valoresY_indicador[i].data

                    });
                }
                /*******************/
                // si tiene año base se pone el symbolo o el color dependiendo si es serie o columna
                if (result.tipo_grafica === 'column') {

                    chart.addSeries({
                        name: 'Línea base',
                        color: 'green'
                                //data: seriesY[i]
                                //data: result.valoresY_indicador[i].data
                    });
                }
                else {
                    if (result.tipo_grafica === 'spline') {

                        chart.addSeries({
                            name: 'Línea base',
                            marker: {symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'}

                            //data: seriesY[i]
                            //data: result.valoresY_indicador[i].data
                        });
                    }
                }


                /*******************/
                chart.tooltip.refresh(chart.series[0].data[valoresX.length - 1]);



            }
            ).error(function() {
                /*
                 * Se muestra mensaje de error cuando caduca el tiempo de acceso al servidor
                 */
                $(".loadingPag").css("display", "none");
                $(".errorGrafico").css("display", "block");
                $(".errorGrafico").html("Al momento no se puede mostrar la informacion");
                $(".tab-links").css("display", "none");

            });
        }
    });
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
// Activamos knockout.js
ko.applyBindings(new ViewModelGrafica());


