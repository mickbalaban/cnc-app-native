var remote = require('remote');

define([
  'app',
  'views/NavView',
  'views/ConnectionView',
  'views/DashboardView'
],

function(
  app,
  NavView,
  ConnectionView,
  DashboardView
)
{

    var v = Backbone.View.extend(
    {
        id: 'topView',

        className: 'index-view container-fluid',

        initialize: function()
        {
          var that = this;
          app.channel.bind('connection.success', function(e) {
            //  chrome.app.window.current().innerBounds.setSize(380,417);
              app.selectedView = 'dashboard';
              that.render();
          });

          app.channel.bind('connection.closed', function(e) {
            //  chrome.app.window.current().innerBounds.setSize(380,417);
              app.selectedView = 'connection';
              that.render();
          })

          app.channel.bind('screen.autoresize', function(e) {
            var win = remote.getCurrentWindow();
            win.setSize($('.content').width(), ($('.content').height() + 70));
          });

        },

        events: {

        },


        render: function()
        {

            if (app.selectedView == 'connection') {
                var v = this.loadView(new ConnectionView(), 'connection');
                this.$el.html(v.render());

            }

            if (app.selectedView == 'dashboard') {
                var v = this.loadView(new DashboardView(), 'dashboard');
                this.$el.html(v.render());
            }

            app.channel.trigger('screen.autoresize', true);

            return this.$el;
        }
    });

    return v;

});
