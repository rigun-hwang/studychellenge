import app from "firebase/firebasedb.js"
import {getFirestore} from "firebase/firestore"

const fireStore = getFirestore(app)
export default fireStore