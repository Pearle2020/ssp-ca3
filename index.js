const   http = require('http'),
        path = require('path'),
        express = require('express'),
        fs = require('fs'),
        xmlParse = require('xslt-processor').xmlParse,
        xsltProcess = require('xslt-processor').xsltProcess,
        xml2js = require('xml2js');

const router = express();
const server = http.createServer(router);


router.use(express.static(path.resolve(__dirname,'views'))); 
router.use(express.urlencoded({extended: true}));
router.use(express.json()); 


function XMLtoJSON(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
};

function JSONtoXML(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

router.get('/get/html', function(req, res){
res.writeHead(200, {'content-Typer': 'text/html'});
let xml = fs.readFileSync('Colonnelbakery.xml' , 'utf8'),
    xsl =fs.readFileSync('Colonnelbakery.xsl' , 'utf8');
    console.log(xml);
    console.log(xsl);
    let doc = xmlParse(xml),
        stylesheet = xmlParse(xsl);
        console.log(doc);
    console.log(stylesheet);


    let result = xsltProcess(doc, stylesheet);
    console.log(result);
    res.end(result.toString());

});
router.post('/post/json', function (req, res) {

    function appendJSON(obj) {

        console.log(obj)

        XMLtoJSON('Colonnelbakery.xml', function (err, result) {
            if (err) throw (err);
            
            result.menu.section[obj.sec_n].entry.push({'item': obj.item, 'price': obj.price});

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('Colonnelbakery.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');

});

router.post('/post/delete', function (req, res) {
// this function delete from the table
    function deleteJSON(obj) {

        console.log(obj)

        XMLtoJSON('Colonnelbakery.xml', function (err, result) {
            if (err) throw (err);
            // prompt and error message when the input length is not respected
            delete result.menu.section[obj.section].entry[obj.entree];

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('Colonnelbakery.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back');

});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});