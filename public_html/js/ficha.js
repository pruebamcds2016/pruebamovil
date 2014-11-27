/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function ViewModelFicha() {
    if (location.search.substr(1)) {
        dirFicha = location.search.substr(1);
    }



    $('#ficha').load(dirFicha);

}
// Activamos knockout.js
ko.applyBindings(new ViewModelFicha());
