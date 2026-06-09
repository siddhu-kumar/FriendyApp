import { acceptRequest } from "./acceptRequest/index.js";
import { createRequest } from "./createFriendReq/index.js";
import { deleteSentRequest } from "./deleteSentReq/index.js";
import { deleteReceivedRequest } from "./deleteReceivedReq/index.js";
import { getFriends } from "./getFriends/index.js";
import { getReceivedRequest } from "./getReceivedReq/index.js";
import { getSentRequest } from "./getSentRequest/index.js";

export const Friends = {
  acceptRequest,
  createRequest,
  deleteSentRequest,
  deleteReceivedRequest,
  getFriends,
  getReceivedRequest,
  getSentRequest,
};
