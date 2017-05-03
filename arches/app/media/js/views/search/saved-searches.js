define(['jquery', 'knockout', 'arches', 'search-data', 'bindings/smartresize'], function ($, ko, arches, data) {
    /**
    * A base viewmodel for functions
    *
    * @constructor
    * @name SavedSearchesViewModel
    *
    * @param  {string} params - a configuration object
    */
    var SavedSearchesViewModel = function(params) {
        var self = this;
        var mediaUrl = arches.urls.uploadedfiles;
        self.items = ko.observableArray([]);
        data.saved_searches.forEach(
            function(search){self.items.push({
                image: search.IMAGE[0].url,
                title: search.SEARCH_NAME,
                subtitle: search.SEARCH_DESCRIPTION,
                searchUrl: search.SEARCH_URL
                })
            })

        self.options = {
            itemSelector: '.ss-grid-item',
            masonry: {
                columnWidth: 500,
                gutterWidth: 25,
            }
        };
    };
    return SavedSearchesViewModel;
});
