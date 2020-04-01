/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.username || !req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(401).send("User not found");

        if (user.password != req.body.password)
            return res.status(401).send("Wrong Password");

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.role = user.role;

            req.session.userid = user.id;

            req.session.username = req.body.username;

            sails.log("[Session] ", req.session);

            return res.redirect('/');

        });

    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect('/');

        });
    },

    populate: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("livein");
    
        if (!model) return res.notFound();
    
        var models = model.livein;

        // return res.json(model);
        var id1 = req.session.userid || '';
        var username1 = req.session.username || '';
        if (username1 == '') {
            var type1 = 'login';
        } else {
            var type1 = 'logout';
        }

        return res.view('user/myrental', { rental: models, username: username1, type: type1, userid: id1 });
    
    },

    liveinjson: async function (req, res) {

        var model = await User.findOne(req.params.id).populate("livein");

        if (!model) return res.notFound();

        return res.json(model);
    },

    add: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.notFound();
        
        const thatRental = await Rental.findOne(req.params.fk).populate("rentby", {id: req.params.id});
    
        if (!thatRental) return res.notFound();
            
        if (thatRental.rentby.length)
            return res.status(409).send("Already added.");   // conflict
        
        await User.addToCollection(req.params.id, "livein").members(req.params.fk);
    
        if (req.wantsJSON){
            return res.json({message: "Successfully.", url: '/'});    // for ajax request
        } else {
            return res.redirect('/');           // for normal request
        }
    
    },

    // json function
    json: async function (req, res) {

        var users = await User.find();

        return res.json(users);
    },

    remove: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.notFound();
        
        const thatRental = await Rental.findOne(req.params.fk).populate("rentby", {id: req.params.id});
        
        if (!thatRental) return res.notFound();
    
        if (!thatRental.rentby.length)
            return res.status(409).send("Nothing to delete.");    // conflict
    
        await User.removeFromCollection(req.params.id, "livein").members(req.params.fk);
    
        if (req.wantsJSON){
            return res.json({message: "Successfully.", url: '/'});    // for ajax request
        } else {
            return res.redirect('/');           // for normal request
        }
    
    },

};

