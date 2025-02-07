import { Sequelize, DataTypes } from 'sequelize';
import { db } from '../../helper/dbConnect';


const remarks = db.define('interview_remarks', {
  id:{
    type: Sequelize.STRING,
    primaryKey: true
  },
  interview_id: {
    type: Sequelize.STRING
   // references: Sequelize.
  },
  remark: {
    type: Sequelize.TEXT
  },
},
{
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
},);