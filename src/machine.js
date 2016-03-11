define([
  'app'
],
function(
  app
) {

    var that = null;

    var mmodel = Backbone.Model.extend({
        defaults:
        {
            default_speed_mm:100,
            default_speed_in:0.1,
            jog_speed: 800,
            jog_step: 1,
            jog_mode: 'con',
            coords: 'g54',
            posx: 0,
            posy: 0,
            posz: 0
        }
    });

    function Machine()
    {
        this.ctrlPort = null;
        this.dataPort = null;
        this.ctrlConnection = false;
        this.dataConnection = false;
        this.running = false;
        this.serialPortSpeed = 115200;
        this.serialQueue = [];
        this.responseBuffer = "";
        this.queueAvailable = 28;

        this.data = new mmodel();

/*
        this.data.on('change:unit', function(d) {
          if(d.attributes.unit == 1 && d.attributes.jog_mode == 'jog')
            d.set({jog_speed:d.attributes.zvf});
        })
*/
        that = this;
    }

    Machine.prototype.get = function(e)
    {
        return this.data.get(e);
    };

    Machine.prototype.set = function(e)
    {
        return that.data.set(e);
    };

    Machine.prototype.trigger = function(e)
    {
        that.data.trigger(e);
    }

    Machine.prototype.onConnectionError = function(e)
    {
        that.connected = false;
        channel.trigger('connection.error', e);
    }

    Machine.prototype.command = function(data, cb) {
      if (!cb)
        cb = function() {};

      g.write(data);
    }

    Machine.prototype.homeAxis = function(axis)
    {
        that.command('{"gc": "G28.2 _AXIS_0"}'.replace("_AXIS_", axis));
    }

    Machine.prototype.getStatusReport = function()
    {
        that.command('{"sr":""}');
    }

    Machine.prototype.processResponse = function(r)
    {
      //var res =  ab2str(r.data).trim().split("\n");
      var str =  ab2str(r.data);
      var lb = str.indexOf('\n');
      // if there is a line break, try to interpret the response as json

      if (lb !== -1) {
        that.responseBuffer += str.substring(0, lb);
        var strr =  str.substring(lb);
        //console.info(that.responseBuffer);
        try {
            var _r = JSON.parse(that.responseBuffer);
        } catch (err) {
            // not valid json
            //console.info(that.responseBuffer);
            //console.info(err);
            channel.trigger("machine.response", {}, that.responseBuffer);
            that.responseBuffer = strr;
            return;
        }
        channel.trigger('machine.response', _r, that.responseBuffer);
        //console.info(that.responseBuffer);
        that.responseBuffer = strr;
      } else {
        that.responseBuffer += str;
      }
      that.sendNextLine();
    }

    Machine.prototype.zeroMachine = function(axis)
    {
        that.command('{"gc": "G28.3 _AXIS_0"}'.replace('_AXIS_', axis));
        that.command('{"sr":""}');
    },

    Machine.prototype.pauseAndFlush = function()
    {
      that.command("!\n%\~");
    }

    Machine.prototype.updateFromReport = function(sr)
    {
        this.data.set(sr);
    }

    Machine.prototype.setUnits = function(unit)
    {
        if (unit == 'mm')
          that.command('{"gc": "G21"}');
        else
          that.command('{"gc": "G20"}');

        that.command('{"sr":""}')
    }

    window.ab2str = function(buf)
    {
        var bufView = new Uint8Array(buf);
        var encodedString = String.fromCharCode.apply(null, bufView);
        return decodeURIComponent(escape(encodedString));
    }

    window.str2ab = function(str)
    {
        var encodedString = unescape(encodeURIComponent(str));
        var bytes = new Uint8Array(encodedString.length);
        for (var i = 0; i < encodedString.length; ++i) {
            bytes[i] = encodedString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    return new Machine();


});
