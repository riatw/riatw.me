var FJDataAPIEntryScore = {};

FJDataAPIEntryScore.extendEndPoints = function(api) {
    api.generateEndpointMethods([
        {
            "id": "get_likes_from_entry",
            "route": "/sites/:site_id/entries/:entry_id/score/like",
            "verb": "GET",
            "resources": null
        },
        {
            "id": "add_likes_to_entry",
            "route": "/sites/:site_id/entries/:entry_id/score/like",
            "verb": "PUT",
            "resources": null
        },
        {
            "id": "remove_likes_from_entry",
            "route": "/sites/:site_id/entries/:entry_id/score/like",
            "verb": "DELETE",
            "resources": null
        }
    ]);
};
