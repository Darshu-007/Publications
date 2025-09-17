import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend files

// ----------------- Firebase Config -----------------
const firebaseConfig = {
  apiKey: "AIzaSyC8VsAC3bYWFRlxBupJofk4t_q2sx5UabY",
  authDomain: "portfolio-8d567.firebaseapp.com",
  projectId: "portfolio-8d567",
  storageBucket: "portfolio-8d567.appspot.com",
  messagingSenderId: "977667017000",
  appId: "1:977667017000:web:a42630eeef0a4e7c9ba81d",
  measurementId: "G-FJYRLZ5S75"
};

// Initialize Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const publicationsRef = collection(db, "publications");

// ----------------- API Routes -----------------

// Get all publications
app.get("/api/publications", async (req, res) => {
  try {
    const snapshot = await getDocs(publicationsRef);
    const publications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(publications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a publication
app.post("/api/publications", async (req, res) => {
  try {
    const docRef = await addDoc(publicationsRef, req.body);
    res.json({ id: docRef.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a publication
app.put("/api/publications/:id", async (req, res) => {
  try {
    const ref = doc(db, "publications", req.params.id);
    await updateDoc(ref, req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a publication
app.delete("/api/publications/:id", async (req, res) => {
  try {
    const ref = doc(db, "publications", req.params.id);
    await deleteDoc(ref);
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Start Server -----------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});