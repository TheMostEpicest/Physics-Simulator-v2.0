// Variable Declaration
var selectedObject;
var selectedElement;
var movingObject;
var movingVelocityX;
var movingVelocityY;
var popupObject;
var matrixObject;
var velocityCounter = 0;
var popupContent = "";
var newObjectRotation;
var createObjectLock = false;
var confirmDelete = true;
var deletedObjects = [];

// Drag Functions
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, velocityPos1 = 0, velocityPos2 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        if (document.getElementById("popup").contains(e.target) !== true){
            for (n = 1; n <= objectCount; n++) {
                if (eval("object" + n).element === elmnt) {
                    movingObject = eval("object" + n);
                    movingVelocityX = movingObject.velocityX;
                    movingVelocityY = movingObject.velocityY;
                }
            }
        }
        if (e.target === document.getElementById("popup") || document.getElementById("popup").contains(e.target) === true) {
        document.getElementById("popup").style.borderColor = "#0078d7";
        document.getElementById("popupheader").style.backgroundColor = "#0078d7";
    } else {
        document.getElementById("popup").style.borderColor = "#91c4ed";
        document.getElementById("popupheader").style.backgroundColor = "#91c4ed";
    }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        document.getElementById("context-menu").style.opacity = "0";
        setTimeout(function () {document.getElementById("context-menu").style.zIndex = "-1"}, 100);
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (movingObject !== undefined){
            movingObject.onGround = false;
            movingObject.positionX = elmnt.offsetLeft - pos1;
            movingObject.positionY = elmnt.offsetTop - pos2;
            if (movingObject.fixed !== true) {
                movingObject.velocityX = -10 * pos1;
                movingObject.velocityY = -10 * pos2;
            }
        }
        if (typeof(document.getElementById("object" + (objectCount + 1))) !== undefined && document.getElementById("object" + (objectCount + 1)) !== null) {
            if (document.getElementById("object" + (objectCount + 1)).contains(e.target)) {
                updateNewMatrix();
            }
        }
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        if (movingObject === matrixObject){
            detectCollision();
            drawArrows();
            if (popupContent === "matrix") {
                setMatrix(movingObject);
            }
        }
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        if (movingObject !== undefined) {
            movingObject.onGroundAccelerationSet = false;
            movingObject = undefined;
        }
    }
}

// Context Menu Functions
function checkLocation(e) {
    if (e.target !== document.getElementById("context-menu") && document.getElementById("context-menu").contains(e.target) === false) {
        document.getElementById("context-menu").style.opacity = "0";
        setTimeout(function () {document.getElementById("context-menu").style.zIndex = "-1"}, 100);
    }
    if (e.target === document.getElementById("popup") || document.getElementById("popup").contains(e.target) === true || e.target === document.getElementById("context-menu").children[1] || e.target === document.getElementById("new-object")) {
        document.getElementById("popup").style.borderColor = "#0078d7";
        document.getElementById("popupheader").style.backgroundColor = "#0078d7";
    } else {
        document.getElementById("popup").style.borderColor = "#91c4ed";
        document.getElementById("popupheader").style.backgroundColor = "#91c4ed";
    }
}
function generalContext(e) {
    e.preventDefault();
    if (e.target === document.getElementById("physics-field")) {
        document.getElementById("context-menu").innerHTML = "";
        var contextMenuP = document.createElement("p");
        if (timePaused === false) {
            contextMenuP.innerHTML = "Pause";
        } else {
            contextMenuP.innerHTML = "Play";
        }
        document.getElementById("context-menu").appendChild(contextMenuP);
        document.getElementById("context-menu").children[0].addEventListener("click", toggleTime, event);
        var contextMenuP = document.createElement("p");
        contextMenuP.innerHTML = "Restart";
        document.getElementById("context-menu").appendChild(contextMenuP);
        document.getElementById("context-menu").children[1].addEventListener("click", restart, event);
        document.getElementById("context-menu").style.zIndex = "1000";
        document.getElementById("context-menu").style.opacity = "1";
        drawContextMenu(e);
    }
}
function objectContext(e) {
    e.preventDefault();
    for (n = 1; n <= objectCount; n++) {
        if (eval("object" + n).element === e.target) {
            selectedObject = eval("object" + n);
        }
        if (eval("object" + n).element.contains(e.target) === true) {
            selectedObject = eval("object" + n);
        }
    }
    document.getElementById("context-menu").innerHTML = "";
    var contextMenuP = document.createElement("p");
    contextMenuP.innerHTML = "Toggle Fixed/Unfixed";
    document.getElementById("context-menu").appendChild(contextMenuP);
    document.getElementById("context-menu").children[0].addEventListener("click", function () {toggleFixed(selectedObject)});
    var contextMenuP = document.createElement("p");
    contextMenuP.innerHTML = "Edit Matrix";
    document.getElementById("context-menu").appendChild(contextMenuP);
    document.getElementById("context-menu").children[1].addEventListener("click", function () {showPopup("matrix", selectedObject)});
    var contextMenuP = document.createElement("p");
    contextMenuP.innerHTML = "Delete Object";
    document.getElementById("context-menu").appendChild(contextMenuP);
    document.getElementById("context-menu").children[2].addEventListener("click", function () {deleteCheck(selectedObject)});
    document.getElementById("context-menu").style.zIndex = "1000";
    document.getElementById("context-menu").style.opacity = "1";
    drawContextMenu(e);
}
function drawContextMenu(e) {
    if (e.clientY + document.getElementById("context-menu").offsetHeight > window.innerHeight) {
            document.getElementById("context-menu").style.top = window.innerHeight - document.getElementById("context-menu").offsetHeight + "px";
        } else {
            document.getElementById("context-menu").style.top = e.clientY + "px";
        }
        if (e.clientX + document.getElementById("context-menu").offsetWidth > window.innerWidth) {
            document.getElementById("context-menu").style.left = window.innerWidth - document.getElementById("context-menu").offsetWidth  + "px";
        } else {
            document.getElementById("context-menu").style.left = e.clientX + "px";
        }
}

// Popup Functions
function showPopup(attribute, popupObject) {
    document.getElementById("popupcontent").innerHTML = "";
    document.getElementById("popup").style.zIndex = "500";
    document.getElementById("popup").style.opacity = "1";
    document.getElementById("popup").style.borderColor = "#0078d7";
    document.getElementById("popupheader").style.backgroundColor = "#0078d7";
    if (attribute === "matrix") {
        popupContent = "matrix";
        matrixObject = selectedObject;
        document.getElementById("popuptitle").innerHTML = "Edit Matrix";
        var tempElement = document.createElement("table");
        tempElement.id = "matrixtable";
        document.getElementById("popupcontent").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixhead";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixheadspace";
        document.getElementById("matrixhead").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixheadx";
        tempElement.innerHTML = "X";
        document.getElementById("matrixhead").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixheady";
        tempElement.innerHTML = "Y";
        document.getElementById("matrixhead").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixpositiontr";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixposition";
        tempElement.innerHTML = "Position";
        document.getElementById("matrixpositiontr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixpositionX";
        tempElement.innerHTML = "<input type='number' onchange=\"updateMatrix('positionX', " + popupObject.name + ")\" value=" + Math.round(popupObject.positionX) + ">";
        document.getElementById("matrixpositiontr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixpositionY";
        tempElement.innerHTML = "<input type='number' onchange=\"updateMatrix('positionY', " + popupObject.name + ")\" value=" + Math.round(popupObject.positionY) + ">";
        document.getElementById("matrixpositiontr").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixvelocitytr";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixvelocity";
        tempElement.innerHTML = "Velocity";
        document.getElementById("matrixvelocitytr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixvelocityX";
        tempElement.innerHTML = "<input type='number' onchange=\"updateMatrix('velocityX', " + popupObject.name + ")\" value=" + Math.round(popupObject.velocityX) + ">";
        document.getElementById("matrixvelocitytr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixvelocityY";
        tempElement.innerHTML = "<input type='number' onchange=\"updateMatrix('velocityY', " + popupObject.name + ")\" value=" + Math.round(popupObject.velocityY) + ">";
        document.getElementById("matrixvelocitytr").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixaccelerationtr";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixacceleration";
        tempElement.innerHTML = "Acceleration";
        document.getElementById("matrixaccelerationtr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixaccelerationX";
        tempElement.innerHTML = "<input type='number' onchange=\"updateMatrix('accelerationX', " + popupObject.name + ")\" value=" + Math.round(popupObject.accelerationX) + ">";
        document.getElementById("matrixaccelerationtr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixaccelerationY";
        tempElement.innerHTML = "<input type='number' onchange=\"updateMatrix('accelerationY', " + popupObject.name + ")\" value=" + Math.round(popupObject.accelerationY) + ">";
        document.getElementById("matrixaccelerationtr").appendChild(tempElement);
    } else if (attribute === "newObject") {
        popupContent = "newObject";
        document.getElementById("popuptitle").innerHTML = "Create New Object";
        var tempElement = document.createElement("table");
        tempElement.id = "matrixtable";
        document.getElementById("popupcontent").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixhead";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixheadspace";
        document.getElementById("matrixhead").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixheadx";
        tempElement.innerHTML = "X";
        document.getElementById("matrixhead").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixheady";
        tempElement.innerHTML = "Y";
        document.getElementById("matrixhead").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixpositiontr";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixposition";
        tempElement.innerHTML = "Position";
        document.getElementById("matrixpositiontr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixpositionX";
        tempElement.innerHTML = "<input type='number' onchange='newObejctPosition()' value='0'>";
        document.getElementById("matrixpositiontr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixpositionY";
        tempElement.innerHTML = "<input type='number' onchange='newObejctPosition()' value='51'>";
        document.getElementById("matrixpositiontr").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixvelocitytr";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixvelocity";
        tempElement.innerHTML = "Velocity";
        document.getElementById("matrixvelocitytr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixvelocityX";
        tempElement.innerHTML = "<input type='number' onchange='newObjectArrows()' value='0'>";
        document.getElementById("matrixvelocitytr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixvelocityY";
        tempElement.innerHTML = "<input type='number' onchange='newObjectArrows()' value='0'>";
        document.getElementById("matrixvelocitytr").appendChild(tempElement);
        var tempElement = document.createElement("tr");
        tempElement.classList.add("matrixtr");
        tempElement.id = "matrixaccelerationtr";
        document.getElementById("matrixtable").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixacceleration";
        tempElement.innerHTML = "Acceleration";
        document.getElementById("matrixaccelerationtr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixaccelerationX";
        tempElement.innerHTML = "<input type='number' onchange='' value='0'>";
        document.getElementById("matrixaccelerationtr").appendChild(tempElement);
        var tempElement = document.createElement("td");
        tempElement.classList.add("matrixtd");
        tempElement.id = "matrixaccelerationY";
        tempElement.innerHTML = "<input type='number' onchange='' value='981'>";
        document.getElementById("matrixaccelerationtr").appendChild(tempElement);
        var tempElement = document.createElement("div");
        tempElement.id = "submit-button";
        tempElement.innerHTML = "Create";
        tempElement.onclick = createJSObject;
        document.getElementById("popupcontent").appendChild(tempElement);
        
    }
    document.getElementById("context-menu").style.opacity = "0";
    setTimeout(function () {document.getElementById("context-menu").style.zIndex = "-1"}, 100);
    
}
function hidePopup() {
    if (createObjectLock === true) {
        cancelNewObject();
    }
    popupContent = "";
    document.getElementById("popup").style.opacity = "0";
    setTimeout(function () {
        document.getElementById("popup").style.zIndex = "-1"
        document.getElementById("popuptitle").innerHTML = "";
        popupObject = undefined;
    }, 250);
}

// Matrix Editing Funcitons
function updateMatrix(property, matrixElement) {
    matrixObject = eval(matrixElement);
    switch (property) {
        case "positionX":
            if (document.getElementById("matrixpositionX").firstChild.value !== "") {
                matrixObject.positionX = parseInt(document.getElementById("matrix" + property).firstChild.value);
            }
            break;
        case "positionY":
            if (document.getElementById("matrixpositionY").firstChild.value !== "") {
            matrixObject.positionY = parseInt(document.getElementById("matrix" + property).firstChild.value);
            }
            break;
        case "velocityX":
            if (document.getElementById("matrixvelocityX").firstChild.value !== "") {
                matrixObject.velocityX = parseInt(document.getElementById("matrix" + property).firstChild.value);
            }
            break;
        case "velocityY":
            if (document.getElementById("matrixvelocityY").firstChild.value !== "") {
                matrixObject.velocityY = parseInt(document.getElementById("matrix" + property).firstChild.value);
            }
            break;
        case "accelerationX":
            if (document.getElementById("matrixaccelerationX").firstChild.value !== "") {
                matrixObject.accelerationX = parseInt(document.getElementById("matrix" + property).firstChild.value);
            }
            break;
        case "accelerationY":
            if (document.getElementById("matrixaccelerationY").firstChild.value !== "") {
                matrixObject.accelerationY = parseInt(document.getElementById("matrix" + property).firstChild.value);
            }
            break;
    }
    matrixObject.onGroundAccelerationSet = false;
    matrixObject.onGround = false;
    drawObjects();
    drawArrows();
}
function setMatrix(popupObject) {
    if (document.activeElement !== document.getElementById("matrixpositionX").firstChild) {
        document.getElementById("matrixpositionX").firstChild.value = Math.round(popupObject.positionX);
    }
    if (document.activeElement !== document.getElementById("matrixpositionY").firstChild) {
        document.getElementById("matrixpositionY").firstChild.value = Math.round(popupObject.positionY);
    }
    if (document.activeElement !== document.getElementById("matrixvelocityX").firstChild) {
        document.getElementById("matrixvelocityX").firstChild.value = Math.round(popupObject.velocityX);
    }
    if (document.activeElement !== document.getElementById("matrixvelocityY").firstChild) {
        document.getElementById("matrixvelocityY").firstChild.value = Math.round(popupObject.velocityY);
    }
    if (document.activeElement !== document.getElementById("matrixaccelerationX").firstChild) {
        document.getElementById("matrixaccelerationX").firstChild.value = Math.round(popupObject.accelerationX);
    }
    if (document.activeElement !== document.getElementById("matrixaccelerationY").firstChild) {
        document.getElementById("matrixaccelerationY").firstChild.value = Math.round(popupObject.accelerationY);
    }
}

// New Object Functions
function createHTMLObject() {
    if (createObjectLock === false) {
        createObjectLock = true;
        var tempElement = document.createElement("div");
        tempElement.classList.add("object");
        tempElement.classList.add("square-1");
        tempElement.id = "object" + (objectCount + 1);
        document.getElementById("physics-field").appendChild(tempElement);
        var tempElement = document.createElement("img");
        tempElement.classList.add("lock");
        tempElement.src = "./lock.png";
        tempElement.id = "lock" + (objectCount + 1);
        document.getElementById("object" + (objectCount + 1)).appendChild(tempElement);
        var tempElement = document.createElement("div");
        tempElement.classList.add("movePosition");
        tempElement.id = "object" + (objectCount + 1) + "header";
        document.getElementById("object" + (objectCount + 1)).appendChild(tempElement);
        var tempElement = document.createElement("div");
        tempElement.classList.add("movePositionDot");
        document.getElementById("object" + (objectCount + 1)).appendChild(tempElement);
        var tempElement = document.createElement("img");
        tempElement.classList.add("arrow");
        tempElement.src = "./arrowpost.png";
        tempElement.id = "arrow" + (objectCount + 1);
        tempElement.style.transform = "scale(0)";
        document.getElementById("physics-field").appendChild(tempElement);
        dragElement(document.getElementById("object" + (objectCount + 1)));
        showPopup("newObject", null);
    }
}
function createJSObject() {
    objectCount++;
    eval("object" + objectCount + " = new object()");
    eval("arrow" + objectCount + " = new arrow()");
    newObject = eval("object" + objectCount);
    newArrow = eval("arrow" + objectCount);
    newObject.positionX = parseInt(document.getElementById("matrixpositionX").firstChild.value);
    newObject.positionY = parseInt(document.getElementById("matrixpositionY").firstChild.value);
    newObject.velocityX = parseInt(document.getElementById("matrixvelocityX").firstChild.value);
    newObject.velocityY = parseInt(document.getElementById("matrixvelocityY").firstChild.value);
    newObject.accelerationX = parseInt(document.getElementById("matrixaccelerationX").firstChild.value);
    newObject.accelerationY = parseInt(document.getElementById("matrixaccelerationY").firstChild.value);
    if (parseInt(document.getElementById("matrixvelocityX").firstChild.value) !== 0) {
        newArrow.rotation = Math.atan(parseInt(document.getElementById("matrixvelocityY").firstChild.value) / parseInt(document.getElementById("matrixvelocityX").firstChild.value));
        } else {
            if (parseInt(document.getElementById("matrixvelocityY").firstChild.value) < 0) {
                newArrow.rotation = Math.PI / -2;
            } else {
                newArrow.rotation = Math.PI / 2;
            }
        }
    if (parseInt(document.getElementById("matrixvelocityX").firstChild.value) < 0) {
        newArrow.rotation += Math.PI;
    }
    newArrow.scale = Math.sqrt((parseInt(document.getElementById("matrixvelocityX").firstChild.value)) ** 2 + parseInt(document.getElementById("matrixvelocityY").firstChild.value) ** 2) / 2000;
    newArrow.left = parseInt(document.getElementById("matrixpositionX").firstChild.value) + parseInt(document.getElementById("object" + objectCount).offsetWidth) / 2;
    newArrow.top = parseInt(document.getElementById("matrixpositionY").firstChild.value) + parseInt(document.getElementById("object" + objectCount).offsetHeight) / 2 - parseInt(document.getElementById("arrow" + objectCount).offsetHeight) / 2;
    
    document.getElementById("object" + objectCount).addEventListener("contextmenu", objectContext, event);
    createObjectLock = false;
    hidePopup();
}
function updateNewMatrix() {
    document.getElementById("matrixpositionX").firstChild.value = parseInt(document.getElementById("object" + (objectCount + 1)).getBoundingClientRect().left);
    document.getElementById("matrixpositionY").firstChild.value = parseInt(document.getElementById("object" + (objectCount + 1)).getBoundingClientRect().top);
}
function newObejctPosition() {
    document.getElementById("object" + (objectCount + 1)).style.left = document.getElementById("matrixpositionX").firstChild.value + "px";
    document.getElementById("object" + (objectCount + 1)).style.top = document.getElementById("matrixpositionY").firstChild.value + "px";
    newObjectArrows();
}
function newObjectArrows() {
    if (parseInt(document.getElementById("matrixvelocityX").firstChild.value) !== 0) {
        newObjectRotation = Math.atan(parseInt(document.getElementById("matrixvelocityY").firstChild.value) / parseInt(document.getElementById("matrixvelocityX").firstChild.value));
        } else {
            if (parseInt(document.getElementById("matrixvelocityY").firstChild.value) < 0) {
                newObjectRotation = Math.PI / -2;
            } else {
                newObjectRotation = Math.PI / 2;
            }
        }
    if (parseInt(document.getElementById("matrixvelocityX").firstChild.value) < 0) {
        newObjectRotation += Math.PI;
    }
    
    
    document.getElementById("arrow" + (objectCount + 1)).style.transform = "rotate(" + newObjectRotation + "rad) scale(" + Math.sqrt((parseInt(document.getElementById("matrixvelocityX").firstChild.value)) ** 2 + parseInt(document.getElementById("matrixvelocityY").firstChild.value) ** 2) / 2000 + ")";


    document.getElementById("arrow" + (objectCount + 1)).style.left = parseInt(document.getElementById("matrixpositionX").firstChild.value) + (parseInt(document.getElementById("object" + (objectCount + 1)).offsetWidth) / 2) + "px";


    document.getElementById("arrow" + (objectCount + 1)).style.top = parseInt(document.getElementById("matrixpositionY").firstChild.value) + (parseInt(document.getElementById("object" + (objectCount + 1)).offsetHeight) / 2) - parseInt(document.getElementById("arrow" + (objectCount + 1)).offsetHeight) / 2 + "px";
}
function cancelNewObject() {
    document.getElementById("object" + (objectCount + 1)).remove();
    document.getElementById("arrow" + (objectCount + 1)).remove();
    createObjectLock = false;
}

// Delete Object Functions
function deleteCheck(deleteObjects) {
    document.getElementById("context-menu").style.opacity = "0";
    setTimeout(function () {document.getElementById("context-menu").style.zIndex = "-1"}, 100);
    if (confirmDelete === true) {
        document.getElementById("confirmtitle").innerHTML = "Delete Object";
        document.getElementById("confirmcontent").innerHTML = "";
        var tempElement = document.createElement("p");
        tempElement.innerHTML = "Are you sure you want to delete this object?";
        tempElement.id = "confirmtext";
        document.getElementById("confirmcontent").appendChild(tempElement);
        var tempElement = document.createElement("input");
        tempElement.type = "checkbox";
        tempElement.id = "confirmcheckbox";
        document.getElementById("confirmcontent").appendChild(tempElement);
        var tempElement = document.createElement("p");
        tempElement.innerHTML = "Don't show this message";
        tempElement.id = "confirmdontshow";
        tempElement.onclick = function() {document.getElementById("confirmcheckbox").click()}
        document.getElementById("confirmcontent").appendChild(tempElement);
        var tempElement = document.createElement("div");
        tempElement.id = "no-button";
        tempElement.innerHTML = "No";
        tempElement.onclick = hideConfirm;
        document.getElementById("confirmcontent").appendChild(tempElement);
        var tempElement = document.createElement("div");
        tempElement.id = "yes-button";
        tempElement.innerHTML = "Yes";
        tempElement.onclick = function () {deleteObject(deleteObjects)};
        document.getElementById("confirmcontent").appendChild(tempElement);
        document.getElementById("confirm").style.opacity = 1;
        document.getElementById("confirm").style.zIndex = 500;
    } else {
        deleteObject(deleteObjects);
    }
}
function deleteObject(deleteObjects) {
    if (document.getElementById("confirmcheckbox").checked === true) {
        confirmDelete = false;
    }
    deleteObjects.element.remove();
    deleteArrows = eval("arrow" + deleteObjects.name.split("t")[1]);
    deleteArrows.element.remove();
    deletedObjects.splice(deletedObjects.length, 0, parseInt(deleteObjects.name.split("t")[1]));
    if (matrixObject === deleteObjects) {
        hidePopup();
    }
    document.getElementById("confirm").style.opacity = "0";
    setTimeout(function () {
        document.getElementById("confirm").style.zIndex = "-1"
        document.getElementById("confirmtitle").innerHTML = "";
    }, 250);
}
function hideConfirm() {
    if (document.getElementById("confirmcheckbox").checked === true) {
        confirmDelete = false;
    }
    document.getElementById("confirm").style.opacity = "0";
    setTimeout(function () {
        document.getElementById("confirm").style.zIndex = "-1"
        document.getElementById("confirmtitle").innerHTML = "";
    }, 250);
}

// Attribute Toggler Functions
function toggleTime(e) {
    if (timePaused === false) {
        clearInterval(interval);
        document.getElementById("play-pause").src = "./play.png";
        timePaused = true;
    } else {
        interval = setInterval(physics, 1000/(framesPerSecond * timeScale));
        document.getElementById("play-pause").src = "./pause.png";
        timePaused = false;
    }
    if (e.type === "click"){
        document.getElementById("context-menu").style.opacity = "0";
        setTimeout(function () {document.getElementById("context-menu").style.zIndex = "-1"}, 100);
    }
}
function toggleFixed(fixObject) {
    fixLock = document.getElementById("lock" + fixObject.name.slice(6));
    if (fixObject.fixed === false) {
                selectedObject.fixed = true;
                fixLock.style.opacity = "1";
            } else {
                selectedObject.fixed = false;
                fixLock.style.opacity = "0";
            }
    document.getElementById("context-menu").style.opacity = "0";
    setTimeout(function () {document.getElementById("context-menu").style.zIndex = "-1"}, 100);
    
}
function toggleGravity() {
    if (gravityOn === true) {
        for (b = 1; b <= objectCount; b++) {
            gravityObject = eval("object" + b);
            gravityObject.accelerationY = 0;
            gravityOn = false;
        }
    } else {
        for (b = 1; b <= objectCount; b++) {
            gravityObject = eval("object" + b);
            gravityObject.accelerationY = 981;
            gravityOn = true;
        }
    }
}
function restart() {
    window.location.href = "./index.html";
}

// Event Listeners
window.addEventListener("load", function () {
    var contextMenu = document.createElement("div");
    contextMenu.id = "context-menu";
    document.body.appendChild(contextMenu);
    for (h = 1; h <= objectCount; h++) {
        document.getElementById("object" + h).addEventListener("contextmenu", objectContext, event);
        dragElement(document.getElementById("object" + h));
    }
    dragElement(document.getElementById("popup"));
    dragElement(document.getElementById("confirm"));
});
window.addEventListener("click", checkLocation, event);
document.getElementById("physics-field").addEventListener("contextmenu", generalContext, event);
document.getElementById("play-pause").addEventListener("click", toggleTime, event);
document.getElementById("refresh").addEventListener("click", restart);