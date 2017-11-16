'use strict';

var Dummy = Dummy || (function() {
  Accordion.prototype.click = function click(event) {
    if (event.target === this.header) {
      return this.update(Object.assign.call(this, this.state, {
        active: !this.state.active
      }));
    }
  };

  Accordion.prototype.update = function (state) {
    if (state.active) {
      this.open();
    }
    if (!state.active) {
      this.close();
    }
    this.state = state;
  };

  Accordion.prototype.open = function open() {
    this.body.removeAttribute('data-accordion-item-closed');
    this.status.removeAttribute('data-accordion-item-closed');
  };

  Accordion.prototype.close = function() {
    this.body.setAttribute('data-accordion-item-closed', true);
    this.status.setAttribute('data-accordion-item-closed', true);
  };

  Accordion.prototype.initialize = function (state) {
    this.update(state);
    this.root.addEventListener('click', this.click.bind(this));
  };


  UserRegistrationForm.prototype.registerUser = function (user, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback(JSON.parse(request.responseText));
      }
    };
    request.open('POST', '/users', true);
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    request.send(JSON.stringify(user));
  };

  UserRegistrationForm.prototype.submit = function (event) {
    var user = {};
    event.preventDefault();
    user.timestamp = new Date();
    user.fullname = this.fields.fullname.value || 'None';
    user.email = this.fields.email.value || 'None';
    user.city = this.fields.city.value || 'None';
    user.ridemode = parseInt(this.fields.ridemode.value);
    user.weekdays = Array.prototype.filter
      .call(
        this.fields.weekdays,
        function (checkbox) {
          return checkbox.checked;
        }
      )
      .map(
        function(checkbox) {
          return parseInt(checkbox.value);
        }
      );
    this.registerUser(user, function(users) {
      this.reset();
      this.dummy.registeredUserList.update({data: users});
    }.bind(this));
  };

  UserRegistrationForm.prototype.focus = function (event) {
    event.target.nextElementSibling.removeAttribute('data-hidden-filling-tip');
  };

  UserRegistrationForm.prototype.blur = function (event) {
    event.target.nextElementSibling.setAttribute('data-hidden-filling-tip', true);
  };

  UserRegistrationForm.prototype.reset = function () {
    this.fields.fullname.value = null;
    this.fields.email.value = null;
    this.fields.city.value = null;
    this.fields.ridemode.forEach(function clear(item, index) {
      if (index === 0) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    this.fields.weekdays.forEach(function clear(item) {
      item.checked = false;
    });
    this.fields.fullname.focus();
  };

  UserRegistrationForm.prototype.initialize = function (state) {
    state = state || {};
    this.cancelButon.addEventListener('click', this.reset.bind(this));
    this.root.addEventListener('submit', this.submit.bind(this));
    Object.keys(this.fields).forEach(function (key) {
      if (key !== 'weekdays' && key !== 'ridemode') {
        this.fields[key].addEventListener('focus', this.focus.bind(this));
        this.fields[key].addEventListener('blur', this.blur.bind(this));
      }
    }, this);
    this.fields.fullname.focus();
  };

  RegisteredUserList.prototype.getRegisteredUsers = function (callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback(JSON.parse(request.responseText));
      }
    };
    request.open('GET', '/users', true);
    request.send();
  };

  RegisteredUserList.prototype.removeRegisteredUser = function (id, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback(JSON.parse(request.responseText));
      }
    };
    request.open('DELETE', '/users/' + id, true);
    request.send();
  };

  RegisteredUserList.prototype.update = function (state) {
    if (state.data.length) {
      this.users = state.data
        .map(function (item) {
          return new ListRow({data: item});
        });

      this.body.innerHTML = this.users
        .map(function (row) {
          return row.template;
        })
        .reduce(function(prev, curr) {
          return prev + curr;
        });
    } else {
      this.body.innerHTML = '';
    }
  };

  RegisteredUserList.prototype.click = function(event) {
    var parent = event.target.parentElement;
    var grandparent = parent.parentElement;
    if (grandparent.hasAttribute('data-registered-user-list-item')) {
      var user = this.users.filter(function(user) {
        return grandparent.getAttribute('data-registered-user-list-item') === user.data._id;
      }).shift();
      if (parent.hasAttribute('data-registered-user-list-item-remove')) {
        this.removeRegisteredUser(user.data._id, function(users) {
          this.update({data: users});
        }.bind(this));
      }
    }
  };

  RegisteredUserList.prototype.initialize = function (state) {
    state = state || {};
    if (!state.data || !state.data.length) {
      this.getRegisteredUsers(function (users) {
        this.update(Object.assign(state, {data: users}));
      }.bind(this));
    } else {
      this.update(state);
    }
    this.root.addEventListener('click', this.click.bind(this));
  };

  ListRow.prototype.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ListRow.prototype.ridemodes = ['Always', 'Sometimes', 'Never'];

  ListRow.prototype.printRidemode = function (index) {
    return this.ridemodes[index];
  };

  ListRow.prototype.printWeekdays = function (weekdays) {
    var printString;
    var weekends = weekdays.indexOf(0) >= 0 && weekdays.indexOf(6) >= 0;
    var workdays = weekdays.indexOf(0) < 0 && weekdays.indexOf(6) < 0;
    if (weekdays.length === 0) {
      printString = 'None';
    } else if (weekdays.length === 2 && weekends) {
      printString = 'Weekends';
    } else if (weekdays.length === 5 && workdays) {
      printString = 'Week days';
    } else if (weekdays.length === 7) {
      printString = 'Every day';
    } else {
      printString = this.weekdays.filter(function(_, index) {
        return weekdays.indexOf(index) >= 0;
      }).join(', ');
    }
    return printString;
  };

  ListRow.prototype.getLocaleStrings = function (timestamp) {
    var date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  return Dummy;

  function Dummy (window) {
    this.accordion = new Accordion({
      element: window.document.querySelector('[data-accordion]')
    });

    this.registeredUserList = new RegisteredUserList({
      element: window.document.querySelector('[data-registered-user-list]')
    });

    this.userRegistrationForm = new UserRegistrationForm({
      dummy: this,
      element: window.document.querySelector('[data-user-registration-form]')
    });
  }

  function Accordion (options) {
    this.root = options.element;
    this.header = options.element.querySelector('[data-accordion-header]');
    this.body = options.element.querySelector('[data-accordion-body]');
    this.status = options.element.querySelector('[data-accordion-status]');
  }

  function UserRegistrationForm(options) {
    this.dummy = options.dummy;
    this.root = options.element;
    this.cancelButon = options.element.querySelector('[data-user-registration-form-cancel]');
    this.fields = {
      fullname: options.element.elements.fullname,
      email: options.element.elements.email,
      city: options.element.elements.city,
      ridemode: options.element.elements.ridemode,
      weekdays: options.element.elements.weekdays
    };
  }

  function RegisteredUserList (options) {
    this.root = options.element;
    this.body = options.element.querySelector('[data-registered-user-list-body]');
  }

  function ListRow(options) {
    var localeStrings = this.getLocaleStrings(options.data.timestamp);
    this.data = options.data;
    this.template = [
      '<tr class="registered-user-list-item" data-registered-user-list-item="' + this.data._id + '">',
        '<td>' + this.data.fullname + '</td>',
        '<td>' + this.data.email + '</td>',
        '<td>' + this.data.city + '</td>',
        '<td>' + this.printRidemode(this.data.ridemode) + '</td>',
        '<td>' + this.printWeekdays(this.data.weekdays) + '</td>',
        '<td>',
          '<span>' + localeStrings.date + '</span>',
          '<small>' + localeStrings.time + '</small>',
        '</td>',
        '<td data-registered-user-list-item-remove><i class="fa fa-trash-o trash"></i></td>',
      '</tr>'
    ].join('');
  }
})();

try {
  window.dummy = new Dummy(window);
  window.dummy.accordion.initialize({active: false});
  window.dummy.registeredUserList.initialize();
  window.dummy.userRegistrationForm.initialize();
} catch (e) {
  var module = module || {};
  module.exports = Dummy;
}
