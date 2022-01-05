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

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});