export interface InterfaceRegister extends InterfaceLogin {
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: "female" | "male";
  password: string;
  rePassword: string;
}
export interface InterfaceLogin {

  email: string;
  password: string;
}