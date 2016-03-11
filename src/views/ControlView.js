define([
  'app',
  'machine',
  'text!templates/control.html'
],

function(
  app,
  machine,
  Tpl
)
{
  var v = Backbone.View.extend(
  {
    initialize: function(o) {
      this.tpl = _.template(Tpl);
    },

    events: {
      'click button.motors-off': 'motorsOff',
      'click button.clear-alarm': 'clearAlarm',
      'click button.stop-and-flush': 'stopAndFlush'
    },

    motorsOff: function(e)
    {
      machine.command('{"md":n}');
    },

    clearAlarm: function(e)
    {
      machine.command('{"clear":n}');
    },

    stopAndFlush: function(e)
    {
      machine.command('!\n%~');
    },


    render: function()
    {
      this.$el.html(this.tpl({app:app}));
      return this.$el;
    }
  });
  return v;
});
