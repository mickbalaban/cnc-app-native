define([
  'app',
  'text!templates/nav.html'
],

function(
  app,
  Tpl
)
{
  var NavView = Backbone.View.extend(
  {
    initialize: function(o) {
      //this.activeView = 'program';
      this.tpl = _.template(Tpl);
    },

    events: {
      'click .program-page-btn': 'onProgramPage',
      'click .console-page-btn': 'onConsolePage'
    },

    onProgramPage: function(e)
    {
      /*
      this.activeView = 'program';
      $('.program-page').removeClass('hidden');
      $('.console-page').addClass('hidden');
      $('.program-page-btn').addClass('active');
      $('.console-page-btn').removeClass('active');
      channel.trigger('screen.autoresize', true);
      */
    },



    onConsolePage: function(e)
    {
      /*
        this.activeView = 'console';
        $('.program-page').addClass('hidden');
        $('.console-page').removeClass('hidden');
        $('.program-page-btn').removeClass('active');
        $('.console-page-btn').addClass('active');
        channel.trigger('screen.autoresize', true);
        */
    },

    render: function()
    {
      this.$el.append(this.tpl({app:app}));
      return this.$el;
    }
  });

  return NavView;
});
