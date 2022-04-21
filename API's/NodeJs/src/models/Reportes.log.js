const { Schema, model } = require("mongoose");

const LogSchema = new Schema(
    {
      vm: { type: String, default: 0 },
      endpoint: { type: String, default: 0 },
      data: { type: Object, default: 0 },
      date: { type: String, default: 0 },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Log", LogSchema, "log");