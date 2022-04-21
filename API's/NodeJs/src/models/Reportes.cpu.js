const { Schema, model } = require("mongoose");

const CpuSchema = new Schema(
    {
      vm : { type: String, default: "None"},
      process_list: { type:Array, default: "None" },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Cpu", CpuSchema, "procesos");