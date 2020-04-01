/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }

  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  if (await Rental.count() > 0) {
    return generateUsers();
  }

  await Rental.createEach([
    { "createdAt": 1571322771244, "updatedAt": 1571322771244, "id": 1, "title": "沙田第一城", "imgurl": "http://www.gangpiaoquan.com/Upload/15417/renth/20190505/thumb/5cce98327dc03.jpg", "estate": "Festival City", "numbedrooms": 1, "area": 100, "tenants": 2, "rents": 15000, "_id": 1 },
    { "highlight": "on", "createdAt": 1571322938177, "updatedAt": 1571322938177, "id": 2, "title": "沙田第九城", "imgurl": "https://www.honestdesign.com.hk/wp-content/uploads/2016/12/01-_1240778.jpg", "estate": "Tin Ma Court", "numbedrooms": 2, "area": 200, "tenants": 2, "rents": 35800, "_id": 2 },
    { "highlight": "on", "createdAt": 1571322971759, "updatedAt": 1571322971759, "id": 3, "title": "沙田第三城", "imgurl": "https://www.honestdesign.com.hk/wp-content/uploads/2016/12/01-_1240778.jpg", "estate": "Tin Ma Court", "numbedrooms": 4, "area": 300, "tenants": 5, "rents": 65800, "_id": 3 },
    { "highlight": "on", "createdAt": 1571323280358, "updatedAt": 1571323280358, "id": 4, "title": "沙田第四城", "imgurl": "https://www.honestdesign.com.hk/wp-content/uploads/2016/12/01-_1240778.jpg", "estate": "Tin Ma Court", "numbedrooms": 5, "area": 560, "tenants": 4, "rents": 78000, "_id": 4 },
    { "highlight": "on", "createdAt": 1571323316577, "updatedAt": 1571323316577, "id": 5, "title": "沙田第五城", "imgurl": "http://www.gangpiaoquan.com/Upload/15417/renth/20190505/thumb/5cce98327dc03.jpg", "estate": "City One Shatin", "numbedrooms": 8, "area": 780, "tenants": 4, "rents": 105000, "_id": 5 },
    // etc.
  ]);


  return generateUsers();

  async function generateUsers() {
    if (await User.count() > 0) {
      return;
    }

    await User.createEach([
      { username: "admin", password: "123456", role: "admin" },
      { username: "leborn", password: "123456", role: "client" },
      { username: "james", password: "123456", role: "client" },
      { username: "harden", password: "123456", role: "client" },
      // etc.
    ]);



    const shatin1 = await Rental.findOne({ title: "沙田第一城" });
    const shatin5 = await Rental.findOne({ title: "沙田第五城" });
    const shatin3 = await Rental.findOne({ title: "沙田第三城" });
    const shatin4 = await Rental.findOne({ title: "沙田第四城" });
    const leborn = await User.findOne({ username: "leborn" });
    const james = await User.findOne({ username: "james" });
    const harden = await User.findOne({ username: "harden" });

    await User.addToCollection(leborn.id, 'livein').members([shatin1.id, shatin5.id]);
    await User.addToCollection(james.id, 'livein').members([shatin3.id, shatin5.id]);
    await User.addToCollection(harden.id, 'livein').members([shatin1.id, shatin4.id, shatin3.id]);

    return;
  }


};
