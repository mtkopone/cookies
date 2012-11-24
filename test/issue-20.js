#!/usr/bin/env node
// See: https://github.com/jed/cookies/issues/20

var Cookies = require('../'),
    assert = require('assert')

expresstestcase(serverHandler, assertFn)

function serverHandler(req, res) {
  var user = 'my-user'
  var session = 'my-session'
  var cookies = new Cookies(req, res, null)
  cookies.set('user', user, { httpOnly: true })
  cookies.set('session', session, { httpOnly: true })
  res.json({ status : 'ok' })
}

function assertFn(res) {
  var cookies = res.headers['set-cookie']
  assert.equal(cookies.length, 2, cookies.join('\n'))
  assert.equal(cookies[0], 'user=my-user; path=/; httponly')
  assert.equal(cookies[1], 'session=my-session; path=/; httponly')
  console.log('All good...')
}

function expresstestcase(serverHandlerFn, responseAssertFn) {
  var http = require('http')
  var express = require('express')
  var opts = { host: 'localhost', port: 8001, path: '/' }
  var app = express()
  app.get('/', serverHandlerFn)
  var server = http.createServer(app)
  server.listen(opts.port)
  http.get(opts, function(res) {
    try {
      responseAssertFn(res)
    } finally {
      server.close()
    }
  })
}
