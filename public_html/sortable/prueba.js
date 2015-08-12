/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {

    //$('#example').dataTable();
    


    //alert("kiubo");
    var g = "<table id='example' class='display' cellspacing='0' width='100%'><thead><tr><th class='sorttable_sorted'>Nombre<span id='sorttable_sortfwdind'>&nbsp;▾</span></th></tr></thead><tr><td>a</td></tr><tr><td>z</td></tr></table>";

    $('#a').html(g);
    
    $('#example').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": false});


});





