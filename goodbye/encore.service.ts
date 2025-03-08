import { Service } from "encore.dev/service";

// Encore will consider this directory and all its subdirectories as part of the "goodbye" service.
// https://encore.dev/docs/ts/primitives/services

// goodbye service responds to requests with a farewell message.
export default new Service("goodbye"); 