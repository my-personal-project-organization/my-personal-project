export interface User {
  _id: string; // MongoDB ObjectId (represented as a string in TypeScript)
  username: string;
  email: string;
  password?: string; // Might not be sent to the frontend, depending on security
  firstName?: string; // Optional fields
  lastName?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}
