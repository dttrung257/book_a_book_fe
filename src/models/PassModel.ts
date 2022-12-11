export interface PassType {
    type: "text" | "password";
    text: "Hide" | "Show";
  }
  
  export const Show: PassType = {
    type: "text",
    text: "Hide",
  };
  
  export const Hide: PassType = {
    type: "password",
    text: "Show",
  };