/**
 * Created by davidshanline on 10/29/16.
 * This class is used to initialize various controllers for the application
 */

$(document).ready(function () {

    var appMain =
    {
        appCtrl : new appCtrl()

    };
    window.main = appMain;

    ko.applyBindings(appMain);

    //this segment of code is for highlighting the text in the typeahead input box when a user clicks in it.
    $(document).on('focus', '#searchTextBox', function(){
        this.select();
    }).on('mouseup', '#searchTextBox', function(e){
        e.preventDefault();
    });

});