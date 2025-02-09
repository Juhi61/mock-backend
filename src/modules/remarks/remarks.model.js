import { Sequelize } from "sequelize";
import { db } from "../../config/database/dbConnect.js";

export const remarks = db.define(
  "interview_remarks",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    interview_id: {
      type: Sequelize.STRING,
      // references: Sequelize.
    },
    remark: {
      type: Sequelize.TEXT,
    },
    hiring_manager_id: {
      type: Sequelize.STRING,
    },
  },
  {
    tablename: "interview_remarks",
    timestamps: true,
    updatedAt: false,
    createdAt: "created_at",
  },
);
