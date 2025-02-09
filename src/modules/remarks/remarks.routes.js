import { Router } from "express";
import { api } from "../../constant/constant.js";
import {
  createRemarks,
  getRemarks,
  getRemark,
  deleteRemark,
  updateRemark,
} from "./remarks.controller.js";
const router = Router();

router.post(api.remarks.addRemark, createRemarks);
router.get(api.remarks.getRemarks, getRemarks);
router.get(api.remarks.getRemark, getRemark);
router.put(api.remarks.updateRemark, updateRemark);
router.delete(api.remarks.deleteRemark, deleteRemark);

// const newRemark = await remarks.create(req.body);

// const remarks = await remarks.findAll();

// const remark = await remarks.findByPk(req.params.id);
export default router;
