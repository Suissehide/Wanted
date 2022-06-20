var Wanted;
(function (Wanted) {
    var CursorClickController = (function () {
        function CursorClickController(mouse, onClick) {
            var autoClickHandle, ClickedAt = 0, singleClickMode = true, lastShot = 0;

            mouse.OnDown.Bind((e) => {
                var timeSinceClicked;

                ClickedAt = new Date().getTime();

                if (singleClickMode) {
                    timeSinceClicked = ClickedAt - lastShot;

                    if (timeSinceClicked > CursorClickController.MIN_CLICK_RATE.Milliseconds) {
                        lastShot = ClickedAt;
                        onClick("Click");
                    }

                    autoClickHandle = setTimeout(function () {
                        singleClickMode = false;
                        onClick("StartClick");
                    }, CursorClickController.MIN_CLICK_RATE.Milliseconds);
                } else {
                    onClick("StartClick");
                }
            });
            mouse.OnUp.Bind((e) => {
                var timeClickReleased;

                clearTimeout(autoClickHandle);
                timeClickReleased = new Date().getTime();

                if (!singleClickMode) {
                    lastShot = timeClickReleased;
                    onClick("StopClick");
                }

                singleClickMode = timeClickReleased - ClickedAt < CursorClickController.MIN_CLICK_RATE.Milliseconds;
            });
        }
        return CursorClickController;
    })();
    Wanted.CursorClickController = CursorClickController;
})(Wanted || (Wanted = {}));