import app from "./firebasedb"
import {getFirestore} from "firebase/firestore"

const fireStore = getFirestore(app)
export default fireStore