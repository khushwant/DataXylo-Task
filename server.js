var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';

var storage =   multer.diskStorage(
                {
                    destination: function (req, file, cb) {
                        cb(null, '/tmp')
                    },
                    filename: function (req, file, cb) {
                        cb(null, file.fieldname + '-' + Date.now())
                    }
                })

var upload = multer({ storage: storage })
        
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: false }));
        //app.use(multer({ dest: '/tmp/'}).single('file'));
    app.get('/feature1.htm',function(req,res){
        res.sendFile( __dirname + "/" + "feature1.htm")
    })
    app.get('/feature2.htm', function (req, res) {
        res.sendFile( __dirname + "/" + "feature2.htm" );
    })

    app.post('/image_upload', upload.single('file'), function (req, res) 
    {
           console.log(req.file.originalname);
           console.log(req.file.path);
           console.log(req.file.mimetype);
           var file = __dirname + "/" + req.file.originalname;
           fs.readFile( req.file.path, 'base64', function (err, data) 
            {
                if( err )
                {
                    console.log( err );
                }
                else
                {
                       response = {
                            first_name:req.body.first_name,
                            data:data,
                            filename:file
                       };
                }
                console.log( response );
                MongoClient.connect(url, function (err, db) 
                {
                    assert.equal(err,null);
                    console.log("Connected correctly to server");
                    var collection = db.collection("formData2");
                    collection.insertOne(response, function(err,result)
                    {
                        assert.equal(err,null);
                        console.log("After Insert:");
                        console.log(result.ops);
                    });
                      db.close();
                });
                 res.end( JSON.stringify( response ) );
           });
    })

        
    app.post('/file_upload', upload.single('file'), function (req, res) 
    {
           console.log(req.file.originalname);
           console.log(req.file.path);
           console.log(req.file.mimetype);
           var file = __dirname + "/" + req.file.originalname;
           fs.readFile( req.file.path, 'base64', function (err, data) 
            {
                if( err )
                {
                    console.log( err );
                }
                else
                {
                       response = {
                            first_name:req.body.first_name,
                            data:data,
                            filename:file
                       };
                }
                console.log( response );
                MongoClient.connect(url, function (err, db) 
                {
                    assert.equal(err,null);
                    console.log("Connected correctly to server");
                    var collection = db.collection("formData1");
                    collection.insertOne(response, function(err,result)
                    {
                        assert.equal(err,null);
                        console.log("After Insert:");
                        console.log(result.ops);
                    });
                      db.close();
                });
                 res.end( JSON.stringify( response ) );
           });
    })
        
        var server = app.listen(8081,'localhost' ,function () 
        {
           var host = server.address().address
           var port = server.address().port

           console.log("Example app listening at http://%s:%s", host, port)
        })