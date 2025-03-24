/*eslint-disable */

import {app, auth} from "./firebase/firebasedb"
import {getFirestore} from "firebase/firestore"

const fireStore = getFirestore(app)
export default fireStore