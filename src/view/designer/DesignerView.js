/**
 * Created by Artem.Malieiev on 6/11/2015.
 */
define(function (require) {
    var Backbone = require('backbone'),
        $ = require('jquery'),
        ToolbarView = require('view/designer/ToolbarView'),
        SidebarView = require('view/designer/SidebarView'),
        TableView = require('view/preview/TableView'),
        DialogView = require('view/component/DialogView'),
        CanvasView = require('view/designer/CanvasView'),
        MetadataExplorer = require('util/MetadataExplorer'),
        c3 = require('c3'),
        QueryExecuter = require('util/QueryExecuter'),
        QueryResultsCollection = require('collection/QueryResultsCollection'),
        DomainsCollection = require('collection/DomainsCollection'),
        MetadataListItemView = require('view/designer/MetadataListItemView'),
        ListView = require('view/component/ListView'),
        MetadataResultsCollection = require('collection/MetadataResultsCollection'),
        DesignerViewTemplate = require('text!template/designer/DesignerViewTemplate.html');

    require('css!styles/designer/designer');
    require('css!bower_components/c3/c3');

    return Backbone.View.extend({
        initialize: function (config) {
            config = config || {};

            this.initialConfig = config;

            this.nativeQuery = '';
            this.queryExecuter = null;
            this.metadataExplorer = null;

            this.domainsCollection = new DomainsCollection();
            this.queryResultsCollection = new QueryResultsCollection();
            this.metadataResultsCollection = new MetadataResultsCollection();

            this.domainsCollection.fetch({reset: true});

            this.sidebar = new SidebarView({collection: this.queryResultsCollection});
            this.toolbar = new ToolbarView();
            this.canvas = new CanvasView();
            this.table = new TableView({collection: this.queryResultsCollection});

            this.listenTo(this.domainsCollection, 'sync', this.onDomainsLoaded);
            this.listenTo(this.toolbar, 'change:type', this.onTypeChange);
        },
        render: function () {
            this.$el.html(DesignerViewTemplate);
            this.$el.find('.sidebar-holder').html(this.sidebar.render().$el);
            this.$el.find('.toolbar-holder').html(this.toolbar.render().$el);
            this.$el.find('.canvas-holder').html(this.canvas.render().$el);

            this.$el.find('.canvas').html(this.table.render().$el);
            return this;
        },

        onDomainsLoaded: function () {
            var domain = this.domainsCollection.find(_.bind(function (domain) {
                return domain.get('name') === this.initialConfig.domain;
            }, this));

            this.nativeQuery = domain.get('nativeQuery');

            if (this.nativeQuery) {
                this.queryExecuter = new QueryExecuter(domain);
                this.queryExecuter.query(domain.get('nativeQuery')).then(_.bind(function (data) {
                    this.queryResultsCollection.reset(data);
                }, this));
            } else {
                this.metadataExplorer = new MetadataExplorer(domain);
                this.metadataExplorer.getMetaData().then(_.bind(this.onMetadataLoaded, this));
            }
        },

        onMetadataLoaded: function (data) {

            var listView = new ListView({
                collection: this.metadataResultsCollection,
                itemClass: MetadataListItemView
            });
            var dialog = new DialogView({
                title: 'metadata',
                content: listView.render().$el
            }).render();

            this.metadataResultsCollection.reset(data);
            dialog.center();

        },

        onTypeChange: function (event, type) {
            if (type === 'table') {
                this.$el.find('.canvas').html(this.table.render().$el);
            } else {
                c3.generate({
                    bindto: '.canvas',
                    data: {
                        columns: this.queryResultsCollection.getDataForC3(),
                        type: type
                    }
                });
            }
        }
    });
});