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
    window.onscroll = function () {
        myFunction()
    };

    let pages: any = document.getElementsByClassName('page');
    let navTabs = document.getElementById('nav-tabs');
    let sticky = navTabs.offsetTop;

    function setMargin(str) {
        for (let i = 0; i < pages.length; i++) {
            pages[i].style.marginTop = str;
        }
    }

    function myFunction() {
        if (window.pageYOffset > sticky) {
            navTabs.style.position = 'fixed';
            setMargin('67px');
        } else {
            navTabs.style.position = 'static';
            setMargin('20px');
        }
    }
});
