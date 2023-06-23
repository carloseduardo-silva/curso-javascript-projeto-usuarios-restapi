let NeDB = require('nedb');
let db = new NeDB({
    filename:'users.db',
    autoload:true,
    corruptAlertThreshold: 1
    //exclui error/alert sobre corrupção de dados.
});

// config da REST API que consulta o banco de dados, e atraves de solicitações via postman(software), permite sua edição,exclusão e exibição dos dados. trazendo esses resultados para a porta localhost4001 atraves da rota "/users".
module.exports = app => {

    let route = app.route('/users');

    route.get((req, res) => {

        db.find({}).sort({name:1}).exec((err, users)=>{

            if (err) {
                app.utils.error.send(err, req, res);
            } else {

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users
                });

            }

        });

    });

    route.post((req, res) => {
        
        if (!app.utils.validator.user(app, req, res)) return false;
        
        db.insert(req.body, (err, user)=>{

            if (err) {
                app.utils.error.send(err, req, res);
            } else {

                res.status(200).json(user);

            }

        });

    });

    let routeId = app.route('/users/:id');

    routeId.get((req, res) => {

        db.findOne({_id:req.params.id}).exec((err, user)=>{

            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }

        });

    });

    routeId.put((req, res) => {
        
        if (!app.utils.validator.user(app, req, res)) return false;

        db.update({ _id: req.params.id }, req.body, err => {

            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body));
            }

        });

    });
    
    routeId.delete((req, res)=>{

        db.remove({ _id: req.params.id }, {}, err=>{

            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }

        });

    });

};