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

function animationSlideLeft(hide: Slideable, show: Slideable) {
    show.activateTab();
    hide.deactivateTab();
    const toHide = hide.getPageElement();
    const toShow = show.getPageElement();
    let slideRange = innerWidth;
    toShow.style.left = innerWidth+'px';
    show.showPage();
    const interval = setInterval(function () {
        if(slideRange <= 0) {
            clearInterval(interval);
            hide.hidePage();
            toHide.style.left = '0px';
            toShow.style.left = '0px';
            return;
        }
        slideRange -= 80;
        if(slideRange < 0) {
            slideRange = 0;
        }
        toShow.style.left = (slideRange)+'px';
        toHide.style.left = (slideRange-innerWidth)+'px';
    }, 10);
}

function animationSlideRight(hide: Slideable, show: Slideable) {
    show.activateTab();
    hide.deactivateTab();
    const toHide = hide.getPageElement();
    const toShow = show.getPageElement();
    let slideRange = (-1 * innerWidth);
    toShow.style.left = (-1 * innerWidth)+'px';
    show.showPage();
    const interval = setInterval(function () {
        if(slideRange >= 0) {
            clearInterval(interval);
            hide.hidePage();
            toHide.style.left = '0px';
            toShow.style.left = '0px';
            return;
        }
        slideRange += 80;
        if(slideRange > 0) {
            slideRange = 0;
        }
        toShow.style.left = (slideRange)+'px';
        toHide.style.left = (slideRange+innerWidth)+'px';
    }, 10);
}