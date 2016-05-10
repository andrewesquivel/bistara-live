Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('home', {path: '/'});
  this.route('room', {path: '/room/:pin?',   data:function(){
    return this.params
  }});
});
