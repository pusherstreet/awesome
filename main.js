// intialize
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var arr = generateArray(200);
var drawWorkers = [];

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
    arr = generateArray(200)
    draw(arr);
}

document.getElementById('bubble').onclick = function (e) {
    e.preventDefault();
    stopDraw();
    bubbleSort(arr);
}
document.getElementById('insert').onclick = function (e) {
    e.preventDefault();
    stopDraw();
    insertionSort(arr);
}
document.getElementById('merge').onclick = function (e) {
    e.preventDefault();
    stopDraw();
    mergeSort(arr);
}

// start
draw(arr);

// drawing functions

function updateRect(pos, value) {
    let workerPos = drawWorkers.length;
    drawWorkers.push(setTimeout(function () {
        sleep(1);
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
        mergeSort(right, start + middle ),
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
    if(left.length)
        pos = breadcrumbs(pos, left);

    right = right.slice(indexRight);
    if(right.length)
        pos = breadcrumbs(pos, right);

    return result.concat(left).concat(right);
}

function breadcrumbs(pos, arr){
    let index = 0;
    while(index < arr.length){
        updateRect(pos, arr[index]);
        index++;
        pos++;
    }
    return pos;
}

function stopDraw(){
    drawWorkers.forEach(function(timeoutID){
        clearTimeout(timeoutID);
    });
}

function sleep(ms) 
{
  var e = new Date().getTime() + (ms);
  while (new Date().getTime() <= e) {}
}