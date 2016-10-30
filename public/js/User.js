/**
 * Created by davidshanline on 10/29/16.
 */
 User = function(data){
     var self = this;
     self.avatar_url = "";
     self.bio = null;
     self.blog = "";
     self.company = "";
     self.created_at = "";
     self.email = "";
     self.events_url = "";
     self.followers = 0;
     self.followers_url = "";
     self.following = 0;
     self.following_url = "";
     self.gists_url = "";
     self.gravatar_id = "";
     self.hireable= false;
     self.html_url = "";
     self.id = -1;
     self.location = "";
     self.login =  "";
     self.name = "";
     self.organizations_url = "";
     self.public_gists = 0;
     self.public_repos = 0;
     self.received_events_url = "";
     self.repos_url = "";
     self.site_admin = false;
     self.starred_url = "";
     self.subscriptions_url = "";
     self.type = "";
     self.updated_at = "";
     self.url = "";

    if(!_.isUndefined(data) && !_.isNull(data)){
        self.login =  data.login;
        self.id = data.id;
        self.avatar_url = data.avatar_url;
        self.gravatar_id = data.gravatar_id;
        self.url = data.url;
        self.html_url = data.html_url;
        self.followers_url = data.followers_url;
        self.following_url = data.following_url;
        self.gists_url = data.gists_url;
        self.starred_url = data.starred_url;
        self.subscriptions_url = data.subscriptions_url;
        self.organizations_url = data.organizations_url;
        self.repos_url = data.repos_url;
        self.events_url = data.events_url;
        self.received_events_url = data.received_events_url;
        self.type = data.type;
        self.site_admin = data.site_admin;
        self.name = data.name;
        self.company = data.company;
        self.blog = data.blog;
        self.location = data.location;
        self.email = data.email;
        self.hireable= data.hireable;
        self.bio = data.bio;
        self.public_repos = data.public_repos;
        self.public_gists = data.public_gists;
        self.followers = data.followers;
        self.following = data.following;
        self.created_at = data.created_at;
        self.updated_at = data.updated_at;
    }
};