define([
    'jquery',
    'knockout',
    'knockout-mapping',
    'viewmodels/workflow-step'
], function($, ko, koMapping, Step) {
    var Workflow = function(config) {
        var self = this;
        this.steps = config.steps || [];
        this.activeStep = ko.observable();
        this.previousStep = ko.observable();
        this.ready = ko.observable(false);
        this.loading = config.loading || ko.observable(false);
        this.alert = config.alert || ko.observable(null);
        this.state = {steps:{}};
        this.advance = true;

        this.restoreStateFromURL = function(){
            var urlparams = new window.URLSearchParams(window.location.search);
            var res = {};
            urlparams.forEach(function(v, k){res[k] = v;});
            res.steps = res.steps ? JSON.parse(res.steps) : {};
            this.state = res;
        };

        this.restoreStateFromURL();

        this.ready.subscribe(function() {
            self.steps.forEach(function(step, i) {
                if (!(self.steps[i] instanceof Step)) {
                    step.workflow = self;
                    step.loading = self.loading;
                    step.alert = self.alert;
                    self.steps[i] = new Step(step);
                    self.steps[i].ready.subscribe(function(val){
                        if (val) {
                            console.log(self.steps[i])
                        }
                    })
                    self.steps[i].complete.subscribe(function(complete) {
                        if (complete && self.advance) self.next();
                    });
                }
                self.steps[i]._index = i;
            });
            if (self.state.activestep) {
                self.activeStep(self.steps[self.state.activestep]);
            }
            else if(self.steps.length > 0) {
                self.activeStep(self.steps[0]);
            }
        });

        this.updateUrl = function() {
            //Updates the url with the parameters needed for the next step
            var urlparams = JSON.parse(JSON.stringify(this.state)); //deep copy
            urlparams.steps = JSON.stringify(this.state.steps);
            history.pushState(null, '', window.location.pathname + '?' + $.param(urlparams));
        };

        this.next = function(){
            var activeStep = self.activeStep();
            if (activeStep && activeStep.complete() && activeStep._index < self.steps.length - 1) {
                self.activeStep(self.steps[activeStep._index+1]);
            }
        };

        this.back = function(){
            var activeStep = self.activeStep();
            if (activeStep && activeStep._index > 0) {
                self.activeStep(self.steps[activeStep._index-1]);
            }
        };
    };
    return Workflow;
});