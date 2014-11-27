/* 
 * Javascript grafica indicadores
 * autor: @Adriana.Romero
 * 
 */

function ViewModelSubsector() {

    var principal = this;
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
     *Evento ajax para listar los subsectores
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            //Codigo 154 para indicadores de agenda social
            var cadena = ipserver + "/ServicioWeb/webresources/ec.gob.desarrollosocial.indsubsector/154";
            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");

                $.each(result, function() {
                    principal.ejemploLista.push({
                        url: ko.observable("agnInd.html?" + this.serial_sse),
                        details: ko.observable(""),
                        nombreSse: ko.observable(this.nombre_sse)
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


    $("#firstName").css("display", "none");

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
//// Activamos knockout.js
ko.applyBindings(new ViewModelSubsector());
