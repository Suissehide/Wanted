var eg = EndGate;
var Wanted;
(function (Wanted) {
    var Crowd = (function () {
        function Crowd(scene, contentManager, gameScreen) {
            this._scene = scene;
            this._contentManager = contentManager;
            this._gameScreen = gameScreen;
            this._allPeeps = [];
            this._availablePeeps = [];
            this._crowd = [];
            this._sheetMap = new eg.Graphics.SquareTileMap.ExtractTiles(Crowd._sheet, Crowd._sheet.ClipSize.Width / Crowd.ROWS, Crowd._sheet.ClipSize.Height / Crowd.COLS);
            this._sheetMapMirror = new eg.Graphics.SquareTileMap.ExtractTiles(Crowd._sheetMirror, Crowd._sheetMirror.ClipSize.Width / Crowd.ROWS, Crowd._sheetMirror.ClipSize.Height / Crowd.COLS);
        }

        Crowd.prototype.CreatePeeps = function () {
            let _this = this;

            for (let i = 0; i < Crowd.POPULATION; i++) {
                let selected = Math.floor(Wanted.RandomRange(0, Crowd.ROWS * Crowd.COLS - 1));
                let peep = new Wanted.Peep({
                    rectWidth: Crowd._sheet.ClipSize.Width / Crowd.ROWS,
                    rectHeight: Crowd._sheet.ClipSize.Height / Crowd.COLS,
                    tile: this._sheetMap[selected],
                    tileMirror: this._sheetMapMirror[selected]
                }, this._gameScreen);
                this._allPeeps.push(peep);
                this._scene.Add(peep.Graphic);

                // this._peeps[peep.Id].OnDisposed.Bind(function (peep) {
                //     delete _this._peeps[(peep).Id];
                // });
            }
        };

        Crowd.prototype.Initialize = function () {
            console.log("INIT CROWD!");
            this.CreatePeeps();
            this._crowd.forEach(peep => {
                peep._walk.kill();
            });

            this._crowd.length = 0;
            this._availablePeeps.length = 0;
            this._availablePeeps.push(...this._allPeeps);
        };

        Crowd.prototype.AddPeepToCrowd = function () {
            const peep = Wanted.RemoveRandomFromArray(this._availablePeeps);
            peep.ResetPeep();

            /*
            const walk = Wanted.GetRandomFromArray(this._walks)({
                peep,
                props: this.ResetPeep({
                    peep
                })
            }).eventCallback('onComplete', () => {
                this.RemovePeepFromCrowd(peep);
                this.AddPeepToCrowd();
            });
            */

            peep.Graphic.Visible = true;
            this._crowd.push(peep);
            this._crowd.sort((a, b) => a.AnchorY - b.AnchorY);

            return peep;
        };

        Crowd.prototype.RemovePeepFromCrowd = function (peep) {
            Wanted.RemoveItemFromArray(this._crowd, peep);
            this._availablePeeps.push(peep);
        };

        Crowd.prototype.LoadPayload = function (payload) {
            let _this = this;
            // this._impostor.LoadPayload(payload.Impostor);
        };

        Crowd.prototype.Update = function (gameTime) {
            if (this._availablePeeps.length) {
                //this.AddPeepToCrowd()._walk.progress(Math.random());
                this.AddPeepToCrowd();
            }
            let zIndex = 1;
            for (var id in this._crowd) {
                this._crowd[id].Update(gameTime);
                this._crowd[id].Graphic.ZIndex = zIndex;
                zIndex++;
            }

            // this.impostor.Update(gameTime);
        };
        return Crowd;
    })();

    Crowd.LoadPeepBodies = // Made as a static so we don't have to construct the peep bodies every time a new peep is created.
        function (contentManager) {
            Crowd._sheet = contentManager.GetImage("PeepSheet");
            Crowd._sheetMirror = contentManager.GetImage("PeepSheetMirror");
        };

    Crowd.ROWS = 15;
    Crowd.COLS = 7;
    Crowd.POPULATION = 200;
    Wanted.Crowd = Crowd;
})(Wanted || (Wanted = {}));