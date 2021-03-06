define(['arches'], function(arches) {
    var ontologyUtils = {
        /**
         * makeFriendly - makes a shortened name from an fully qalified name 
         * (eg: "http://www.cidoc-crm.org/cidoc-crm/E74_Group")
         *
         * @param  {ontolgoyName} the request method name
         * @return {string}
         */
        makeFriendly: function(ontolgoyName) {
            if (!!ontolgoyName) {
                var parts = ontolgoyName.split("/");
                return parts[parts.length - 1];
            }
            return '';
        },

        getSelect2ConfigForOntologyProperties: function(value, domain, range) {
            return {
                value: value,
                clickBubble: false,
                placeholder: 'Select an Ontology Property',
                closeOnSelect: true,
                allowClear: false,
                ajax: {
                    url: function() {
                        return arches.urls.ontology_properties;
                    },
                    data: function(term, page) {
                        var data = {
                            'domain_ontology_class': domain,
                            'range_ontology_class': range,
                            'ontologyid': ''
                        };
                        return data;
                    },
                    dataType: 'json',
                    quietMillis: 250,
                    results: function(data, page, query) {
                        var ret = data;
                        if(query.term !== ""){
                            ret = data.filter(function(item){
                                return item.toUpperCase().includes(query.term.toUpperCase());
                            });
                        }
                        return {
                            results: ret
                        };
                    }
                },
                id: function(item) {
                    return item;
                },
                formatResult: ontologyUtils.makeFriendly,
                formatSelection: ontologyUtils.makeFriendly,
                initSelection: function(el, callback) {
                    callback(value());
                }
            };
        }
    };
    return ontologyUtils;
});