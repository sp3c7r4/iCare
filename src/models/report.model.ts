import { Schema, model } from "mongoose";

const reportSchema = new Schema({

}, {
  timestamps: true
})

const Reports = model("Report", reportSchema);

export default Reports;
