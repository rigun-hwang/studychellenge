/*eslint-disable */

import {app, auth} from "./firebasedb"
import {getFirestore} from "firebase/firestore"

const fireStore = getFirestore(app)
export default fireStore