class Sorting {

    quickSort(arr) {
        if (arr.length <= 1) {
            return arr;
        } else {
            var swaps = 0;
            var leftArr = [];              
            var rightArr = [];
            var newArr = [];
            var length = arr.length;
            var pivot = arr[length - 1].pos;      
            for (var i = 0; i < length; i++) {
                if (arr[i].pos <= pivot) {    
                    leftArr.push(arr[i]);      
                } else {
                    rightArr.push(arr[i]);
                    swaps++;
                }
            }
            if (swaps === 0) {
                return arr
            } else {
                return newArr.concat(this.quickSort(leftArr), this.quickSort(rightArr));   
            }
        }
    }
}

let sorting = new Sorting;
export {sorting};