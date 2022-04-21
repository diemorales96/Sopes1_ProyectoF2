const { Schema, model } = require("mongoose");

const RamSchema= new Schema(
    {
      game_id: { type: Number, default: 0 },
      game_name: { type: String, default: 0 },
      winner: { type: String, default: 0 },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Ram", RamSchema, "memoria");