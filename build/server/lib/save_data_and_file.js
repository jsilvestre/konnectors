// Generated by CoffeeScript 1.9.3
var File, async, checkForMissingFiles, naming;

async = require('async');

naming = require('./naming');

File = require('../models/file');

module.exports = function(log, model, options, tags) {
  return function(requiredFields, entries, body, next) {
    var entriesToSave, path;
    entriesToSave = entries.filtered || entries.fetched;
    path = requiredFields.folderPath;
    return async.eachSeries(entriesToSave, function(entry, callback) {
      var createFileAndSaveData, entryLabel, fileName, onCreated, saveEntry;
      entryLabel = entry.date.format('MMYYYY');
      fileName = naming.getEntryFileName(entry, options);
      createFileAndSaveData = function(entry, entryLabel) {
        var date, pdfurl;
        date = entry.date;
        pdfurl = entry.pdfurl;
        return File.createNew(fileName, path, date, pdfurl, tags, onCreated);
      };
      onCreated = function(err, file) {
        if (err) {
          log.raw(err);
          log.info("File for " + entryLabel + " not created.");
          return callback();
        } else {
          log.info("File for " + entryLabel + " created: " + fileName);
          entry.fileId = file.id;
          entry.binaryId = file.binary.file.id;
          return saveEntry(entry, entryLabel);
        }
      };
      saveEntry = function(entry, entryLabel) {
        if (entry.vendor == null) {
          if (options.vendor) {
            entry.vendor = options.vendor;
          }
        }
        return model.create(entry, function(err) {
          if (err) {
            log.raw(err);
            log.error("entry for " + entryLabel + " not saved.");
          } else {
            log.info("entry for " + entryLabel + " saved.");
          }
          return callback();
        });
      };
      log.info("import for entry " + entryLabel + " started.");
      if (entry.pdfurl != null) {
        return createFileAndSaveData(entry, entryLabel);
      } else {
        log.info("No file to download for " + entryLabel + ".");
        return saveEntry(entry, entryLabel);
      }
    }, function(err) {
      var opts;
      opts = {
        entries: entries.fetched,
        folderPath: path,
        nameOptions: options,
        tags: tags,
        model: model,
        log: log
      };
      return checkForMissingFiles(opts, function() {
        return next();
      });
    });
  };
};

checkForMissingFiles = function(options, callback) {
  var entries, folderPath, log, model, nameOptions, tags;
  entries = options.entries, folderPath = options.folderPath, nameOptions = options.nameOptions, tags = options.tags, model = options.model, log = options.log;
  return async.eachSeries(entries, function(entry, done) {
    var fileName, path;
    fileName = naming.getEntryFileName(entry, nameOptions);
    path = folderPath + "/" + fileName;
    return File.isPresent(path, function(err, isPresent) {
      var date, url;
      if (isPresent || (entry.pdfurl == null)) {
        return done();
      } else {
        date = entry.date;
        url = entry.pdfurl;
        path = folderPath;
        return File.createNew(fileName, path, date, url, tags, function(err, file) {
          if (err) {
            log.error('An error occured while creating file');
            return log.raw(err);
          } else {
            date = entry.date.toISOString();
            return model.request('byDate', {
              key: date
            }, function(err, entries) {
              var data;
              if (entries.length === 0) {
                return done();
              } else {
                entry = entries[0];
                data = {
                  fileId: file.id,
                  binaryId: file.binary.file.id
                };
                return entry.updateAttributes(data, function(err) {
                  log.info("Missing file created: " + path);
                  return done();
                });
              }
            });
          }
        });
      }
    });
  }, function(err) {
    return callback();
  });
};
