import { remarks } from "./remarks.model.js";

export const addRemark = (remark) => {
  return remarks.create(remark);
};
