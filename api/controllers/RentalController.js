/**
 * RentalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // 还需要保存每个数据的创建时间和更新时间

    // action - mainpage
    mainpage: async function (req, res) {
        var models = await Rental.find(
            {
                where: { highlight: 'on' },
                limit: 4,
                sort: [{ 'createdAt': 'DESC' }]
            }
        );

        var username1 = req.session.username || '';
        var role1 = req.session.role;
        var id1 = req.session.userid || '';
        if (username1 == '') {
            var type1 = 'login';
        } else {
            var type1 = 'logout';
        }

        return res.view('rental/rentalpage', { rentals: models, username: username1, type: type1, role: role1, userid: id1 });
        //return res.view('rental/rentalpage', { rentals: models});
    },

    // json function
    json: async function (req, res) {

        var rentals = await Rental.find();

        return res.json(rentals);
    },

    //action -detail
    detail: async function (req, res) {
        var model = await Rental.findOne(req.params.id);

        var modeluser = await Rental.findOne(req.params.id).populate("rentby");

        if (!model) return res.notFound();

        var models = modeluser.rentby;

        var renterlist = [];

        models.forEach(function (model) {
            renterlist.push(model.username)
        });

        var username1 = req.session.username || '';
        var role1 = req.session.role;
        var id1 = req.session.userid || '';
        if (username1 == '') {
            var type1 = 'login';
        } else {
            var type1 = 'logout';
        }

        return res.view('rental/detail', { list: renterlist, people: models, rental: model, username: username1, type: type1, role: role1, userid: id1 });
    },

    // action - create
    create: async function (req, res) {
        if (req.method == "GET") {
            var username1 = req.session.username || '';
            var role1 = req.session.role;
            var id1 = req.session.userid || '';
            if (username1 == '') {
                var type1 = 'login';
            } else {
                var type1 = 'logout';
            }
            return res.view('rental/create', { username: username1, type: type1, role: role1, userid: id1 });
        }

        if (!req.body.Rental)
            return res.badRequest("Form-data not received.");

        await Rental.create(req.body.Rental);

        return res.ok("Successfully created!");
    },

    // action - admin
    admin: async function (req, res) {

        var models = await Rental.find();

        var username1 = req.session.username || '';
        if (username1 == '') {
            var type1 = 'login';
        } else {
            var type1 = 'logout';
        }

        return res.view('rental/admin', { rentals: models, j: 1, username: username1, type: type1 });
    },



    // action - update
    update: async function (req, res) {

        if (req.method == "GET") {

            var model = await Rental.findOne(req.params.id);

            if (!model) return res.notFound();

            var username1 = req.session.username || '';
            if (username1 == '') {
                var type1 = 'login';
            } else {
                var type1 = 'logout';
            }

            return res.view('rental/update', { rental: model, username: username1, type: type1 });

        } else {

            if (!req.body.Rental)
                return res.badRequest("Form-data not received.");

            var models = await Rental.update(req.params.id).set({
                title: req.body.Rental.title,
                imgurl: req.body.Rental.imgurl,
                estate: req.body.Rental.estate,
                numbedrooms: req.body.Rental.numbedrooms,
                area: req.body.Rental.area,
                tenants: req.body.Rental.tenants,
                rents: req.body.Rental.rents,
                highlight: req.body.Rental.highlight
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");

        }
    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var models = await Rental.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        if (req.wantsJSON) {
            return res.json({ message: "Rental information deleted.", url: '/' });    // for ajax request
        } else {
            return res.redirect('/');           // for normal request
        }

    },

    // search function
    search: async function (req, res) {
        if (req.method == "POST") {
            var sestate = req.body.sestate;
            var sBedrooms = req.body.sbedrooms;
            var smaxArea = req.body.smaxarea;
            var sminArea = req.body.sminarea;
            var smaxRent = req.body.smaxrent;
            var sminRent = req.body.sminrent;
            var strr = ""
            if (sestate != "Select...") {
                strr = strr + "estate=" + sestate + "&";
            };
            if (sBedrooms != "") {
                strr = strr + "numbedrooms=" + sBedrooms + "&";
            };
            if (smaxArea != "") {
                strr = strr + "maxarea=" + smaxArea + "&";
            };
            if (sminArea != "") {
                strr = strr + "minarea=" + sminArea + "&";
            };
            if (smaxRent != "") {
                strr = strr + "maxrent=" + smaxRent + "&";
            };
            if (sminRent != "") {
                strr = strr + "minrent=" + sminRent + "&";
            };
            var urlfull = "/rental/search/" + "?" + strr;
            return res.redirect(urlfull);

        } else {
            var strrr = req.url;
            if (strrr == "/rental/search/") {
                var strr = "";
            } else {
                if (strrr.indexOf("page") == -1) {
                    var urlsplit1 = "";
                    var strr = "";
                    [urlsplit1, strr] = strrr.split("?")
                } else {
                    var urlsplit1 = "";
                    var strrrr = "";
                    var strr = "";
                    [urlsplit1, strrrr] = strrr.split("?");
                    var strr = strrrr.slice(0, -6)
                }

            }
        }

        const qPage = Math.max(req.query.page - 1, 0) || 0;
        //const qName = req.query.name || "";
        const qestate = req.query.estate || "";
        const qnumbedrooms = parseInt(req.query.numbedrooms)
        const qmaxArea = parseInt(req.query.maxarea);
        const qminArea = parseInt(req.query.minarea);
        const qmaxRent = parseInt(req.query.maxrent);
        const qminRent = parseInt(req.query.minrent);
        const numOfItemsPerPage = 2;
        var where = { estate: { contains: qestate } };
        //var where = {};
        if (isNaN(qnumbedrooms)) {

        } else {
            where.numbedrooms = qnumbedrooms;
        };
        if (isNaN(qmaxArea)) {
            if (isNaN(qminArea)) {

            } else {
                var arearange = { '>=': qminArea };
                where.area = arearange;
            }
        } else {
            if (isNaN(qminArea)) {
                var arearange = { '<=': qmaxArea };
                where.area = arearange;
            } else {
                var arearange = { '>=': qminArea, '<=': qmaxArea };
                where.area = arearange;
            }
        };
        if (isNaN(qmaxRent)) {
            if (isNaN(qminRent)) {

            } else {
                var rentrange = { '>=': qminRent };
                where.rents = rentrange;
            }
        } else {
            if (isNaN(qminRent)) {
                var rentrange = { '<=': qmaxRent };
                where.rents = rentrange;
            } else {
                var rentrange = { '>=': qminRent, '<=': qmaxRent };
                where.rents = rentrange;
            }
        };
        var models = await Rental.find({
            where: where,
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });
        var total = await Rental.count(where);

        var numOfPage = Math.ceil(total / numOfItemsPerPage);

        var username1 = req.session.username || '';
        var role1 = req.session.role;
        var id1 = req.session.userid || '';
        if (username1 == '') {
            var type1 = 'login';
        } else {
            var type1 = 'logout';
        }

        return res.view('rental/search', { rentals: models, count: numOfPage, urlstr: strr, numbedroomsq: qnumbedrooms, minareaq: qminArea, maxareaq: qmaxArea, minrentq: qminRent, maxrentq: qmaxRent, estateq: qestate, username: username1, type: type1, role: role1, userid: id1 });

    },

    populate: async function (req, res) {

        var model = await Rental.findOne(req.params.id).populate("rentby");

        if (!model) return res.notFound();

        var models = model.rentby;

        // return res.json(model);

        var username1 = req.session.username || '';
        if (username1 == '') {
            var type1 = 'login';
        } else {
            var type1 = 'logout';
        }

        return res.view('rental/occupants', { people: models, rental: model, username: username1, type: type1, });

    },

    rentbyjson: async function (req, res) {

        var model = await Rental.findOne(req.params.id).populate("rentby");

        if (!model) return res.notFound();

        return res.json(model);
    },
};
