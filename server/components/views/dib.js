'use strict';

module.exports = {
  "views": {
    "all": {
      "map": "function(doc) {emit(null, doc)}",
      "reduce": "_count"
    },
    "by_name": {
      "map": "function(doc) {emit(doc.name, doc)}",
      "reduce": "_count"
    },
    "by_id": {
      "map": "function(doc) {emit(doc._id, doc)}",
      "reduce": "_count"
    },
    "by_creator": {
      "map": "function(doc) {emit(doc.creator, doc)}",
      "reduce": "_count"
    },
    "by_date_created": {
      "map": "function(doc) {emit(doc.dates.created, doc)}",
      "reduce": "_count"
    },
    "by_reported": {
      "map": "function(doc) {emit(doc.report.reported, doc)}",
      "reduce": "_count"
    }
  }
};