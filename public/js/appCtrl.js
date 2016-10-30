/**
 * Created by davidshanline on 10/29/16.
 * main controller for the application
 */
appCtrl = function(){
    var self = this;
    ko.extenders.uppercase = function(target, option){
        target.subscribe(function(newValue){
            target(newValue.toUpperCase());
        });
        return target;
    };
    self.searchText = ko.observable("");
    self.users = ko.observableArray();
    self.recentSearches = ko.observableArray();
    self.viewStatus = ko.observable("");
    self.errorMsg = ko.observable("");
    self.errorDocumentation = ko.observable("");
    self.exactUser = ko.observable();
    self.exactUserFound = ko.observable(false);
    self.itemsPerPage = ko.observable(30);
    self.parsed = ko.observable();
    self.pages = ko.observable(0);
    self.alertText = ko.observable("");

    self.searchForMatches = function(data){
        self.searchText(data);

        //if this is the first time the string was searched for, add it to the recentSearches array
        if (_.indexOf(self.recentSearches(), data) === -1){
            self.recentSearches.unshift(data);
        }
        //if the string has been searched before, remove it from the array and put it back in the front
        //this will maintain an order of most recent search at the top
        else{
            self.recentSearches.remove(data);
            self.recentSearches.unshift(data);
        }

        //this ajax call searchers for a specific user matching the search text
        $.ajax({
            url: "https://api.github.com/users/" + self.searchText(),
            success: function(response){
                self.exactUser(new User(response));
                self.exactUserFound(true);
                console.log("exact match: " + response);
            },
            error: function(request, status, error){
                self.exactUserFound(false);
            }
        });

        //this ajax call searches for any users whose name contains the search
        $.ajax({
            url: "https://api.github.com/search/users",
            data: {
                q: data
            },
            success: function(response, textStatus, xhr) {
                console.log(response);
                //var responseHeaders = xhr.getAllResponseHeaders();

                if (response.total_count > 0){
                    var linkHeader = xhr.getResponseHeader("Link");
                    if (linkHeader != null){
                        self.parsed(self.parseLinkHeader(linkHeader));
                    }
                    else{
                        self.pages(1);
                    }

                    self.users(response.items);
                    self.buildPageArray(1);
                    self.viewStatus("ok");
                }
                else {
                    self.users.removeAll();
                    self.viewStatus("noResults");
                }
            },
            error: function(request, status, error){
                self.viewStatus("error");
                response = JSON.parse(request.responseText);
                self.errorMsg(response.message);
                self.errorDocumentation(response.documentation_url);
            }
        });
    };

    //this handles the user click on a page in the search results pagination
    self.pageClicked = function(pageNum){
        console.log("page clicked: " + pageNum);
        $.ajax({
            url: "https://api.github.com/search/users",
            data: {
                q: self.searchText(),
                page: pageNum
            },
            success: function(response, textStatus, xhr) {
                console.log(response);
                self.users(response.items);
                console.log(self.users());
            },
            error: function(request, status, error){
                self.viewStatus("error");
                response = JSON.parse(request.responseText);
                self.errorMsg(response.message);
                self.errorDocumentation(response.documentation_url);
            }
        });
    };

    //builds out the pagination array
    self.buildPageArray = function(currentPage){
        var pageSize = 8;
        if(pageSize > self.pages()){
            pageSize = self.pages();
        }
        if ($('#pagination').children().length == 0){
            self.paginationObj = $('#pagination').bootpag({
                total: self.pages(),
                page: currentPage,
                maxVisible: pageSize,
                leaps: true,
                firstLastUse: true,
                wrapClass: 'pagination pagination-sm',
                activeClass: 'active',
                disabledClass: 'disabled',
                nextClass: 'next',
                prevClass: 'prev',
                lastClass: 'last',
                firstClass: 'first'
            });


            $('#pagination').on("page", function(event, num){
                self.pageClicked(num);
            });
        }
        else {
            $('#pagination').bootpag({total: self.pages(), page: currentPage, maxVisible: pageSize});
        }
    };

    //handles the search button click
    $("#searchButton").click(function(){
        self.searchForMatches(self.searchText());
    });

    //this jquery function handles functionality when a user presses a key while focus is on the textbox
    //if the key pressed is the enter key, then handle the action
    $('#searchTextBox').keyup(function(event){
        if (event.which == 13){ //if user presses enter key
            self.searchForMatches(self.searchText());
        }
    });

    //this function parses the link header provided in the GitHub api response
    //GitHub recommends using their link headers for pagination
    self.parseLinkHeader = function(header){
        if (header.length ==0){
            throw new Error("input must not be of zero length");
        }

        //split the header into an array of strings by separating the string into substrings
        var parts = header.split(',');
        var links = {};

        //iterate over each the parts for further parsing.
        _.each(parts, function(p){
            //split each part of the header into separate sections
            var section = p.split(';');
            //there should be 2 sections to each part of the link header
            if(section.length != 2){
                throw new Error("section could not be split on ';'");
            }

            //first section of each part should be the url, so remove the special characters to grab just the url
            var url = section[0].replace(/<(.*)>/, '$1').trim();
            //second section of each part should be the name of the link, so remeove the special characters to grab just the name.
            var name = section[1].replace(/rel="(.*)"/, '$1').trim();
            if (name === "last"){
                self.pages(self.getLastPage(url));
            }
            //add a key value pair to the object using the name and url.
            links[name] = url;
        });
        return links;
    };

    //parses the link header url for the last page to get the page number of the last page of results from GitHub
    self.getLastPage = function(url){
        parts = url.split("page=");
        //_.each(parts, function(p){
            pages = parseInt(parts[1]);
            console.log("last page: " + pages);
        //})
        return pages;
    };

    $('#searchTextBox').blur(function(){
        self.searchText.valueHasMutated();
    });


    //FUTURE ENHANCEMENTS

    //this isn't hooked up yet, but will be used to modify the number of results displayed per page
    //self.changePageSize = function(data){
    //    self.itemsPerPage(data.val);
    //    self.pageClicked(1);
    //    self.buildPageArray(1);
    //};

    //this sets up the jquery typeahead functionality and attributes
    //currently commented out until functionality is hooked up
    // $('#symbolSearch .typeahead').typeahead({
    //         hint: true,
    //         highlight: true,
    //         minLength: 1
    //     },
    //     {
    //         name: 'symbol-names',
    //         limit: 100,
    //         source: self.substringMatcher(self.allSymbols())
    //     }
    // );

    //this jquery function handles functionality for when an item is selected from the typeahead dropdown
    //$('.typeahead').on('typeahead:selected', function(event, item){
    //    self.searchText(item);

        //this if statement checks if the symbol entered by the user matches a symbol in the requested list of symbols.
        // if (_.indexOf(self.allSymbols(), self.searchText(), true) >= 0){
        //     self.getSymbolSnapshot();
        // }
        // else {
        //     self.viewStatus("invalid symbol");
        // }
    //});


};