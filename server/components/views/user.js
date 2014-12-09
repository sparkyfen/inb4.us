'use strict';

module.exports = {
  "views": {
    "all": {
      "map": "function(doc) {emit(null, doc)}",
      "reduce": "_count"
    },
    "by_username": {
      "map": "function(doc) {emit(doc.username, doc)}",
      "reduce": "_count"
    },
    "by_email": {
      "map": "function(doc) {emit(doc.email, doc)}",
      "reduce": "_count"
    },
    "by_id": {
      "map": "function(doc) {emit(doc._id, doc)}",
      "reduce": "_count"
    },
    "by_admin": {
      "map": "function(doc) {if(doc.admin) {emit(null, doc)}}",
      "reduce": "_count"
    }
  }
};