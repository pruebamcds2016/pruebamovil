/* 
 * Javascript compartir
 * Vista del index
 * autor: @Adriana.Romero
 */
$(document).ready(function() {

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        id_provincia = elem[0];
        id_canton = elem[1];
        id_parroquia = elem[2];
        id_institucion = elem[3];
        id_tipologia = elem[4];
        id_estado = elem[5];

    }
    //Cuando en la url tien maas de 3 parametros en la url
    if (elem.length > 3) {
        url = "DetalleInfraestructuraSocial.html";
    } else {
        if (id_provincia === '3') {
            url = "cnsT1.html";
        } else {
            if (id_parroquia === '0') {

                url = "cnsT2.html";
            } else {

                url = "cnsT3.html";
            }
        }

    }
    
    //var ip = 'http://www.siise.gob.ec:8080/sharePruebas/share/public_html/'; //ip pruebas
    var ip = 'http://www.siise.gob.ec/shareProduccionSISEcuadorv2/share/public_html/'; //ip pruebas
    //var ip = 'http://192.168.50.76:8383/share/'; //mi pc
    var pageTitle = document.title; //HTML page title
    if (elem.length > 3) {
        //var pageUrl = 'http://192.168.50.76:8383/share/' + url + '?' + id_provincia + '&' + id_canton + '&' + id_parroquia+ '&' + id_institucion + '&' + id_estado;
        var pageUrl = ip + url + '?' + id_provincia + '&' + id_canton + '&' + id_parroquia+ '&' + id_institucion + '&' + id_tipologia + '&' + id_estado;
    } else {
        var pageUrl = ip + url + '?' + id_provincia + '&' + id_canton + '&' + id_parroquia;
    }

    //Location of the page
    var openLink = '';


    //user clicks on a share button
    $('.button-wrap').click(function(event) {
        var shareName = $(this).attr('class').split(' ')[0]; //get the first class name of clicked element

        switch (shareName) //switch to different links based on different social name
        {
            case 'facebook':
                //openLink = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                openLink = 'http://m.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl) + '&t=' + encodeURIComponent('Ministerio de Coordinación de Desarrollo Social');
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
                        + '&body= Se ha compartido información del Ministerio de Coordinación de Desarrollo Social - MCDS ' + encodeURIComponent(pageUrl);
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