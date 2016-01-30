if(Apps.find({}).count() < 1){

    var fs = Npm.require('fs');

    fs.readFile('../../../../../server/data.json', 'utf8', Meteor.bindEnvironment(function(err, data) {
        if (err) throw err;
        var newAppData = data.split("\n");

        for (var i = 0; i < newAppData.length - 1; i++) {
            var rawAppData = JSON.parse(newAppData[i]);
            var newApp = {};

            newApp.name = rawAppData.title;
            newApp.app_id = rawAppData.app_id;
            newApp.developer = rawAppData.developer;
            newApp.description = rawAppData.intro;
            newApp.avgRating = parseInt(rawAppData.score) / 2;
            newApp.iconUrl = rawAppData.thumbnail_url;
            newApp.reccomendedApps = rawAppData.top_5_app;
            newApp.numberOfRecommendations = 0;

            Apps.insert(newApp);
        }
        // Project Assignment code goes here
        //Get all the apps to an array
        appstoCal = Apps.find({}).fetch();
        for(var i = 0; i < appstoCal.length - 1; i++){
            //The recomended apps array
            var recApps = appstoCal[i].reccomendedApps;
            if(recApps != null){
                for(var j = 0; j < recApps.length - 1; j++){
                   //Get the app data with the reccomended app_id
                   var target = appstoCal.filter(function(obj){
                        return obj.app_id == recApps[j];
                    })[0];
                    
                    //Increment the number of recommendations and update it
                    Apps.remove(target);
                    target.numberOfRecommendations++;
                    Apps.insert(target);
                    
                }
            }
        }

    }, function(err){
        throw err;
    }));
}
