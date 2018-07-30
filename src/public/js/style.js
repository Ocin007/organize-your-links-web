/*
var myWindow;

function openWin() {
    myWindow = window.open("", "myWindow", "width=200,height=100");
    myWindow.document.write("<p>This is 'myWindow'</p>");
}

function closeWin() {
    myWindow.close();
}
*/
document.addEventListener('DOMContentLoaded', function () {
    window.onscroll = function() {myFunction()};

    var navTabs = document.getElementById('nav-tabs');
    var sticky = navTabs.offsetTop;

    function myFunction() {
        if (window.pageYOffset > sticky) {
            navTabs.style.position = 'fixed';
        } else {
            navTabs.style.position = 'static';
        }
    }
});
