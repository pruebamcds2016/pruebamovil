/* 
 * Javascript grafica agenda
 * autor: @Adriana.Romero
 * 
 */

function ViewModelGrafica() {

    /*
     *Se recupera las variables enviadas por response desde agndInd
     *@nombreIndicador
     */

    var principal = this;
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        nombreIndicador = Variable;
    }

    /*
     * Variables globales y de knockout.js
     */
    var cadena = "";
    var ipserver;
    principal.ejemploLista = ko.observableArray();
    principal.fichaList = ko.observableArray();

    /*
     * Visibilidad de los elementos html
     */

    $(".nombreIndicador").css("display", "none");
    $("#definicion").css("display", "none");
    $("#errorGrafico").css("display", "none");
    $("#tblCabecera").css("display", "none");
    $("#pageNavPosition").css("display", "none");
    $("#results").css("display", "none");
    $("#divFuente").css("display", "none");

    /*
     *Evento ajax 
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            //Servicio web 201.219.3.75:8080/ServicioWeb/webresources/grafico/Agend_027
            cadena = ipserver + "/ServicioWeb/webresources/grafico/" + nombreIndicador;

            $.getJSON(cadena, function(result) {

                for (var j = 0; j < 1; j++) {
                    principal.fichaList.push({
                        url: ko.observable("ficha.html?" + result.path_indicador),
                        details: ko.observable(""),
                        textoBoton: ko.observable("Ver ficha")
                    });
                }

                /*
                 * Visibilidad de los elementos html
                 */
                $(".nombreIndicador").css("display", "block");
                $(".loadingPag").css("display", "none");
                $("#definicion").css("display", "block");
                $("#tblCabecera").css("display", "block");
                $("#pageNavPosition").css("display", "block");
                $("#results").css("display", "block");
                $("#divFuente").css("display", "block");


                /*
                 * Seteo de div
                 */
                $('#ficha').html(result.definicion_grafica);
                $(".lblFuente").html(result.fuente_indicador);
                $(".lblAnio").html(result.anio_indicador);
                $(".mapaSitio").html(result.subsector_grafica);
                $(".nombreIndicador").html(result.nombre_indicador);
                $("#labelTool").html('&nbsp;' + result.titulo_tablaDatos);

                /*
                 * Paginación en tabla de datos
                 */
                var i;
                var itemPorHoja = 0;
                var serieName = result.valoresY_indicador[0].name;
                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var serieName1 = result.valoresY_indicador[i].name;
                    var datoR = result.valoresY_indicador[i].data;
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
                                    dato3: format(datoR[j])

                                });


                            } else {

                                principal.ejemploLista.push({
                                    dato1: "",
                                    dato2: result.valoresX_indicador[j],
                                    dato3: format(datoR[j])
                                });
                                if (serieName === serieName1)
                                    itemPorHoja = itemPorHoja + 1;
                            }
                        }
                    }
                }

                /*
                 * Se inicializa la paginación en la tabla de datos
                 */
                pager = new Pager('results', itemPorHoja + 2);
                pager.init();
                pager.showPageNav('pager', 'pageNavPosition');
                pager.showPage(1);

                //Los valores que se necesitan son arrays
                var valoresX = result.valoresX_indicador;
                var intervalo;
                if (valoresX.length > 4) {
                    intervalo = 4;
                } else {
                    intervalo = 1;
                }

                /*
                 * Gráfico en HighCharts
                 */

                $('#container').highcharts({
                    //Type spline: suaviza las curvas
                    chart: {
                        type: result.tipo_grafica

                    },
                    title: {
                        text: result.nombre_indicador,
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
                // Creación dinámica de series
                var chart = $('#container').highcharts();

                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var nombre = result.valoresY_indicador[i].name;
                    var data1 = result.valoresY_indicador[i].data;
                    if (result.tipo_grafica === 'spline') {
                        for (var j = 0; j < data1.length; j++) {
                            if (data1[j] === '') {
                                data[j] === null;
                            }
                        }
                        data1[data1.length - 1] = {y: data1[data1.length - 1],
                            marker: {symbol: 'url(css/images/meta.png)'}};
                        chart.addSeries({
                            name: nombre,
                            data: data1
                        });


                    } else {
                        chart.addSeries({
                            name: nombre,
                            data: data1
                        });

                    }
                }

                chart.tooltip.refresh(chart.series[0].data[valoresX.length - 1]);


            }).error(function() {
                /*
                 * Se muestra mensaje de error cuando caduca el tiempo de acceso al servidor
                 */
                $(".loadingPag").css("display", "block");
                $("#errorGrafico").css("display", "block");
                $("#footerGrafico").css("display", "none");
                $(".errorGrafico").html("Al momento no se puede mostrar la informacion");
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





