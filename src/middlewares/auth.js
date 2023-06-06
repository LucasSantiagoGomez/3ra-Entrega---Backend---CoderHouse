const checkLogin = (req, res, next) => {
	if (!req.session.user) return res.redirect("/");
	next();
  }
  
  const checkLogged = (req, res, next) => {
	if (req.session.user) return res.redirect("/home");
	next();
  }

  function checkUser(req, res, next) {
    const role = req.session.user.role;
    if (role === "user") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Acceso denegado. No eres un usuario." });
    }
  }
  
  export { checkLogged, checkLogin, checkUser };