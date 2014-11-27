/* 
 * Javascript grafica indicadores
 * autor: @Adriana.Romero
 * 
 */

function ViewModelIndicador() {
    /*
     *Se recupera las variables enviadas por response desde agndSse
     *@serialSubsector
     */
    var principal = this;
    if (location.search.substr(1)) {
        serialSubsector = location.search.substr(1);
    }
    /*
     * Variables globales y de knockout.js
     */
    var Variable = "11";
    var ipserver;
    principal.ejemploLista = ko.observableArray();
    principal.firstName = ko.observable("");
    /*
     * Visibilidad de los elementos html
     */
    $(".loadingPag").css("display", "block");

    /*
     *Evento ajax para listar los indicadores
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            //Servicio web http://201.219.3.75:8080/ServicioWeb/webresources/grafico/lstInd/100
            var cadena = ipserver + "/ServicioWeb/webresources/grafico/lstInd/" + serialSubsector;

            $.getJSON(cadena, function(result) {
                /*
                 * Visibilidad de los elementos html
                 * Seteo de mapa de sitio
                 */

                $(".loadingPag").css("display", "none");
                $(".mapaSitio").html(result[0].path_indicador + " ");
                $.each(result, function() {
                    principal.ejemploLista.push({
                        url: ko.observable("agnGrafica.html?" + this.variable_indicador),
                        details: ko.observable(""),
                        nombreIndicador: ko.observable(this.nombre_indicador)
                    });
                });
            });
        }
    });

    /*
     * Variables para buscador
     */
    principal.firstName = ko.observable("");
    var firstNames = ko.observableArray();
    function indOj() {
        this.label = "";
        this.serialInd = "";
        this.serialGrp = "";
    }

    /*
     * Visibilidad de los elementos html
     */
    $("#firstName").css("display", "none");

    /*
     *Evento ajax para buscador
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            var cadena = ipserver + "/ServicioWeb/webresources/ec.gob.desarrollosocial.indsisgrpind/movil/buscador/" + 11;

            $.getJSON(cadena, function(result) {

                $("#firstName").css("display", "block");
                if (Variable === "11") {
                    $.each(result, function() {
                        var obj = new indOj();
                        obj.label = this.nombreInd;
                        obj.serialInd = this.serialInd;
                        obj.serialGrp = this.codigoInd;

                        firstNames.push(obj);

                    });


                } else {

                    $.each(result, function() {
                        var obj = new indOj();
                        obj.label = this.serialInd.nombreInd;
                        obj.serialInd = this.serialInd.serialInd;
                        obj.serialGrp = this.serialSse.serialGrp.serialGrp;

                        firstNames.push(obj);

                    });
                }

                //First names es la lista donde se llenan las palabras que coinciden en la busqueda


                $('#firstName').autocomplete({
                    source: firstNames(),
                    messages: {
                        noResults: '',
                        results: function() {
                        }
                    },
                    focus: function() {
                        return true;
                    },
                    select: function(event, ui) {


                        var serialGrp = ui.item.serialGrp;
                        var serialInd = ui.item.serialInd;

                        if (Variable === "11") {
                            location.href = "agnGrafica.html?" + serialGrp;
                        }
                        else {
                            location.href = "grafica.html?" + serialInd + "&" + serialGrp + "&" + 11;

                        }


                    }
                });
            });
        }
    });
}
// Activamos knockout.js
ko.applyBindings(new ViewModelIndicador());
