var Wanted;
(function (Wanted) {
    function StandardDeviation(arr) {
        var average = Average(arr), sum = 0;

        for (var i = 0; i < arr.length; i++) {
            sum += Math.pow(arr[i] - average, 2);
        }

        return Math.sqrt(sum / (arr.length - 1));
    }
    Wanted.StandardDeviation = StandardDeviation;

    function Average(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        return sum / arr.length;
    }
    Wanted.Average = Average;

    const RandomRange = (min, max) => min + Math.random() * (max - min);
    Wanted.RandomRange = RandomRange;

    const RandomIndex = array => RandomRange(0, array.length) | 0;
    Wanted.RandomIndex = RandomIndex;

    const RemoveFromArray = (array, i) => array.splice(i, 1)[0];
    Wanted.RemoveFromArray = RemoveFromArray;

    const RemoveItemFromArray = (array, item) => RemoveFromArray(array, array.indexOf(item));
    Wanted.RemoveItemFromArray = RemoveItemFromArray;

    const RemoveRandomFromArray = array => RemoveFromArray(array, RandomIndex(array));
    Wanted.RemoveRandomFromArray = RemoveRandomFromArray;

    const GetRandomFromArray = (array) => array[RandomIndex(array) | 0];
    Wanted.GetRandomFromArray = GetRandomFromArray;

    Wanted.delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    jQuery.fn.flash = function (color, duration) {
        this.stop(true);
        var current = this.css('backgroundColor');
        this.animate({ backgroundColor: 'rgb(' + color + ')' }, duration / 2).animate({ backgroundColor: current }, duration / 2);
    };
})(Wanted || (Wanted = {}));