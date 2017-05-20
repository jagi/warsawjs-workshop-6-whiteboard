FlowRouter.route('/', {
  action() {
    Meteor.call('createBoard', (err, boardId) => {
      if (err) {
        alert(err.message);
      }
      else if (boardId) {
        FlowRouter.go(`/boards/${boardId}`);
      }
    });
  }
});

FlowRouter.route('/boards/:id', {
  action() {
    BlazeLayout.render('Board', {
      content: 'main'
    });
  }
});