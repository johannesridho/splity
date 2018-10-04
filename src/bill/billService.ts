import Bluebird = require("bluebird");
import { Bill } from "./bill";
import { BillInterface } from "./BillInterface";

export function getBillById(id: number) {
  return Bill.findById(id, {
    attributes: ["id", "channel_id", "debtor", "creditor", "description", "amount", "status"]
  }) as Bluebird<BillInterface>;
}
