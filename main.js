// intialize
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var arr = generateArray(200);
var drawWorkers = [];
var delay = 0;

function generateArray(n) {
    let arr = [];
    while (n > 0) {
        arr.push(Math.ceil(Math.random() * canvas.height));
        n--;
    }
    return arr;
}

// handlers
document.getElementById('shift').onclick = function (e) {
    e.preventDefault();
    stopDraw();
    arr = generateArray(200);
    draw(arr);
}

document.getElementById('bubble').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    bubbleSort(arr);
}
document.getElementById('insert').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    insertionSort(arr);
}
document.getElementById('merge').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    mergeSort(arr);
}

document.getElementById('quick').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    quickSort(arr);
}

document.getElementById('quickRnd').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    quickSortRnd(arr);
}

document.getElementById('cocktail').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    cocktailSort(arr);
}

document.getElementById('shell').onclick = function (e) {
    e.preventDefault();
    delay = parseInt(e.target.dataset.delay);
    stopDraw();
    shellSort(arr);
}

// start
draw(arr);

// drawing functions

function updateRect(pos, value) {
    let workerPos = drawWorkers.length;
    drawWorkers.push(setTimeout(function () {
        sleep(delay);
        context.clearRect(pos * 6, canvas.height, 5, -canvas.height); // clear old rectangle
        context.fillRect(                                  // fill new rectangle
            pos * 6,
            canvas.height,
            5,
            -value
        );
        drawWorkers.slice(workerPos, 1);
    }, 0.01));
}

function draw(array) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    array.forEach(function (el, key) {
        context.fillRect(
            key * 6,
            canvas.height,
            5,
            -el
        );
    });
}


// sorting algorithms

function insertionSort(unsortedList) {
    var len = unsortedList.length;
    for (var i = 1; i < len; i++) {
        var tmp = unsortedList[i];

        for (var j = i - 1; j >= 0 && (unsortedList[j] > tmp); j--) {
            //Shift the number
            unsortedList[j + 1] = unsortedList[j];
            updateRect(j + 1, unsortedList[j])
        }

        unsortedList[j + 1] = tmp;
        updateRect(j + 1, tmp)
    }
}

function bubbleSort(unsortedList) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < unsortedList.length - 1; i++) {
            if (unsortedList[i] > unsortedList[i + 1]) {
                var temp = unsortedList[i];
                unsortedList[i] = unsortedList[i + 1];
                updateRect(i, unsortedList[i]);
                unsortedList[i + 1] = temp;
                updateRect(i + 1, temp);
                swapped = true;

            }
        }
    } while (swapped);
}

function mergeSort(arr, start = 0) {

    if (arr.length === 1) {
        return arr
    }

    const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
    const left = arr.slice(0, middle) // items on the left side
    const right = arr.slice(middle) // items on the right side

    return merge(
        mergeSort(left, start),
        mergeSort(right, start + middle),
        start
    )
}

function merge(left, right, pos) {
    let result = []
    let indexLeft = 0
    let indexRight = 0

    while (indexLeft < left.length && indexRight < right.length) {
        if (left[indexLeft] < right[indexRight]) {
            updateRect(pos, left[indexLeft]);
            result.push(left[indexLeft])
            indexLeft++
        } else {
            updateRect(pos, right[indexRight]);
            result.push(right[indexRight])
            indexRight++
        }
        pos++;
    }

    left = left.slice(indexLeft);
    if (left.length)
        pos = breadcrumbs(pos, left);

    right = right.slice(indexRight);
    if (right.length)
        pos = breadcrumbs(pos, right);

    return result.concat(left).concat(right);
}

function breadcrumbs(pos, arr) {
    let index = 0;
    while (index < arr.length) {
        updateRect(pos, arr[index]);
        index++;
        pos++;
    }
    return pos;
}


function quickSort(origArray, start = 0) {
    if (origArray.length <= 1) {
        if (origArray.length) {
            updateRect(start, origArray[0]);
        }
        return origArray;
    } else {

        var left = [];
        var right = [];
        var newArray = [];
        var pivot = origArray.pop();
        var length = origArray.length;

        for (var i = 0; i < length; i++) {
            if (origArray[i] <= pivot) {
                left.push(origArray[i]);
            } else {
                right.push(origArray[i]);
            }
        }

        [].concat(left, pivot, right).forEach(function (el, index) {
            updateRect(start + index, el);
        });

        let leftLn = left.length;

        return newArray.concat(quickSort(left, start), pivot, quickSort(right, start + leftLn + 1));
    }
}

function quickSortRnd(origArray, start = 0) {
    if (origArray.length <= 1) {
        if (origArray.length) {
            updateRect(start, origArray[0]);
        }
        return origArray;
    } else {

        var left = [];
        var right = [];
        var newArray = [];
        var pivot = origArray.splice(Math.floor(Math.random() * origArray.length), 1)[0];
        var length = origArray.length;

        for (var i = 0; i < length; i++) {
            if (origArray[i] <= pivot) {
                left.push(origArray[i]);
            } else {
                right.push(origArray[i]);
            }
        }

        [].concat(left, pivot, right).forEach(function (el, index) {
            updateRect(start + index, el);
        });

        let leftLn = left.length;

        return newArray.concat(quickSort(left, start), pivot, quickSort(right, start + leftLn + 1));
    }
}


function cocktailSort(arr) {
    let swapped = true;
    let start = 0;
    let end = arr.length;

    while (swapped == true) {
        swapped = false;

        // loop from bottom to top same as
        // the bubble sort
        for (let i = start; i < end - 1; ++i) {
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                updateRect(i, arr[i + 1]);
                arr[i + 1] = temp;
                updateRect(i + 1, temp);
                swapped = true;
            }
        }

        // if nothing moved, then array is sorted.
        if (swapped == false)
            break;

        // otherwise, reset the swapped flag so that it
        // can be used in the next stage
        swapped = false;

        // move the end point back by one, because
        // item at the end is in its rightful spot
        end = end - 1;

        // from top to bottom, doing the
        // same comparison as in the previous stage
        for (let i = end - 1; i >= start; i--) {
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                updateRect(i, arr[i + 1]);
                arr[i + 1] = temp;
                updateRect(i + 1, temp);
                swapped = true;
            }
        }

        // increase the starting point, because
        // the last stage would have moved the next
        // smallest number to its rightful spot.
        start = start + 1;
    }
}

function shellSort(arr) {
    var increment = arr.length / 2;
    while (increment > 0) {
        for (i = increment; i < arr.length; i++) {
            var j = i;
            var temp = arr[i];

            while (j >= increment && arr[j - increment] > temp) {
                arr[j] = arr[j - increment];
                updateRect(j, arr[j-increment]);
                j = j - increment;
            }

            arr[j] = temp;
            updateRect(j, temp);
        }

        if (increment == 2) {
            increment = 1;
        } else {
            increment = parseInt(increment * 5 / 11);
        }
    }
    return arr;
}

function stopDraw() {
    drawWorkers.forEach(function (timeoutID) {
        clearTimeout(timeoutID);
    });
}

function sleep(ms) {
    var e = new Date().getTime() + (ms);
    while (new Date().getTime() <= e) { }
}