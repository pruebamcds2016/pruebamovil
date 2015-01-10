/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function ViewModelIndicador() {
    var principal = this;
     /*
     * Variables globales y de knockout.js
     * Se recupera las variables responsive
     * @id_tema
     * @id_subtema
     */

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        id_tema = elem[0];
        id_subtema = elem[1];
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

    
   /*
     *Evento ajax para listar los sectores
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;

            var cadena = ipserver + "/SWSISEcuador/webresources/indanalisis/indicador/" + id_tema + "/" + id_subtema;

            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                $(".mapaSitio").html(result[0].str_nombre_tema);
                $.each(result, function() {
                    principal.ejemploLista.push({
                        url: ko.observable("relvGrafica.html?"+this.id_ib + "&" + this.id_tema),
                        details: ko.observable(""),
                        nombreIndicador: ko.observable(this.str_nombre_ia)
                    });
                });
            });
        }
    });
    
    
    
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
            var cadena = ipserver + "/ServicioWeb/webresources/ec.gob.desarrollosocial.indsisgrpind/movil/buscador/" + 13;

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
                            //  $('#hideKeyboard').focus();
                        }
                    },
                    focus: function() {
                        // prevent value inserted on focus
                        return true;
                    },
                    select: function(event, ui) {


                        var serialGrp = ui.item.serialGrp;
                        var serialInd = ui.item.serialInd;

                        if (Variable === "11") {
                            location.href = "agnGrafica.html?" + serialGrp;
                        }
                        else {
                            location.href = "relvGrafica.html?" + serialInd + "&" + serialGrp + "&" + Variable;

                        }


                    }
                });
            });
        }
    });
}
//
ko.applyBindings(new ViewModelIndicador());
