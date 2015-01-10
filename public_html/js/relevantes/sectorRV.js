


function ViewModelSector() {

    var principal = this;
    principal.ejemploLista = ko.observableArray();
    principal.listaAcordeon = ko.observableArray();
    principal.firstName = ko.observable("");
    //Se recupera la variable
    if (location.search.substr(1)) {
        tema = location.search.substr(1);
    }

    $(".loadingPag").css("display", "block");
    $("#errorLabel").css("display", "none");
    var ipserver;

    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
              var cadena = ipserver + "/SWSISEcuador/webresources/ritema/temas/" + tema;
            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                 $.each(result, function() {
                    principal.ejemploLista.push({
                        url: ko.observable("relvInd.html?" + this.riIdTema.idTema + "&" + this.idTema),
                        details: ko.observable(""),
                        nombreGrupo: ko.observable(this.strNombreTema)
                    });
                });
            }).error(function(jqXHR, textStatus, errorThrown) { /* assign handler */
                /* alert(jqXHR.responseText) */
//                alert("Ocurrio un error" + jqXHR.responseText);
                $(".loadingPag").css("display", "none");
                $("#errorLabel").css("display", "block");
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
            var cadena = ipserver + "/ServicioWeb/webresources/ec.gob.desarrollosocial.indsisgrpind/movil/buscador/" + Variable;

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

// Activamos knockout.js
ko.applyBindings(new ViewModelSector());





