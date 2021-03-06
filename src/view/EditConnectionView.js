/**
 * Created by Artem.Malieiev on 7/9/2015.
 */
define(function (require) {
    var Backbone = require('backbone'),
        $ = require('jquery'),
        _ = require('underscore'),
        ConnectionsCollection = require('collection/ConnectionsCollection'),
        EditConnectionViewTemplate = require('text!template/EditConnectionViewTemplate.html');

    return Backbone.View.extend({
        className: 'edit-connection',
        template: _.template(EditConnectionViewTemplate),
        events: {
            'click .connect': 'onConnectClick',
            'click .save': 'onSaveClick'
        },
        initialize: function () {
            this.model.collection = new ConnectionsCollection();
            this.render();
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.calculateHeight();
            return this;
        },
        calculateHeight: function () {
            setTimeout(function () {
                var bodyHeight = $('body').height();

                this.$el.height(bodyHeight - 40);
            }.bind(this), 0);
        },
        onConnectClick: function (event) {
            var values = _.reduce(this.$('form').serializeArray(), function (memo, value) {
                memo[value.name] = value.value;
                return memo;
            }, {});

            this.remove();

            this.model.save(_.extend(values, {
                url: 'jdbc:postgresql://' + values.server + ':' + values.port + '/' + values.database
            })).done(function () {
                Tamanoir.navigate('connection/' + this.model.get('id'), {trigger: true});
            }.bind(this));

            console.log('connect clicked', values);
        },
        onSaveClick: function () {
            var values = _.reduce(this.$('form').serializeArray(), function (memo, value) {
                memo[value.name] = value.value;
                return memo;
            }, {});

            this.remove();

            this.model.save(_.extend(values, {
                url: 'jdbc:postgresql://' + values.server + ':' + values.port + '/' + values.database
            }));
        }
    });
});