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
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        id_tema = elem[0];
        id_subtema = elem[1];
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
            //Servicio web http://201.219.3.75:8080/SWSISEcuador/webresources/indanalisis/indicador/4/27
            var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/indicador/" + id_tema + "/" + id_subtema;

            $.getJSON(cadena, function(result) {
                /*
                 * Visibilidad de los elementos html
                 * Seteo de mapa de sitio
                 */

                $(".loadingPag").css("display", "none");
                $(".mapaSitio").html(result[0].str_nombre_tema);
                $.each(result, function() {

                    principal.ejemploLista.push({
                        url: ko.observable("agnGrafica.html?"+this.id_ib + "&" + this.id_tema),
                        details: ko.observable(""),
                        nombreIndicador: ko.observable(this.str_nombre_ia)
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
        this.id_ib = "";
        this.id_tema = "";

    }


    $("#firstName").css("display", "none");

    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
//            http://201.219.3.75:8080/SWSISEcuador/webresources/indanalisis/buscar/4
            var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/buscar/" + id_tema;

            $.getJSON(cadena, function(result) {

                $("#firstName").css("display", "block");


                $.each(result, function() {
                    var obj = new indOj();
                    obj.label = this.str_nombre_ia;
                    obj.id_ib = this.id_ib;
                    obj.id_tema = this.id_tema;

                    firstNames.push(obj);

                });

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
                        var id_ib = ui.item.id_ib;
                        var id_tema = ui.item.id_tema;
                        location.href = "grafica.html?" + id_ib + "&" + id_tema;
                    }
                });
            });
        }
    });
}
// Activamos knockout.js
ko.applyBindings(new ViewModelIndicador());
