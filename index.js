const   http = require('http'),
        path = require('path'),
        express = require('express'),
        fs = require('fs'),
        xmlParse = require('xslt-processor').xmlParse,
        xsltProcess = require('xslt-processor').xsltProcess,
        xml2js = require('xml2js');

const router = express();
const server = http.createServer(router);

router.get('/', function(req, res){
res.writeHead(200, {'content-Typer': 'text/html'});
let xml = fs.readFileSync('Colonnelbakery.xml' , 'utf-8'),
    xsl =fs.readFileSync('Colonnelbakery.xsl' , 'utf-8');

    let doc = xmlParse(xml),
        stylesheet = xmlParse(xsl);

    let result = xsltProcess(doc, stylesheet);

    res.end(result.toString());

});

server.listen(process.env.Port|| 3000, process.env.IP|| "0.0.0.0", function()
{
    const addr = server.address();
    console.log("Server listening at" , addr.address + ":" + addr.port)

});