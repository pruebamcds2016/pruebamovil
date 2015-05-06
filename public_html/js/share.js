/* 
 * Javascript compartir
 * Vista del index
 * autor: @Adriana.Romero
 */


/**
 * 
 */
$(document).ready(function() {
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        id_tema = elem[0];
        id_ib = elem[1];
        id_subtema = elem[2];
    }
    var url;
    url = "grafica.html";
    /*switch (id_tema) {
     case "1":
     url = "grafica.html";
     break;
     case "2":
     url = "relvGrafica.html";
     break;
     case "4":
     url = "grafica.html";
     break;
     default:
     url = "";
     }*/

    var pageTitle = document.title + " - SISEcuador "; //HTML page title
    var pageUrl = 'http://192.168.50.76:8383/share/' + url + '?' + id_tema + '&' + id_ib + '&' + id_subtema; //Location of the page
    var openLink = '';

    $('.twitter').click(function(event) {

        openLink = 'http://www.twitter.com/intent/tweet?text=' + encodeURIComponent('Compartiendo información desde #SISEcuador Sistema de Información Social del Ecuador del @SocialEc #MCDS') + '&url=' + encodeURIComponent(pageUrl);


        winWidth = 650;
        winHeight = 450;
        winLeft = ($(window).width() - winWidth) / 2,
                winTop = ($(window).height() - winHeight) / 2,
                winOptions = 'width=' + winWidth + ',height=' + winHeight + ',top=' + winTop + ',left=' + winLeft;

        window.open(openLink, 'Compartir este enlace', winOptions);

        //return false;
    });


    $('.facebook').click(function(event) {

        openLink = 'http://m.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl) + '&t=' + encodeURIComponent('Miniterio Coordinador de Desarrollo Social');


        winWidth = 650;
        winHeight = 450;
        winLeft = ($(window).width() - winWidth) / 2,
                winTop = ($(window).height() - winHeight) / 2,
                winOptions = 'width=' + winWidth + ',height=' + winHeight + ',top=' + winTop + ',left=' + winLeft;

        window.open(openLink, 'Compartir este enlace', winOptions);

        //return false;
    });

    $('.google').click(function(event) {

        openLink = 'https://plus.google.com/share?url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);


        winWidth = 650;
        winHeight = 450;
        winLeft = ($(window).width() - winWidth) / 2,
                winTop = ($(window).height() - winHeight) / 2,
                winOptions = 'width=' + winWidth + ',height=' + winHeight + ',top=' + winTop + ',left=' + winLeft;

        window.open(openLink, 'Compartir este enlace', winOptions);

        //return false;
    });


});
