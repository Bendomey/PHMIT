module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.redirect_to = req.path;
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');      
  },
  ensureAdministrator: function(req, res, next){
    if(req.user.isAdmin == '1'){
      return next();
    }
    res.redirect('/sorry_page');
  }
};
