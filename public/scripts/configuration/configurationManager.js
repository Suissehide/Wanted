var Wanted;
(function (Wanted) {
    var ConfigurationManager = (function () {
        function ConfigurationManager(configuration) {
            console.log(configuration);
            // Update the prototypes from the config
            // Wanted.Cursor.SIZE = new eg.Size2d(configuration.shipConfig.WIDTH, configuration.shipConfig.HEIGHT);
            // Wanted.Cursor.DAMAGE_INCREASE_RATE = configuration.shipConfig.DAMAGE_INCREASE_RATE;

            // Wanted.CursorFireController.MIN_FIRE_RATE = eg.TimeSpan.FromMilliseconds(configuration.shipConfig.MIN_FIRE_RATE);

            // Wanted.CursorMovementController.DRAG_AREA = configuration.shipMovementControllerConfig.DRAG_AREA;
            // Wanted.CursorMovementController.DRAG_COEFFICIENT = configuration.shipMovementControllerConfig.DRAG_COEFFICIENT;
            // Wanted.CursorMovementController.ENGINE_POWER = configuration.shipMovementControllerConfig.ENGINE_POWER;
            // Wanted.CursorMovementController.MASS = configuration.shipMovementControllerConfig.MASS;
            // Wanted.CursorMovementController.ROTATE_SPEED = configuration.shipMovementControllerConfig.ROTATE_SPEED * .0174532925;

            // Wanted.CursorLifeController.START_LIFE = configuration.shipConfig.START_LIFE;

            // Wanted.Boost.DURATION = eg.TimeSpan.FromMilliseconds(configuration.abilityConfig.BOOST_DURATION);
            // Wanted.Boost.SPEED_INCREASE = configuration.abilityConfig.BOOST_SPEED_INCREASE;

            // Wanted.Map.SIZE = new eg.Size2d(configuration.mapConfig.WIDTH, configuration.mapConfig.HEIGHT);
            // Wanted.Map.BARRIER_DEPRECATION = configuration.mapConfig.BARRIER_DEPRECATION;

            Wanted.GameScreen.MAX_SCREEN_HEIGHT = configuration.ScreenConfig.MAX_SCREEN_HEIGHT;
            Wanted.GameScreen.MAX_SCREEN_WIDTH = configuration.ScreenConfig.MAX_SCREEN_WIDTH;
            Wanted.GameScreen.MIN_SCREEN_HEIGHT = configuration.ScreenConfig.MIN_SCREEN_HEIGHT;
            Wanted.GameScreen.MIN_SCREEN_WIDTH = configuration.ScreenConfig.MIN_SCREEN_WIDTH;
            Wanted.GameScreen.SCREEN_BUFFER_AREA = configuration.ScreenConfig.SCREEN_BUFFER_AREA;

            // Wanted.Bullet.BULLET_DIE_AFTER = eg.TimeSpan.FromMilliseconds(configuration.GameConfig.BULLET_DIE_AFTER);
            // Wanted.Bullet.SIZE = new eg.Size2d(configuration.bulletConfig.WIDTH, configuration.bulletConfig.HEIGHT);

            // Wanted.HealthPack.SIZE = new eg.Size2d(configuration.healthPackConfig.WIDTH, configuration.healthPackConfig.HEIGHT);
            // Wanted.HealthPack.LIFE_SPAN = eg.TimeSpan.FromMilliseconds(configuration.healthPackConfig.LIFE_SPAN);

            Wanted.LeaderboardManager.LEADERBOARD_SIZE = configuration.LeaderboardConfig.LEADERBOARD_SIZE;

            // Wanted.DeathScreen.RESPAWN_TIMER = eg.TimeSpan.FromSeconds(configuration.GameConfig.RESPAWN_TIMER);

            $.extend(this, configuration);
            Wanted.LatencyResolver.REQUEST_PING_EVERY = configuration.GameConfig.REQUEST_PING_EVERY;
        }
        return ConfigurationManager;
    })();
    Wanted.ConfigurationManager = ConfigurationManager;
})(Wanted || (Wanted = {}));