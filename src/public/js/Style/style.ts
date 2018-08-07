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

document.addEventListener('keydown', function (ev: any) {
    if(!navMap.flag) {
        return;
    }
    if(ev.keyCode === 39 && navMap.active < 4) {
        animationSlideLeft(navMap[navMap.active], navMap[navMap.active+1]);
        navMap.active++;
    }
    if(ev.keyCode === 37 && navMap.active > 1) {
        animationSlideRight(navMap[navMap.active], navMap[navMap.active-1]);
        navMap.active--;
    }
});

function animationSlideLeft(hide: Slideable, show: Slideable) {
    navMap.flag = false;
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
            navMap.flag = true;
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
    navMap.flag = false;
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
            navMap.flag = true;
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

function slideToWatched() {
    if(navMap.active === 1) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    animationSlideRight(navMap[navMap.active], watched);
    navMap.active = 1;
}

function slideToPlaylist() {
    if(navMap.active === 2) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    if(navMap.active > 2) {
        animationSlideRight(navMap[navMap.active], playlist);
    } else {
        animationSlideLeft(navMap[navMap.active], playlist);
    }
    navMap.active = 2;
}

function slideToNotWatched() {
    if(navMap.active === 3) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    if(navMap.active > 3) {
        animationSlideRight(navMap[navMap.active], notWatched);
    } else {
        animationSlideLeft(navMap[navMap.active], notWatched);
    }
    navMap.active = 3;
}

function slideToDetails() {
    if(navMap.active === 4) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    animationSlideLeft(navMap[navMap.active], details);
    navMap.active = 4;
}

function resizeSegment(parent: HTMLElement, callback: Function) {
    let currentHeight = parent.parentElement.getBoundingClientRect().height;
    let heightRange;
    let newHeight;
    let noElements = (parent.children.length === 1);
    if(noElements) {
        heightRange = currentHeight;
        newHeight = 0;
    } else {
        heightRange = 168;
        newHeight = currentHeight - heightRange;
    }
    const stepHeight = heightRange * (5/100);
    const interval = setInterval(function () {
        if(currentHeight - stepHeight <= newHeight) {
            clearInterval(interval);
            parent.parentElement.style.height = newHeight+'px';
            if(noElements) {
                parent.parentElement.style.visibility = 'hidden';
            }
            callback();
            navMap.flag = true;
        }
        currentHeight -= stepHeight;
        parent.parentElement.style.height = currentHeight+'px';
    }, 10);
}

function reorderSiblings(html: HTMLElement, slideRangeForDiagonal: number, callback: Function) {
    let startIndex = 1;
    for (let i = 0; i < html.parentElement.children.length; i++) {
        if(html.parentElement.children[i].id === html.id) {
            startIndex = i + 1;
            break;
        }
    }
    let bool = false;
    let slideRightMax = slideRangeForDiagonal;
    const newCallback = function () {
        if(bool) {
            resizeSegment(html.parentElement, callback);
        } else {
            callback();
            navMap.flag = true;
        }
    };
    if(startIndex === html.parentElement.children.length) {
        if(slideRangeForDiagonal === 0) {
            resizeSegment(html.parentElement, callback);
            return;
        }
        callback();
        navMap.flag = true;
        return;
    }
    for (let i = startIndex; i < html.parentElement.children.length; i++) {
        let current = html.parentElement.children[i];
        if(current.getBoundingClientRect().left <= 35) {
            if(i + 1 === html.parentElement.children.length) {
                bool = true;
                moveSiblingDiagonal(current, slideRightMax, newCallback);
            } else {
                moveSiblingDiagonal(current, slideRightMax);
            }
        } else {
            slideRightMax = current.getBoundingClientRect().left-35;
            if(i + 1 === html.parentElement.children.length) {
                moveSiblingLeft(current, newCallback);
            } else {
                moveSiblingLeft(current);
            }
        }
    }
}

function moveSiblingLeft(element: any, callback?: Function) {
    element.style.position = 'relative';
    const leftRange = 365;
    const stepRange = leftRange * (5/100);
    let current = 0;
    const interval = setInterval(function () {
        if(current + stepRange >= leftRange) {
            clearInterval(interval);
            element.style.right = leftRange+'px';
            if(callback !== undefined) {
                callback();
            }
        }
        current += stepRange;
        element.style.right = current+'px';
    }, 10);
}

function moveSiblingDiagonal(element: any, slideRightMax: number, callback?: Function) {
    element.style.position = 'relative';
    const topRange = 168;
    const stepRangeTop = topRange * (5/100);
    const stepRangeRight = slideRightMax * (5/100);
    let currentTop = 0;
    let currentRight = 0;
    const interval = setInterval(function () {
        if(currentTop + stepRangeTop >= topRange) {
            element.style.bottom = topRange+'px';
            currentTop = topRange;
        }
        if(currentRight + stepRangeRight >= slideRightMax) {
            element.style.left = slideRightMax+'px';
            currentRight = slideRightMax;
        }
        if(currentTop === topRange && currentRight === slideRightMax) {
            clearInterval(interval);
            if(callback !== undefined) {
                callback();
            }
            return;
        }
        currentTop += stepRangeTop;
        currentRight += stepRangeRight;
        element.style.bottom = currentTop+'px';
        element.style.left = currentRight+'px';
    }, 10);
}

function slideListElementLeft(listElement: ListElement, callback: Function) {
    navMap.flag = false;
    const html = listElement.getElement();
    html.style.position = 'relative';
    const slideRangeForDiagonal = html.getBoundingClientRect().left-35;
    const slideRange = html.getBoundingClientRect().right+10;
    const stepRange = slideRange * (5/100);
    let currentRange = 0;
    const interval = setInterval(function () {
        if(currentRange >= slideRange) {
            clearInterval(interval);
            reorderSiblings(html, slideRangeForDiagonal, callback);
            return;
        }
        currentRange += stepRange;
        html.style.right = currentRange+'px';
    }, 10);
}

function slideListElementRight(listElement: ListElement, callback: Function) {
    navMap.flag = false;
    const html = listElement.getElement();
    html.style.position = 'relative';
    const slideRangeForDiagonal = html.getBoundingClientRect().left-35;
    const slideRange = (innerWidth - html.getBoundingClientRect().left)+10;
    const stepRange = slideRange * (5/100);
    let currentRange = 0;
    const interval = setInterval(function () {
        if(currentRange >= slideRange) {
            clearInterval(interval);
            reorderSiblings(html, slideRangeForDiagonal, callback);
            return;
        }
        currentRange += stepRange;
        html.style.left = currentRange+'px';
    }, 10);
}