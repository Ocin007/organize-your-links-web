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
let blockKeyboardNav = false;
let blockKeyboardOnInputFocus = false;
document.addEventListener('keydown', function (ev: any) {
    if(!navMap.flag || blockKeyboardNav || blockKeyboardOnInputFocus) {
        return;
    }
    if(ev.keyCode === 39) {
        if(navMap.active < 7) {
            animationSlideLeft(navMap[navMap.active], navMap[navMap.active+1]);
            navMap.active++;
        } else {
            animationSlideLeft(navMap[7], navMap[1]);
            navMap.active = 1;
        }
    }
    if(ev.keyCode === 37) {
        if(navMap.active > 1) {
            animationSlideRight(navMap[navMap.active], navMap[navMap.active-1]);
            navMap.active--;
        } else {
            animationSlideRight(navMap[1], navMap[7]);
            navMap.active = 7;
        }
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
    if(navMap.active > 4) {
        animationSlideRight(navMap[navMap.active], details);
    } else {
        animationSlideLeft(navMap[navMap.active], details);
    }
    navMap.active = 4;
}

function slideToCreate() {
    if(navMap.active === 5) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    if(navMap.active > 5) {
        animationSlideRight(navMap[navMap.active], create);
    } else {
        animationSlideLeft(navMap[navMap.active], create);
    }
    navMap.active = 5;
}

function slideToEdit() {
    if(navMap.active === 6) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    if(navMap.active > 6) {
        animationSlideRight(navMap[navMap.active], edit);
    } else {
        animationSlideLeft(navMap[navMap.active], edit);
    }
    navMap.active = 6;
}

function slideToRanking() {
    if(navMap.active === 7) {
        return;
    }
    if(!navMap.flag) {
        return;
    }
    animationSlideLeft(navMap[navMap.active], ranking);
    navMap.active = 7;
}


function resizeSegment(parent: HTMLElement, relSpeed: number, callback: Function) {
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
    const stepHeight = heightRange * relSpeed;
    const interval = setInterval(function () {
        if(currentHeight - stepHeight <= newHeight) {
            clearInterval(interval);
            parent.parentElement.style.height = newHeight+'px';
            if(noElements) {
                parent.parentElement.style.visibility = 'hidden';
            }
            navMap.flag = true;
            callback();
        }
        currentHeight -= stepHeight;
        parent.parentElement.style.height = currentHeight+'px';
    }, 10);
}

function reorderSiblings(html: HTMLElement, slideRangeForDiagonal: number, relSpeed: number, callback: Function) {
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
            resizeSegment(html.parentElement, relSpeed, callback);
        } else {
            navMap.flag = true;
            callback();
        }
    };
    if(startIndex === html.parentElement.children.length) {
        if(slideRangeForDiagonal === 0) {
            resizeSegment(html.parentElement, relSpeed, callback);
            return;
        }
        navMap.flag = true;
        callback();
        return;
    }
    for (let i = startIndex; i < html.parentElement.children.length; i++) {
        let current = html.parentElement.children[i];
        if(current.getBoundingClientRect().left <= 35) {
            if(i + 1 === html.parentElement.children.length) {
                bool = true;
                moveSiblingDiagonal(current, slideRightMax, relSpeed, newCallback);
            } else {
                moveSiblingDiagonal(current, slideRightMax, relSpeed);
            }
        } else {
            slideRightMax = current.getBoundingClientRect().left-15;
            if(i + 1 === html.parentElement.children.length) {
                moveSiblingLeft(current, relSpeed, newCallback);
            } else {
                moveSiblingLeft(current, relSpeed);
            }
        }
    }
}

function moveSiblingLeft(element: any, relSpeed: number, callback?: Function) {
    element.style.position = 'relative';
    const leftRange = element.getBoundingClientRect().width+25;
    const stepRange = leftRange * relSpeed;
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

function moveSiblingDiagonal(element: any, slideRightMax: number, relSpeed: number, callback?: Function) {
    element.style.position = 'relative';
    const topRange = element.getBoundingClientRect().height+30;
    const stepRangeTop = topRange * relSpeed;
    const stepRangeRight = slideRightMax * relSpeed;
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

function slideListElementLeft(listElement: ListElement, relSpeed: number, callback: Function) {
    navMap.flag = false;
    const html = listElement.getElement();
    html.style.position = 'relative';
    const slideRangeForDiagonal = html.getBoundingClientRect().left-15;
    const slideRange = html.getBoundingClientRect().right+10;
    const stepRange = slideRange * relSpeed;
    let currentRange = 0;
    const interval = setInterval(function () {
        if(currentRange >= slideRange) {
            clearInterval(interval);
            reorderSiblings(html, slideRangeForDiagonal, relSpeed, callback);
            return;
        }
        currentRange += stepRange;
        html.style.right = currentRange+'px';
    }, 10);
}

function slideListElementRight(listElement: ListElement, relSpeed: number, callback: Function) {
    navMap.flag = false;
    const html = listElement.getElement();
    html.style.position = 'relative';
    const slideRangeForDiagonal = html.getBoundingClientRect().left-15;
    const slideRange = (innerWidth - html.getBoundingClientRect().left)+10;
    const stepRange = slideRange * relSpeed;
    let currentRange = 0;
    const interval = setInterval(function () {
        if(currentRange >= slideRange) {
            clearInterval(interval);
            reorderSiblings(html, slideRangeForDiagonal, relSpeed, callback);
            return;
        }
        currentRange += stepRange;
        html.style.left = currentRange+'px';
    }, 10);
}

function slideOpenOptions(element: HTMLElement) {
    // navMap.flag = false;
    blockKeyboardNav = true;
    element.style.right = '0px';
}

function slideCloseOptions(element: HTMLElement) {
    // navMap.flag = true;
    blockKeyboardNav = false;
    element.style.right = '-25%';
}