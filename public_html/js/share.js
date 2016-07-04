/* 
 * Javascript compartir
 * Vista del index
 * autor: @Adriana.Romero
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
        case "4":0
            url = "grafica.html";
            break;
        default:
            url = "";
    }*/

    var pageTitle = document.title + " - SISEcuador "; //HTML page title
    var pageUrl = 'http://www.siise.gob.ec/shareProduccionSISEcuadorv2/share/public_html/' + url + '?' + id_tema + '&' + id_ib + '&' + id_subtema; //Location of the page
    //var pageUrl = 'http://www.siise.gob.ec:8080/sharePruebas/share/public_html/' + url + '?' + id_tema + '&' + id_ib + '&' + id_subtema; //Location of the page
    //var pageUrl = 'http://192.168.50.76:8383/share/' + url + '?' + id_tema + '&' + id_ib + '&' + id_subtema; //Location of the page
    var openLink = '';

    //$('#btnWhatsApp').attr("href","whatsapp://send?text=Compartiendo informacion desde "+encodeURIComponent(pageUrl));
    //user clicks on a share button
    $('.button-wrap').click(function(event) {
        var shareName = $(this).attr('class').split(' ')[0]; //get the first class name of clicked element

        switch (shareName) //switch to different links based on different social name
        {
            case 'facebook':
                //openLink = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                openLink = 'http://m.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl) + '&t=' + encodeURIComponent('Miniterio Coordinador de Desarrollo Social');
                break;
            case 'twitter':
                //openLink = 'http://twitter.com/home?status=' + encodeURIComponent(pageTitle + ' ' + pageUrl);                
                openLink = 'http://www.twitter.com/share?text=' + encodeURIComponent('Compartiendo información desde #SISEcuador Sistema de Información Social del Ecuador del @SocialEc #MCDS') + '&url=' + encodeURIComponent(pageUrl);
                break;
            case 'google':
                openLink = 'https://plus.google.com/share?url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'email':
                openLink = 'mailto:?subject=' + pageTitle
                        + '&body= Se ha compartido información del Miniterio Coordinador de Desarrollo Social - MCDS ' + encodeURIComponent(pageUrl);
                break;
            case 'whatsapp':
                //$('#btnWhatsApp').attr("href","whatsapp://send?text=Compartiendo informacion desde "+encodeURIComponent(pageUrl));
                openLink = 'whatsapp://send?text= Información compartida desde la aplicación "Sistema de Informacion Social del Ecuador SISEcuador" del Miniterio Coordinador de Desarrollo Social MCDS. ' + encodeURIComponent(pageUrl);
                break;

        }

        //Parameters for the Popup window
        winWidth = 650;
        winHeight = 450;
        winLeft = ($(window).width() - winWidth) / 2,
                winTop = ($(window).height() - winHeight) / 2,
                winOptions = 'width=' + winWidth + ',height=' + winHeight + ',top=' + winTop + ',left=' + winLeft;

        //open Popup window and redirect user to share website.
        window.open(openLink, 'Compartir este enlace', winOptions);

       return false;
    });


});