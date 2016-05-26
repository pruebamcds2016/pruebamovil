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
var viviendas;
var obrasNacional;
var obrasProvincial;
var obrasCantonal;
var divGrafica;

var markers1;

AutoSizeAnchoredMinSize = OpenLayers.Class(OpenLayers.Popup.Anchored, {
    'autoSize': true,
    'minSize': new OpenLayers.Size(100, 100)
});


var samplePopupContentsHTML = "Eugenio Espejo";
//var listaValidarDPA;

AutoSizeFramedCloudMaxSize = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
    'autoSize': true,
    'maxSize': new OpenLayers.Size(100, 100)
});

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
    $(".complete").css("display", "none");
    $('input[type="submit"]').attr('disabled', 'disabled');
    //$("#provincia").css("display", "none");
    //$("#provincia").html("loreeeeeeee");
    //OCultar al momento de carga
    //$("#tablaInfraestructuraNueva").css("display", "none");
    //$("#graficoInfraestructuraNueva").css("display", "none");



    //$("#tablaInfraestructuraNuevaProvincia").css("display", "none");


    //var bandera = 0;
    //alert(bandera);
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

    //var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";//key de bing
    var apiKey = "ApzF8URqpsJu0SQpIv9mBKa26rBDJmbg-YrYQmZn_rbmXKwSqpoUhGLV9lFH3nNy";//key de bing


    layerBase = new OpenLayers.Layer.Bing({
        name: "Calles",
        key: apiKey,
        type: "Road",
        visibility: true,
        displayInLayerSwitcher: true
    });
    /*layerBase = [
     new OpenLayers.layer.Tile({
     source: new ol.source.OSM()
     })
     ];*/

    /*layerBase = new OpenLayers.Layer.WMS( "OpenLayers WMS",
     "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'} );*/

    /*Se añade la capa al mapa*/
    mapa.addLayer(layerBase);
    /*Se oculta el mapa hasta que se cargue toda la información*/
    $("#miMapa").css("display", "none");



    function addMarkers1() {
        var ll, popupClass, popupContentHTML;
        //
        //Anchored NO OVERFLOW
        //
        //anchored bubble popup small contents autosize maxsize closebox
        // ll = new OpenLayers.LonLat(-5, -20);
        lat = -0.20300087;
        lng = -78.4987696;
        //ll = new OpenLayers.LonLat(lng, lat);
        ll = new OpenLayers.LonLat(lng, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                mapa.getProjectionObject());

        /*popupClass = AutoSizeAnchoredMinSize;
         popupContentHTML = '<img src="sun.png"></img>';
         addMarker1(ll, popupClass, popupContentHTML, true, true);
         //anchored bubble popup bigger contents autosize closebox*/


        popupClass = AutoSizeAnchoredMinSize;
        popupContentHTML = '<div style="background-color:white;">' + samplePopupContentsHTML + '</div>';
        addMarker1(ll, popupClass, popupContentHTML, true, true);
        //anchored bubble popup bigger contents autosize closebox

    }


    function addMarker1(ll, popupClass, popupContentHTML, closeBox, overflow) {

        var feature = new OpenLayers.Feature(markers1, ll);
        feature.closeBox = closeBox;
        feature.popupClass = popupClass;
        feature.data.popupContentHTML = popupContentHTML;
        feature.data.overflow = (overflow) ? "auto" : "hidden";

        var marker = feature.createMarker();
        lat = -0.20300087;
        lng = -78.4987696;
        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('sun.png', size, offset);
        //marker = new OpenLayers.Marker(new OpenLayers.LonLat(lng, lat), icon.clone());
        //marker.icon = new OpenLayers.Icon('sun.png' , size, offset);
        //marker.icon.imageDiv.firstChild.setAttribute('src', 'sun.png');



        var size = new OpenLayers.Size(20, 30);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('sun.png', size, offset);
        marker = new OpenLayers.Marker(new OpenLayers.LonLat(lng, lat).transform(
                new OpenLayers.Projection("EPSG:4326"),
                mapa.getProjectionObject()), icon.clone());

        markers1.addMarker(marker);

        //html = '<div style="background-color:white;"> olui </div>';

        /*marker.events.register("mousedown", marker, function(marker) {
         putPopup(lat, lng, html);
         });*/


        var markerClick = function(evt) {
            if (this.popup === null) {
                this.popup = this.createPopup(this.closeBox);
                mapa.addPopup(this.popup);
                this.popup.show();
            } else {
                this.popup.toggle();
            }
            currentPopup = this.popup;
            OpenLayers.Event.stop(evt);
        };

        marker.events.register("mousedown", feature, markerClick);






    }

    function putPopup(x, y, html) {
        popup = new OpenLayers.Popup.FramedCloud("chicken",
                new OpenLayers.LonLat(x, y).transform(
                new OpenLayers.Projection("EPSG:4326"),
                mapa.getProjectionObject()),
                null,
                html,
                null,
                true);

        mapa.addPopup(popup);

    }

    navigator.geolocation.getCurrentPosition(success, error);

    /*Si no se recuperan las coordenadas, se mostrará por defecto la localizacion de Quito*/
    /*Cuando el browser no soporta la geolocalizacion*/
    if (!navigator.geolocation) {
        //bandera = 3;
        //alert(bandera);
        /*ojo la lines document.getElementById("#miMapa").innerHTML = "" hay q verificar si va o no ahi */
        //document.getElementById("#miMapa").innerHTML = "";
        //alert('geolocation' + bandera);
        /*Se muestran lso div que contienen el nombre de la DPA*/
        $(".infoUbicacion").css("display", "block");
        $("#labelUbicacion").html("Usted se encuentra en:");
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
    } /*else {
     //se cambio esto por el else estaba fuera del if
     //Recupera la posicion del dispositivo y se redirije a success y si no se redirije a error
     alert('busca la loca para rediijir a success o error');
     navigator.geolocation.getCurrentPosition(success, error);
     }*/


    /*Se dibuja el mapa de acuerdo a las coordenadas proporcionadas en el dispositivo*/
    function success(position) {
        //bandera = 1;
        //alert(bandera);
        //alert('success'); 
        //document.getElementById("#miMapa").innerHTML = "";

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
        mapa.setCenter(lnglat, 12);
        var markers = new OpenLayers.Layer.Markers("Marcas");
        mapa.addLayer(markers);
        markers1 = new OpenLayers.Layer.Markers("MSP");
        mapa.addLayer(markers1);

        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('puntero.png', size, offset);
        markers.addMarker(new OpenLayers.Marker(lnglat, icon));

        mapa.addControl(new OpenLayers.Control.LayerSwitcher());

        ViewCombos();
        addMarkers1();
        //servicios();
    }
    ;

    /*Si hay un error de conexion o falla de datos de mostrara por defecto la ciudad de Quito*/
    function error() {
        //bandera = 2;
        //alert('error' + bandera);
        //document.getElementById("#miMapa").innerHTML = "";

        /*Se muestran la leyendas de ubicacion*/
        $(".infoUbicacion").css("display", "block");
        $("#labelUbicacion").html("Usted se encuentra en:");
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



    //Se encarga de agregar un marcador en la posicion dada
    /**
     Longitud: Longitud en el mapa
     Latitud: Latitud en el mapa
     MensajeHtml: Codigo html que se mostrara en el popup
     */

    /******************************************************************/
    /*****************SERVICIOS******************/
    /******************************************************************/
    //http://192.168.50.4:8080/ServicioREST/rest/mcds/busquedaCercanos/779388/9979526/1000

    /*function servicios() {
     lat = -0.20300087;
     lng = -78.4987696;
     var lnglat = new OpenLayers.LonLat(lng, lat).transform(
     new OpenLayers.Projection("EPSG:4326"),
     mapa.getProjectionObject());
     mapa.setCenter(lnglat, 12);
     var markers = new OpenLayers.Layer.Markers("Marcas");
     mapa.addLayer(markers);
     
     var size = new OpenLayers.Size(21, 25);
     var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
     var icon = new OpenLayers.Icon('sun.png', size, offset);
     markers.addMarker(new OpenLayers.Marker(lnglat, icon));
     }*/

    /******************************************************************/
    /*Funcion Knockout.js para mostrar la informacion******************/
    /******************************************************************/





    function ViewCombos() {

        var lista;
        /*Se oculta la imagen de cargando se muestra el mapa*/
        $(".loadingPag").css("display", "none");
        $(".infoTerritorial").css("display", "block");
        $("#miMapa").css("display", "block");

        //servcios
        $.ajax({
            //url: "http://localhost:8080/ServicioREST/rest/mcds/busquedaCercanos/1.444852/-78.861077/0.25",
            url: "http://localhost:8080/ServicioREST/rest/mcds/busquedaCercanos/-0.20300087/-78.4987696/0.010",
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data)
            {



                /*var htmlStr = '<div style="height: 200px; width: 400px; border: 1px  solid black;"> Titulo</br> Contenido, puedo digitar lo que desee y lo mejor es que puede ser codigo html, asi que podemos colocar imagenes, fondos, links, etc </div>';
                 var popupContentHTML = '<img src="sun.png"></img>';
                 for (var i = 0; i < data.length; i++) {
                 lat = data[i].latgps;
                 lng = data[i].longps;
                 //agregarMarcador(lng, lat, popupContentHTML, true, true);
                 console.log(lng + "||" + lat);
                 }*/















                //alert(data[0].lon);
                /*for (var i = 0; i < data.length; i++) {
                 
                 //lat = -0.20300087;
                 //lng = -78.4987696;
                 lat = data[i].latgps;
                 lng = data[i].longps;
                 console.log("hhh");
                 console.log("lat:" + lat + "lon:" + lng);
                 
                 var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                 new OpenLayers.Projection("EPSG:4326"),
                 mapa.getProjectionObject());
                 mapa.setCenter(lnglat, 12);
                 var markers = new OpenLayers.Layer.Markers("Marcas");
                 mapa.addLayer(markers);
                 
                 var size = new OpenLayers.Size(21, 25);
                 var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                 var icon = new OpenLayers.Icon('sun.png', size, offset);
                 markers.addMarker(new OpenLayers.Marker(lnglat, icon));
                 
                 
                 }*/



            },
            error: function() {
                alert('Failed!');

            },
        });

        //funcion para agregar un marker
        /*function agregarMarcador(longitud, latitud, mensajeHtml, closeBox, overflow)
         {
         ll = new OpenLayers.LonLat(longitud, latitud);
         var popupClass = AutoSizeAnchoredMinSize;
         var popupContentHTML = mensajeHtml;
         
         var feature = new OpenLayers.Feature(markers, ll);
         feature.closeBox = closeBox;
         feature.popupClass = popupClass;
         feature.data.popupContentHTML = popupContentHTML;
         
         feature.data.overflow = (overflow) ? "auto" : "hidden";
         //var markers = new OpenLayers.Layer.Markers("Marcash");
         var marker = feature.createMarker();
         
         var markerClick = function(evt) {
         if (this.popup === null)
         {
         this.popup = this.createPopup(this.closeBox);
         mapa.addPopup(this.popup);
         this.popup.show();
         } else {
         this.popup.toggle();
         }
         currentPopup = this.popup;
         OpenLayers.Event.stop(evt);
         };
         
         mapa.addLayer(markers);
         marker.events.register("mousedown", feature, markerClick);
         var size = new OpenLayers.Size(21, 25);
         var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
         var icon = new OpenLayers.Icon('sun.png', size, offset);
         markers.addMarker(marker, icon);
         }*/




        /*Funcion ajax para consultar la DPA dadas las coordenadas */
        $.ajax({
            /*Se envia la consulta al servidor de mapas de SIISE*/
            url: "cadenaMapa.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                //http://192.168.10.31:8080/WSMapas/webresources/territorial/3/-78.4987696/-0.20300087;
                var cadena = ipserver + "/WSMapas/webresources/territorial/3/" + lng + "/" + lat;

                $.getJSON(cadena, function(result) {
                    var objeto = result[0];
                    nombre_prv = objeto[5];
                    nombre_ciu = objeto[3];
                    /*Se setea en los divs el nombre de el canton y parroquia*/
                    //alert(nombre_prv);
                    $("#provincia").html("Usted se encuentra en: " + nombre_prv + " - " + nombre_ciu);
                    $("#canton").html(nombre_ciu);

                    var prv = objeto[4];
                    var canton = objeto[2];
                    codigo_ciu = Number(canton.substring(2, 4));
                    codigo_prv = Number(prv);

















                });
            }
        });

    }

    /*Se inicializa knockout*/
    ko.applyBindings(new ViewCombos());

}