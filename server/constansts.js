const DEVICE_TYPES = {
  IOS: 1,
  ANDROID: 2,
  WEB: 3,
};

const LOGIN_PROVIDER = {
  local: "local",
  facebook: "facebook",
  apple: "apple",
};

const EVENT_ROLE = {
  USER: "user",
  VENDOR: "vendor",
};

const SUBSCRIPTION_TYPES = {
  BASIC: 1,
  BRONZE: 2,
  SILVER: 3,
};
const PURCHASE = {
  BASIC: "com.basic.msp",
  BRONZE: "com.bronze.msp",
  SILVER: "com.sliver.msp",
};

const STATUS = {
  CANCEL: "CANCEL",
  RENEWAL: "RENEWAL",
  REFUND: "REFUND",
  DID_FAIL_TO_RENEW: "DID_FAIL_TO_RENEW",
};

module.exports = {
  DEVICE_TYPES,
  LOGIN_PROVIDER,
  EVENT_ROLE,
  SUBSCRIPTION_TYPES,
  PURCHASE,
  STATUS,
};
