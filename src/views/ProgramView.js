

define([
  'app',
  'machine',
  'text!templates/program.html'
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
        var that = this;
        this.tpl = _.template(Tpl);

        this.program = "";
        this.programLength = 0;
        this.running = false;

        machine.data.on('change:stat', function(c) {
          if ((c.attributes.stat == 4 || c.attributes.stat == 3) && that.running)
              that.onProgramCompleted();

          else if (c.attributes.stat == 6) {
            $('button.program-pause').addClass('active');
            $('button.program-pause span').html('Continue');
          }
          else if (c.attributes.stat == 5) {
            $('button.program-pause').removeClass('active');
            $('button.program-pause span').html('Pause');
          }
        })

        this.listenTo(window.channel, 'stop-and-flush', function(e) {
          this.onProgramCompleted();
        }, this)

        machine.data.on('change:line', function(c) {
          var _p = Math.round(c.attributes.line / (that.programLength / 100)) + "%";
          $('.program-progress .progress-bar').css('width', _p).html(_p)
        });
      },

      events: {
        'click button.program-start': 'programStart',
        'click button.program-stop': 'programStop',
        'click button.program-load': 'programLoad',
        'click button.program-edit': 'showProgramEdit',
        'click button.program-edit-cancel': 'cancelProgramEdit',
        'click button.program-edit-save': 'saveProgramEdit',
        'click button.program-clear': 'clearProgram',
        'click button.program-pause': 'pauseProgram',
        'change input.file-upload': 'uploadFile'
        //'change textarea': 'updateProgramFromText'
      },


      showProgramName: function(name)
      {
          $('.program-view').addClass("loaded");
          $('.program-view .panel-title').html(name);
          $('.program-view .run-actions').show();
          app.channel.trigger('screen.autoresize', true);
      },

      showProgramEdit: function()
      {
        $('.program-actions .run-actions').hide();
        $('.program-actions .edit-actions').show();
        $('.program-code-block textarea').removeAttr('disabled');
        app.channel.trigger('screen.autoresize', true);
      },

      cancelProgramEdit: function()
      {
        $('.program-actions .run-actions').show();
        $('.program-actions .edit-actions').hide();
        $('.program-code-block textarea').attr('disabled', true);
        $('.program-code-block textarea').val(this.program);
        app.channel.trigger('screen.autoresize', true);
      },

      clearProgram: function()
      {
        this.program = '';
        $('.program-actions .run-actions').hide();
        $('.program-actions .edit-actions').hide();
        $('.program-view .panel-title').html('No program loaded');
        this.clearProgramName();
        app.channel.trigger('screen.autoresize', true);
      },

      saveProgramEdit: function()
      {
        this.program = $('.program-code-block textarea').val().trim();
        $('.program-actions .run-actions').show();
        $('.program-actions .edit-actions').hide();
        $('.program-code-block textarea').attr('disabled', true);
        app.channel.trigger('screen.autoresize', true);
      },

      clearProgramName: function()
      {
        $('.program-view').removeClass("loaded");
        $('.program-view .alert').show();
        app.channel.trigger('screen.autoresize', true);
      },

      pauseProgram: function()
      {
        if (machine.data.attributes.stat == 6) {
          machine.command('~');
          return;
        }

        if (this.running)
          machine.command("!");
      },

      processCode: function(code)
      {

        this.program = code.trim();
        $('.program-code-block textarea').val(code);
        //console.info(code);
      },

      onProgramCompleted: function()
      {
        this.running = false;
        $('.program-view').removeClass('running');
        app.channel.trigger('screen.autoresize', true);
      },

      programStart: function(e)
      {



        this.running = true;
        //$('.program-progress .progress-bar').css('width', 0).html('0%')
        // flush the machine buffer
        g.write('%');

        $('.program-view').addClass('running');
        app.channel.trigger('screen.autoresize', true);

        //var _q = this.program.split("\n");
        //this.programLength = _q.length;

        //_.each(_q, function(l,k) {
        //  _q[k] = "N"+k+l;
        //})
        //machine.serialQueue = _q;
        //machine.sendNextLine();
        g.sendFile(app.gcodeFile.path);
      },

      uploadFile: function(e)
      {
        var file = e.currentTarget.files[0];
        app.gcodeFile = file;
        var reader = new FileReader();
        var that = this;
        var name = file.name;

        reader.onload = function(e) {
          that.processCode(e.target.result);
          that.showProgramName(name);
        };
        reader.readAsText(file);
      },

      programLoad: function(e)
      {
        $('input.file-upload').trigger('click');
        /*
          chrome.fileSystem.chooseEntry(function (entry) {

            if (chrome.runtime.lastError) {
              console.info(chrome.runtime.lastError.message);
              return;
            }

            entry.file(function(file) {
              var reader = new FileReader();
              reader.onload = function(e) {
                programView.processCode(e.target.result);
                programView.showProgramName(entry.name);
              };
              reader.readAsText(file);
              //replaceDocContentsFromFileEntry();

            });
          });
          */
      },


      render: function()
      {
        this.$el.html(this.tpl({app:app}));
        return this.$el;
      }
  });
  return v;
});
