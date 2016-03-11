define([
    'app',
    'views/TopView'
],

function(
    app,
    TopView
)
{
    var AppRouter = Backbone.Router.extend(
    {

        initialize: function()
        {
            var that = this;
            this.topView = new TopView({el: $('#topView')});
        },

        routes:
        {
            '/': 'showConnect',
            '*actions':'showConnect'
        },

        showConnect: function(e)
        {
            app.selectedView = 'connection';
            this.topView.render();
        },

    });

    return AppRouter;
});
