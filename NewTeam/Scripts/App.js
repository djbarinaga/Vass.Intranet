$(document).ready(function () {
    var groupName;
    var groupType;
    var groupOwner;

    $('#btnCreateTeam').on('click', function () {
        createGroup();
    });

    function createGroup() {
        $('#alert').text('Creando grupo...');
        $('#alert').show();

        groupName = $('#txtGroupName').val();
        groupType = $('#selectGroupType').val();
        groupOwner = $('#txtOwner').val();

        var url = "https://graph.microsoft.com/v1.0/groups";

        var data = new Object();
        data.description = groupName;
        data.displayName = groupName;
        data.groupTypes = ["Unified"];
        data.mailEnabled = true;
        data.mailNickname = groupName.toLowerCase().replace(/ /g, '');
        data.securityEnabled = false;

        var $ajax = $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json",
                "Content-Length": JSON.stringify(data).length
            }
        });
    }
});