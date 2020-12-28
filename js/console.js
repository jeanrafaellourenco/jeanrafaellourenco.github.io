// var util = util || {};
// util.toArray = function(list) {
//   return Array.prototype.slice.call(list || [], 0);
// };

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'whoami', 'reload', 'clear', 'date', 'echo', 'ls', 'help'
  ];

  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      function refreshPage(){
        window.location.reload();
    } 

      switch (cmd) {
        case 'whoami':
            output("My name is Jean Rafael Lourenço and I'm a sysadmin/Devops and a beginner developer.<br>"
            + "I'm always open to new challenges and aim to improve my skills every day.");
          break;
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'date':
          output( new Date() );
          break;
        case 'echo':
          output( args.join(' ') );
          break;
        case "help":
        case "?":
          output('<div class="ls-files">' + CMDS_.join('&nbsp;&nbsp'));
          break;
        case "reload":
          refreshPage();
          break;
          case "ls":  
          output('total 14<br>' 
          + 'drwxr-xr-x 2  jeanrafaellourenco  jeanrafaellourenco  4096  Dez  14  14:01  2020  <b><a href="https://github.com/jeanrafaellourenco" target="_blank">github</a></b><br>'
          + 'drwxr-xr-x 2  jeanrafaellourenco  jeanrafaellourenco  4096  Dez  14  15:50  2020  <b><a href="https://www.linkedin.com/in/jeanrafaellourenco/" target="_blank">linkedin</a></b><br>'
          + 'drwxr-xr-x 2  jeanrafaellourenco  jeanrafaellourenco  4096  Dez  14  21:41  2020  <b><a href="https://twitter.com/vidasocialzero" target="_blank">twitter</a></b>')
          break;
        default:
          if (cmd) {
            output('*** forbidden command: ' + cmd);
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<p>Welcome to my personal page 20.12.1 (MIT License/Copyright &copy; 2019 - ' +  new Date().getFullYear() + ')</p> ' 
      + '<p>Last update: Sun Dez  28 11:17:16 -03 2020.</p>'
      + '<p>&nbsp * Author: <a style="color:white;text-decoration: underline;" href="https://github.com/jeanrafaellourenco" target="_blank">github/jeanrafaellourenco</a></p><br/>'
      + "<p>You are in a limited shell.</p>" + "<p>Type '?' or 'help' to get the list of allowed commands.</p>");
    },
    output: output
  }
};


output();
