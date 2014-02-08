var through = require('through2');
var gutil = require('gulp-util');
var _ = require("underscore");
var yaml = require('js-yaml');

var PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-jadeblog';

function parseHeader (header) {
  return yaml.safeLoad(header);
}

function parseJadeBlogHeader (fileBuffer) {
  var fileContent = fileBuffer.toString("utf-8");
  var lines = fileContent.split("\n");
  var result = [];

  var state = "HEADER_NOT_FOUND";

  function isHeaderSeparator (line) {
    return line.trim() === "---";
  }

  var headers = [];
  var body = [];
  lines.forEach(function (line) {
    if (state === "HEADER_NOT_FOUND" && isHeaderSeparator(line)) {
      state = "PARSING_HEADER";
    } else if (state === "PARSING_HEADER") {
      if (isHeaderSeparator(line)) {
        state = "PARSING_BODY";
      } else {
        headers.push(line);
      }
    } else {
      body.push("    " + line);
    }
  });

  var parsedHeaders = parseHeader(headers.join("\n"));
  var layout = parsedHeaders.layout || "default";

  result.push("extends /src/layouts/" + layout);
  result.push("block append content");
  result.push("  :markdown");
  result = result.concat(body);

  //Write headers
  result.push("block vars");
  _.each(parsedHeaders, function (value, key) {
    result.push("  - var " + key + " = " + JSON.stringify(value));
  });

  return new Buffer(result.join("\n"), "utf-8");
}

function gulpJadeBlog () {

  var stream = through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isBuffer()) {
      file.contents = parseJadeBlogHeader(file.contents);
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    }

  });

  return stream;
}

module.exports = gulpJadeBlog;