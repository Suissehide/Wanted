var Wanted;
(function (Wanted) {
    var UserInformationManager = (function () {
        function UserInformationManager(userInformation) {
            this._displayName = $("#DisplayName");
            this._displayNameLB = $("#DisplayNameLB");
            this._you = $("#You");
            this._youLB = $("#YouLB");
            this._displayName.text(userInformation.Name);
            this._displayNameLB.text(userInformation.Name);
        }
        return UserInformationManager;
    })();
    Wanted.UserInformationManager = UserInformationManager;
})(Wanted || (Wanted = {}));