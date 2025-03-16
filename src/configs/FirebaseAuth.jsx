import { getToken } from "firebase/messaging";
import { messaging } from "./Firebase.config";

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BN8IWKc7gtx_lqypwTMxj8tEuaHqFS5YIsUbgf2vWL8ugVw9wugg5Z6feFYp3y1i2zC9xsWXVR2x8ue9R84Lz6w",
      });

      console.log(token);
      return token;
    } else {
      console.log("Permission denied)");
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};
