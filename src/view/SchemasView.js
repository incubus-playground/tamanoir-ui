/**
 * Created by Artem.Malieiev on 6/19/2015.
 */
define(function (require) {
    var Backbone = require('backbone'),
        SchemaListItemView = require('view/SchemaListItemView'),
        SchemaModel = require('model/SchemaModel'),
        SchemasViewTemplate = require('text!template/SchemasViewTemplate.html');

    return Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el.html(SchemasViewTemplate);
            this.collection.each(this.addSchema, this);
            return this;
        },
        addSchema: function (schemaModel) {
            this.$el.find('ul').append(new SchemaListItemView({model: schemaModel}).render().$el);
        }
    });
});