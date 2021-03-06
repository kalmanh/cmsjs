var article = require('../lib/models/article');
var visitor = require('../lib/models/visitor');
var express = require('express');

var init = function(app) {
	console.log ("Initializing INDEX routes...");

	var db = app.get('db');
	app.get('/', function(req, res) {
		article.fetchRecent(db, null, function(err, articles) {
			if (!err) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.render('index/index', {articles: articles, user: req.session.user}, function(err, html) {
					if (!err) {
						res.write(html);
						res.end();
					} else {
						console.log("Error en get /" + err);
						res.end();
					}
				});
			} else {
				console.log("Error en fetchRecent " + err);
				res.statusCode = 500;
				res.write('Error when retrieving recent articles');
				res.end();
			}
		});
		visitor.save(db, req);
	});
	app.get('/page/:pagenum', function(req, res) {
		var currentPage = {
			page : eval(req.params.pagenum)
		}
		article.fetchRecent(db, currentPage, function(err, articles) {
			if (!err) {
				res.statudCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.render('index/index', {articles:articles, user: req.session.user}, function(err, html) {
					if (!err) {
						res.write(html);
						res.end();
					} else {
						console.log("Error en page/" + req.params.pagenum + " : " + err);
						res.end();
					}
				});
			} else {

			}
		});
	});
	app.get('/markdown_parse', function(req, res) {
		var markdown = require('markdown');
		res.setHeader('Content-type', 'text/html;charset=utf-8');
		res.write(markdown.parse(req.query.data));
		res.end();
	});
}

exports.init = init;