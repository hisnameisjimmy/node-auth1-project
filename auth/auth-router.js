const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
  let user = req.body;
  const hash = await bcrypt.hashSync(user.password, 5); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
        console.log(error);
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedin = true;
        res
          .status(200)
          .json({ message: `Welcome ${user.username}! have a... biscuit.` });
      } else {
        // req.session.loggedin will not exist if we end up here... see above...
        // so we are not in danger of a session being created - we just don't
        // modify req.session, and we are good.
        res.status(401).json({ message: "Nice try. But, no. Try. Try again." });
      }
    })
    .catch(error => {
      // req.session.loggedin will not exist if we end up here... see above...
      // so we are not in danger of a session being created - we just don't
      // modify req.session, and we are good.
      res.status(500).json(error);
    });
});

router.delete("/logout", (req, res) => {
  if (req.session) {
    // check out the documentation for this method at
    // https://www.npmjs.com/package/express-session, under Session.destroy().
    req.session.destroy(err => {
      if (err) {
        res
          .status(400)
          .send("queue the groundhog day trope... you can never leave...");
      } else {
        res.send("you made it out! good job!");
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;