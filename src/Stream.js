(function(exports) {

    var that = null;

    function Stream()
    {

      channel.on('machine.response', function(msg)
      {

          if (msg.qr) {
            console.info("---- QR: ", msg.qr);
            machine.queueAvailable = msg.qr;
            return;
          }
          console.info("RECEIVED: ", JSON.stringify(msg));
          if (msg.r && msg.r.sr && !msg.sr)
            msg.sr = msg.r.sr;

          if (msg.sr) {
            machine.updateFromReport(msg.sr);
          }
      });

    }

    exports.Stream = Stream;

})(window);
