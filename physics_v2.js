// Class Declaration
class object {
    constructor() {
        this.name = "object" + (objectCount),
        this.element = document.getElementById("object" + (objectCount)),
        this.positionX = 0,
        this.positionY = 0,
        this.velocityX = 0,
        this.velocityY = 0,
        this.accelerationX = 0,
        this.accelerationY = 0,
        this.fixed = false
    }
}
class arrow {
    constructor() {
        this.element = document.getElementById("arrow" + objectCount),
        this.scale = 0,
        this.rotation = 0,
        this.top = 0,
        this.left = 0
    }
}

// Object Declaration
var object1 = {
    name: "object1",
    element: document.getElementById("object1"),
    positionX: 100,
    positionY: 190,
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 981,
    fixed: false,
}
var arrow1 = {
    element: document.getElementById("arrow1"),
    scale: 1,
    rotation: 0,
    top: 0,
    left: 0,
}
var object2 = {
    name: "object2",
    element: document.getElementById("object2"),
    positionX: 700,
    positionY: 390,
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 981,
    fixed: false,
}
var arrow2 = {
    element: document.getElementById("arrow2"),
    scale: 1,
    rotation: 0,
    top: 0,
    left: 0,
}
var object3 = {
    name: "object3",
    element: document.getElementById("object3"),
    positionX: 100,
    positionY: 500,
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 981,
    fixed: false,
}
var arrow3 = {
    element: document.getElementById("arrow3"),
    scale: 1,
    rotation: 0,
    top: 0,
    left: 0,
}
var object4 = {
    name: "object4",
    element: document.getElementById("object4"),
    positionX: 300,
    positionY: 400,
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 981,
    fixed: false,
}
var arrow4 = {
    element: document.getElementById("arrow4"),
    scale: 1,
    rotation: 0,
    top: 0,
    left: 0,
}

// Variable Declaration
var timePaused = true;
var objectCount = 4;
var coefficientOfFriction = 2;
var currentObject;
var currentArrow;
var secondTargetObject;
var ceiling;
var tempPosition;
var tempOffset;
var deltaLeft;
var deltaTop;
var deltaRight;
var deltaBottom;
var ignoreCollision = false;
var framesPerSecond = 100;
var timeScale = 1;
var gravityOn = true;
var gravityObject;
var elasticityConstant = 0.5;
var wallCollision = "";

// Physics Functions
function physics() {

    // Cycle throught objects
    for (j = 1; j <= objectCount; j++) {

        // Check if object has been deleted
        if (deletedObjects.indexOf(j) === -1) {

            // Assign currentObject and currentArrow
            currentObject = eval("object" + j);
            currentArrow = eval("arrow" + j);

            // Check to see if currentObject is fixed or is being dragged
            if (currentObject.fixed !== true && movingObject !== currentObject) {

                // Adjust X components

                // Check if on right wall
                if (currentObject.positionX + currentObject.element.offsetWidth + currentObject.velocityX / framesPerSecond > window.innerWidth) {
                    if (currentObject.positionX + currentObject.element.offsetWidth > window.innerWidth) {
                        currentObject.positionX = window.innerWidth - currentObject.element.offsetWidth;
                        currentObject.velocityX = 0;
                    } else {
                        currentObject.positionX = window.innerWidth - currentObject.element.offsetWidth - (currentObject.velocityX / framesPerSecond - (window.innerWidth - currentObject.positionX - currentObject.element.offsetWidth)) * elasticityConstant;
                        currentObject.velocityX *= -elasticityConstant;
                    }

                    // Apply Friction
                    if (Math.abs(currentObject.velocityY) > coefficientOfFriction * Math.abs(currentObject.accelerationX) / framesPerSecond) {
                        currentObject.velocityY -= (coefficientOfFriction * currentObject.accelerationX / framesPerSecond * Math.sign(currentObject.velocityY));
                    } else {
                        currentObject.velocityY = 0;
                    }

                    // Check if on let wall
                } else if (currentObject.positionX + currentObject.velocityX / framesPerSecond < 0) {
                    if (currentObject.positionX < 0) {
                        currentObject.positionX = 0;
                        currentObject.velocityX = 0;
                    } else {
                        currentObject.positionX = -(currentObject.positionX + currentObject.velocityX / framesPerSecond) * elasticityConstant;
                        currentObject.velocityX *= -elasticityConstant;
                    }

                    // Apply Friction
                    if (Math.abs(currentObject.velocityY) > coefficientOfFriction * Math.abs(currentObject.accelerationX) / framesPerSecond) {
                        currentObject.velocityY += (coefficientOfFriction * currentObject.accelerationX / framesPerSecond * Math.sign(currentObject.velocityY));
                    } else {
                        currentObject.velocityY = 0;
                    }

                // If not on left or right wall
                } else {
                    currentObject.positionX += currentObject.velocityX / framesPerSecond;
                    currentObject.velocityX += currentObject.accelerationX / framesPerSecond;
                }

                // Adjust Y components

                // Check if on floor
                if (currentObject.positionY + currentObject.element.offsetHeight + currentObject.velocityY / framesPerSecond > window.innerHeight) {
                    if (currentObject.positionY + currentObject.element.offsetHeight > window.innerHeight) {
                        currentObject.positionY = window.innerHeight - currentObject.element.offsetHeight;
                        currentObject.velocityY = 0;
                    } else {
                        currentObject.positionY = window.innerHeight - currentObject.element.offsetHeight - (currentObject.velocityY / framesPerSecond - (window.innerHeight - currentObject.positionY - currentObject.element.offsetHeight)) * elasticityConstant;
                        currentObject.velocityY *= -elasticityConstant;
                    }

                    // Apply Friction
                    if (Math.abs(currentObject.velocityX) > coefficientOfFriction * Math.abs(currentObject.accelerationY) / framesPerSecond) {
                        currentObject.velocityX -= (coefficientOfFriction * currentObject.accelerationY / framesPerSecond * Math.sign(currentObject.velocityX));
                    } else {
                        currentObject.velocityX = 0;
                    }

                // Check if on ceiling
                } else if (currentObject.positionY + currentObject.velocityY / framesPerSecond < ceiling) {
                    if (currentObject.positionY < ceiling) {
                        currentObject.positionY = ceiling;
                        currentObject.velocityY = 0;
                    } else {
                        currentObject.positionY = -(currentObject.positionY + currentObject.velocityY / framesPerSecond - ceiling) * elasticityConstant + ceiling;
                        currentObject.velocityY *= -elasticityConstant;
                    }

                    // Apply Friction
                    if (Math.abs(currentObject.velocityX) > coefficientOfFriction * Math.abs(currentObject.accelerationY) / framesPerSecond) {
                        currentObject.velocityX += (coefficientOfFriction * currentObject.accelerationY / framesPerSecond * Math.sign(currentObject.velocityX));
                    } else {
                        currentObject.velocityX = 0;
                    }

                // If not on floor or ceiling
                } else {
                    currentObject.positionY += currentObject.velocityY / framesPerSecond;
                    currentObject.velocityY += currentObject.accelerationY / framesPerSecond;
                }
            }

            // Check if the "Edit Matrix" popup is displayed and the object it is displaying is currentObject
            if (document.getElementById("popuptitle").innerHTML === "Edit Matrix" && matrixObject === currentObject) {

                // Update the matrix
                setMatrix(currentObject);
            }
        }
    }

    // Draw objects and arrows
    drawObjects();
    drawArrows();

    // Detect collisions between blocks
    detectCollision();
}
function detectCollision() {

    for (l = 1; l <= objectCount; l ++) {

        if (deletedObjects.indexOf(l) === -1) {

            targetObject = eval("object" + l);

            for (m = l + 1; m <= objectCount; m++) {

                if (deletedObjects.indexOf(m) === -1) {

                    secondTargetObject = eval("object" + m);
                    // Check for collision
                    if (targetObject.positionX <= secondTargetObject.positionX + secondTargetObject.element.offsetWidth && targetObject.positionX + targetObject.element.offsetWidth >= secondTargetObject.positionX && targetObject.positionY <= secondTargetObject.positionY + secondTargetObject.element.offsetHeight && targetObject.positionY + targetObject.element.offsetHeight >= secondTargetObject.positionY) {

                        // Determine if collision is on right (true) or left (false)
                        if (targetObject.positionX + targetObject.element.offsetWidth >= secondTargetObject.positionX && targetObject.positionX + targetObject.element.offsetWidth < secondTargetObject.positionX + secondTargetObject.element.offsetWidth) {

                            // Determine if collision is on bottom (true) or top (false)
                            if (targetObject.positionY + targetObject.element.offsetHeight >= secondTargetObject.positionY && targetObject.positionY + targetObject.element.offsetHeight < secondTargetObject.positionY + secondTargetObject.element.offsetHeight) {

                                // Determine collision side based on proximity => right (true) or bottom (false)
                                if (Math.abs(targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX) < Math.abs(targetObject.positionY + targetObject.element.offsetHeight - secondTargetObject.positionY)) {

                                    // Right

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionX += (targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX);
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;

                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionX -= (targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX);
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX) / 2;
                                        targetObject.positionX -= tempOffset;
                                        secondTargetObject.positionX += tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (secondTargetObject.positionX + secondTargetObject.element.offsetWidth > window.innerWidth) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = secondTargetObject.positionX + secondTargetObject.element.offsetWidth - window.innerWidth;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionX = window.innerWidth - secondTargetObject.element.offsetWidth;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityX -= tempPosition * framesPerSecond + tempOffset * framesPerSecond;
                                            secondTargetObject.velocityX = 0;

                                        } else if (targetObject.positionX < 0) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = targetObject.positionX;

                                            // Set outer object back inbounds
                                            targetObject.positionX = 0;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityX = 0;
                                            secondTargetObject.velocityX -= tempPosition * framesPerSecond - tempOffset * framesPerSecond;

                                        } else {

                                            // Set velocities of objects if neither block went into a wall
                                            targetObject.velocityX -= tempOffset * framesPerSecond;
                                            secondTargetObject.velocityX += tempOffset * framesPerSecond;

                                        }

                                    }
                                    targetObject.onGroundAccelerationSet = false;
                                    secondTargetObject.onGroundAccelerationSet = false;
                                } else {

                                    // Bottom

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionY = targetObject.positionY + targetObject.element.offsetHeight;
                                        targetObject.velocityY = 0;
                                        secondTargetObject.velocityY = secondTargetObject.accelerationY / framesPerSecond;
                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionY = secondTargetObject.positionY - targetObject.element.offsetHeight;
                                        targetObject.velocityY = targetObject.accelerationY / framesPerSecond;
                                        secondTargetObject.velocityY = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionY + targetObject.element.offsetHeight - secondTargetObject.positionY) / 2;
                                        targetObject.positionY -= tempOffset;
                                        secondTargetObject.positionY += tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (targetObject.positionY - ceiling < 0) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = targetObject.positionY - ceiling;

                                            // Set outer object back inbounds
                                            targetObject.positionY = ceiling;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityY = 0;
                                            secondTargetObject.velocityY -= tempPosition * framesPerSecond - tempOffset * framesPerSecond;

                                        } else if (secondTargetObject.positionY + secondTargetObject.element.offsetHeight > window.innerHeight) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = secondTargetObject.positionY + secondTargetObject.element.offsetHeight - window.innerHeight;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionY = window.innerHeight - secondTargetObject.element.offsetHeight;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            secondTargetObject.velocityY = 0;
                                            targetObject.velocityY -= tempOffset * framesPerSecond + tempPosition * framesPerSecond;

                                        } else {

                                            // Set velocities of objects if neither block went into a wall
                                            targetObject.velocityY -= tempOffset * framesPerSecond;
                                            secondTargetObject.velocityY += tempOffset * framesPerSecond;
                                        }
                                    }
                                }
                            } else {

                                // Determine collision side based on proximity => right (true) or top (false)
                                if (Math.abs(targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX) < Math.abs(targetObject.positionY - secondTargetObject.positionY - secondTargetObject.element.offsetHeight)) {

                                    // Right

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionX += (targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX);
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;

                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionX -= (targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX);
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionX + targetObject.element.offsetWidth - secondTargetObject.positionX) / 2;
                                        targetObject.positionX -= tempOffset;
                                        secondTargetObject.positionX += tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (secondTargetObject.positionX + secondTargetObject.element.offsetWidth > window.innerWidth) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = secondTargetObject.positionX + secondTargetObject.element.offsetWidth - window.innerWidth;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionX = window.innerWidth - secondTargetObject.element.offsetWidth;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityX -= tempPosition * framesPerSecond + tempOffset * framesPerSecond;
                                            secondTargetObject.velocityX = 0;

                                        } else if (targetObject.positionX < 0) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = targetObject.positionX;

                                            // Set outer object back inbounds
                                            targetObject.positionX = 0;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityX = 0;
                                            secondTargetObject.velocityX -= tempPosition * framesPerSecond - tempOffset * framesPerSecond;

                                        } else {

                                            // Set velocities of objects if neither block went into a wall
                                            targetObject.velocityX -= tempOffset * framesPerSecond;
                                            secondTargetObject.velocityX += tempOffset * framesPerSecond;

                                        }

                                    }
                                    targetObject.onGroundAccelerationSet = false;
                                    secondTargetObject.onGroundAccelerationSet = false;
                                } else {

                                    // Top

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionY = targetObject.positionY - secondTargetObject.element.offsetHeight;
                                        targetObject.velocityY = 0;
                                        secondTargetObject.velocityY = secondTargetObject.accelerationY / framesPerSecond;

                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionY = secondTargetObject.positionY + secondTargetObject.element.offsetHeight;
                                        targetObject.velocityY = targetObject.accelerationY / framesPerSecond;
                                        secondTargetObject.velocityY = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionY - secondTargetObject.positionY - secondTargetObject.element.offsetHeight) / 2;
                                        targetObject.positionY += tempOffset;
                                        secondTargetObject.positionY -= tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (targetObject.positionY + targetObject.element.offsetHeight > window.innerHeight) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = targetObject.positionY + targetObject.element.offsetHeight - window.innerHeight

                                            // Set outer object back inbounds
                                            targetObject.positionY = window.innerHeight - targetObject.element.offsetHeight;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityY = 0;
                                            secondTargetObject.velocityY -= tempOffset * framesPerSecond + tempPosition * framesPerSecond;

                                        } else if (secondTargetObject.positionY - ceiling < 0) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = secondTargetObject.positionY - ceiling;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionY = ceiling;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            secondTargetObject.velocityY = 0;
                                            targetObject.velocityY += tempOffset * framesPerSecond - tempPosition * framesPerSecond;

                                        } else {

                                            // Set velocities of objects if neither block went into a wall
                                            targetObject.velocityY += tempOffset * framesPerSecond;
                                            secondTargetObject.velocityY -= tempOffset * framesPerSecond;
                                        }

                                    }
                                }
                            }
                        } else {

                            //Determine if collision is on bottom (true) or top (false)
                            if (targetObject.positionY + targetObject.element.offsetHeight >= secondTargetObject.positionY && targetObject.positionY + targetObject.element.offsetHeight < secondTargetObject.positionY + secondTargetObject.element.offsetHeight) {

                                // Determine collision side based on proximity => left (true) or bottom (false)
                                if (Math.abs(targetObject.positionX - secondTargetObject.positionX - secondTargetObject.element.offsetHeight) < Math.abs(targetObject.positionY + targetObject.element.offsetHeight - secondTargetObject.positionY)) {

                                    // Left

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionX = targetObject.positionX - secondTargetObject.element.offsetWidth;
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;

                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionX = secondTargetObject.positionX + secondTargetObject.element.offsetWidth;
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionX - secondTargetObject.positionX - secondTargetObject.element.offsetHeight) / 2;
                                        targetObject.positionX += tempOffset;
                                        secondTargetObject.positionX -= tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (targetObject.positionX + targetObject.element.offsetWidth > window.innerWidth) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = targetObject.positionX + targetObject.element.offsetWidth - window.innerWidth;

                                            // Set outer object back inbounds
                                            targetObject.positionX = window.innerWidth - targetObject.element.offsetWidth;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityX = 0;
                                            secondTargetObject.velocityX -= tempOffset * framesPerSecond + tempPosition * framesPerSecond;  

                                        } else if (secondTargetObject.positionX < 0) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = secondTargetObject.positionX;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionX = 0;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            secondTargetObject.velocityX = 0;
                                            targetObject.velocityX += tempOffset * framesPerSecond - tempPosition * framesPerSecond;

                                        } else {

                                            // Set velocities of objects
                                            targetObject.velocityX += tempOffset * framesPerSecond;
                                            secondTargetObject.velocityX -= tempOffset * framesPerSecond;
                                        }

                                    }
                                    targetObject.onGroundAccelerationSet = false;
                                    secondTargetObject.onGroundAccelerationSet = false;
                                } else {

                                    // Bottom

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionY = (targetObject.positionY + targetObject.element.offsetHeight);
                                        targetObject.velocityY = 0;
                                        secondTargetObject.velocityY = secondTargetObject.accelerationY / framesPerSecond;
                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionY = (secondTargetObject.positionY - targetObject.element.offsetHeight);
                                        targetObject.velocityY = targetObject.accelerationY / framesPerSecond;
                                        secondTargetObject.velocityY = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionY + targetObject.element.offsetHeight - secondTargetObject.positionY) / 2;
                                        targetObject.positionY -= tempOffset;
                                        secondTargetObject.positionY += tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (targetObject.positionY - ceiling < 0) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = targetObject.positionY - ceiling;

                                            // Set outer object back inbounds
                                            targetObject.positionY = ceiling;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityY = 0;
                                            secondTargetObject.velocityY -= tempPosition * framesPerSecond - tempOffset * framesPerSecond;

                                        } else if (secondTargetObject.positionY + secondTargetObject.element.offsetHeight > window.innerHeight) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = secondTargetObject.positionY + secondTargetObject.element.offsetHeight - window.innerHeight;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionY = window.innerHeight - secondTargetObject.element.offsetHeight;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            secondTargetObject.velocityY = 0;
                                            targetObject.velocityY -= tempOffset * framesPerSecond + tempPosition * framesPerSecond;

                                        } else {

                                            // Set velocities of objects if neither block went into a wall
                                            targetObject.velocityY -= tempOffset * framesPerSecond;
                                            secondTargetObject.velocityY += tempOffset * framesPerSecond;
                                        }

                                    }
                                }
                            } else {
                                // Determine collision side based on proximity => left (true) or top (false)
                                if (Math.abs(targetObject.positionX - secondTargetObject.positionX - secondTargetObject.element.offsetHeight) < Math.abs(targetObject.positionY - secondTargetObject.positionY - secondTargetObject.element.offsetHeight)) {

                                    // Left

                                    if (targetObject.fixed === true) {
                                        secondTargetObject.positionX = targetObject.positionX - secondTargetObject.element.offsetWidth;
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;

                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionX = secondTargetObject.positionX + secondTargetObject.element.offsetWidth;
                                        targetObject.velocityX = 0;
                                        secondTargetObject.velocityX = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionX - secondTargetObject.positionX - secondTargetObject.element.offsetHeight) / 2;
                                        targetObject.positionX += tempOffset;
                                        secondTargetObject.positionX -= tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (targetObject.positionX + targetObject.element.offsetWidth > window.innerWidth) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = targetObject.positionX + targetObject.element.offsetWidth - window.innerWidth;

                                            // Set outer object back inbounds
                                            targetObject.positionX = window.innerWidth - targetObject.element.offsetWidth;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityX = 0;
                                            secondTargetObject.velocityX -= tempOffset * framesPerSecond + tempPosition * framesPerSecond;  

                                        } else if (secondTargetObject.positionX < 0) {

                                            // Set tempPosition to the difference in width
                                            tempPosition = secondTargetObject.positionX;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionX = 0;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionX -= tempPosition;

                                            // Adjust the velocities to match
                                            secondTargetObject.velocityX = 0;
                                            targetObject.velocityX += tempOffset * framesPerSecond - tempPosition * framesPerSecond;

                                        } else {

                                            // Set velocities of objects
                                            targetObject.velocityX += tempOffset * framesPerSecond;
                                            secondTargetObject.velocityX -= tempOffset * framesPerSecond;
                                        }

                                    }
                                    targetObject.onGroundAccelerationSet = false;
                                    secondTargetObject.onGroundAccelerationSet = false;
                                } else {

                                    // Top

                                     if (targetObject.fixed === true) {
                                        secondTargetObject.positionY = targetObject.positionY - secondTargetObject.element.offsetHeight;
                                        targetObject.velocityY = 0;
                                        secondTargetObject.velocityY = secondTargetObject.accelerationY / framesPerSecond;

                                    } else if (secondTargetObject.fixed === true) {
                                        targetObject.positionY = secondTargetObject.positionY + secondTargetObject.element.offsetHeight;
                                        targetObject.velocityY = targetObject.accelerationY / framesPerSecond;
                                        secondTargetObject.velocityY = 0;
                                    } else {

                                        // Set object positions outside of each other
                                        tempOffset = Math.abs(targetObject.positionY - secondTargetObject.positionY - secondTargetObject.element.offsetHeight) / 2;
                                        targetObject.positionY += tempOffset;
                                        secondTargetObject.positionY -= tempOffset;

                                        // Make sure neither of the objects got pushed inside a wall (and fix them if they did)
                                        if (targetObject.positionY + targetObject.element.offsetHeight > window.innerHeight) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = targetObject.positionY + targetObject.element.offsetHeight - window.innerHeight

                                            // Set outer object back inbounds
                                            targetObject.positionY = window.innerHeight - targetObject.element.offsetHeight;

                                            // Adjust inner object to account for outer object
                                            secondTargetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            targetObject.velocityY = 0;
                                            secondTargetObject.velocityY -= tempOffset * framesPerSecond + tempPosition * framesPerSecond;

                                        } else if (secondTargetObject.positionY - ceiling < 0) {

                                            // Set tempPosition to the difference in height
                                            tempPosition = secondTargetObject.positionY - ceiling;

                                            // Set outer object back inbounds
                                            secondTargetObject.positionY = ceiling;

                                            // Adjust inner object to account for outer object
                                            targetObject.positionY -= tempPosition;

                                            // Adjust the velocities to match
                                            secondTargetObject.velocityY = 0;
                                            targetObject.velocityY += tempOffset * framesPerSecond - tempPosition * framesPerSecond;

                                        } else {

                                            // Set velocities of objects if neither block went into a wall
                                            targetObject.velocityY += tempOffset * framesPerSecond;
                                            secondTargetObject.velocityY -= tempOffset * framesPerSecond;
                                        }
                                    }
                                }
                            }
                        }
                        // Actually move elements
                        targetObject.element.style.left = targetObject.positionX + "px";
                        secondTargetObject.element.style.left = secondTargetObject.positionX + "px";
                        targetObject.element.style.top = targetObject.positionY + "px";
                        secondTargetObject.element.style.top = secondTargetObject.positionY + "px";
                    }
                }
            }
        }
    }
drawArrows();
}
function drawObjects() {
    for (v = 1; v <= objectCount; v++) {
        if (deletedObjects.indexOf(v) === -1) {
            currentObject = eval("object" + v);
            currentObject.element.style.left = currentObject.positionX + "px";
            currentObject.element.style.top = currentObject.positionY + "px";
        }
    }
}
function drawArrows() {
    for (k = 1; k <= objectCount; k++) {
        if (deletedObjects.indexOf(k) === -1) {
            currentObject = eval("object" + k);
            currentArrow = eval("arrow" + k);
            currentArrow = eval("arrow" + k);
            currentArrow.scale = Math.sqrt((currentObject.velocityX) ** 2 + currentObject.velocityY ** 2) / 2000;
            if (currentObject.velocityX !== 0) {
                currentArrow.rotation = Math.atan(currentObject.velocityY / currentObject.velocityX);
                } else {
                    if (currentObject.velocityY < 0) {
                        currentArrow.rotation = Math.PI / -2;
                    } else {
                        currentArrow.rotation = Math.PI / 2;
                    }
                }
            if (currentObject.velocityX < 0) {
                currentArrow.rotation += Math.PI;
            }
            currentArrow.element.style.transform = "rotate(" + currentArrow.rotation + "rad) scale(" + currentArrow.scale + ")";
            currentArrow.left = currentObject.positionX + currentObject.element.offsetWidth / 2;
            currentArrow.top = currentObject.positionY + currentObject.element.offsetHeight / 2 - currentArrow.element.offsetHeight / 2;
            currentArrow.element.style.left = currentArrow.left + "px";
            currentArrow.element.style.top = currentArrow.top + "px";
        }
    }
}

// Event Listeners
window.addEventListener("load", function () {

    // Get the height of the menu to set the ceiling height
    ceiling = document.getElementById("menu-bar").offsetHeight;

    // Draw existing objects and arrows
    drawObjects();
    drawArrows();
});