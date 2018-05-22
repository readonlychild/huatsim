var app = {
  sim: function (totalTime, data, options) {
    options = options || {};
    options.snapInterval = options.snapInterval || 60 * 60 * 24;
    data.snaps = [];
    var clock = 0;
    data.fg = 0;
    data.processes.forEach((p) => {
      p.wip = 0;
      p.clock = 0;
      p.idle = 0;
      p.processed = 0;
    });
    data.processes[0].wip = data.processes[0].capacity;
    while (clock < totalTime) {
      var idx = 0;
      if (clock % options.snapInterval === 0 && clock !== 0) { // < snapping
        data.snaps.push(this.snap(data, clock));
      }
      data.processes.forEach((proc) => {
        if (proc.wip === 0) {
          proc.idle += 1;
        }
        if (idx === 0) {
          // first process, unlimited input
          proc.wip = proc.capacity;
        }
        if (idx === data.processes.length - 1) {
          // last process
        } else {

        }
        if (proc.clock >= proc.time) {
          console.log('-', proc.name, clock, proc.wip);
          if (idx === data.processes.length - 1) {
            // send to Finished Goods
            data.fg += proc.wip;
            proc.processed += proc.wip;
            proc.wip = 0;
            proc.clock = 0; // reset proc clock
          } else {
            proc.idle -= 1;
            // see if wip can be pushed to next station
            var nextProc = data.processes[idx + 1];
            var availToReceive = nextProc.capacity - nextProc.wip;
            if (availToReceive > 0) {
              var wipToSend = availToReceive >= proc.wip ? proc.wip : proc.wip - availToReceive;
              nextProc.wip += wipToSend;
              proc.wip -= wipToSend;
              proc.processed += wipToSend;
            }
            proc.wip = 0;
            proc.clock = 0; // reset proc clock
          }
        }
        proc.clock += 1;

        idx += 1;
      });

      clock += 1;
    }
    data.snaps.push(this.snap(data, clock));
  },
  snap: function (data, clock) {
    var m = '';
    var task = [
      '<div class="task">',
      '<span class="name"><img class="image" src="#img#" /> #name#</span>',
      '',
      '<span class="wip">#wip#</span>',
      '<span class="idle">#idle#</span>',
      '<span class="processed">#processed#</span>',
      '</div>'
    ].join('\n');

    data.processes.forEach((proc) => {
      m += task.replace(/#name#/g, proc.name)
        .replace(/#img#/g, proc.img || data.defaultImg)
        .replace(/#wip#/g, 'WIP ' + proc.wip)
        .replace(/#idle#/g, 'IDLE ' + proc.idle)
        .replace(/#processed#/g, 'PROC ' + proc.processed)
      ;
    });
    m += task.replace(/#name#/g, 'FG')
      .replace(/#img#/g, data.defaultImg)
      .replace(/#wip#/g, 'FG: ' + data.fg)
      .replace(/#idle#/g, '<br/>')
      .replace(/#processed#/g, '<br/>')
    ;
    return {
      markup: m,
      clock: clock
    };
  }
};

module.exports = app;
