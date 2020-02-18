exports.seed = function(knex) {
  return knex("users").insert([
    { username: "Dance like a monkey", password: false },
  ]);
};
