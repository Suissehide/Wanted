var Wanted;
(function (Wanted) {
    var CursorClickController = (function () {
        function CursorClickController(keyboard, onClick) {
            var autoClickHandle, ClickdAt = 0, singleClickMode = true, lastShot = 0;

            keyboard.OnCommandDown("space", function () {
                var timeSinceClickd;

                ClickdAt = new Date().getTime();

                if (singleClickMode) {
                    timeSinceClickd = ClickdAt - lastShot;

                    if (timeSinceClickd > CursorClickController.MIN_Click_RATE.Milliseconds) {
                        lastShot = ClickdAt;
                        onClick("Click");
                    }

                    autoClickHandle = setTimeout(function () {
                        singleClickMode = false;
                        onClick("StartClick");
                    }, CursorClickController.MIN_Click_RATE.Milliseconds);
                } else {
                    onClick("StartClick");
                }
            });
            keyboard.OnCommandUp("space", function () {
                var timeClickReleased;

                clearTimeout(autoClickHandle);
                timeClickReleased = new Date().getTime();

                if (!singleClickMode) {
                    lastShot = timeClickReleased;
                    onClick("StopClick");
                }

                singleClickMode = timeClickReleased - ClickdAt < CursorClickController.MIN_Click_RATE.Milliseconds;
            });
        }
        return CursorClickController;
    })();
    Wanted.CursorClickController = CursorClickController;
})(Wanted || (Wanted = {}));