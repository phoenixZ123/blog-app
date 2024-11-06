import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";

export const useFirestore = () => {
  // Fetch a collection with optional query
  const getCollection = (colName, _q) => {
    const qRef = useRef(_q).current;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      setLoading(true);
      const ref = collection(db, colName);
      const queries = [];

      if (qRef) {
        queries.push(where(...qRef));
      }
      queries.push(orderBy("date", "desc"));

      const qry = query(ref, ...queries);
      const unsubscribe = onSnapshot(qry, (snapshot) => {
        if (snapshot.empty) {
          setError("No result found");
          setData([]);
        } else {
          const collectionData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(collectionData);
          setError("");
        }
        setLoading(false);
      }, (error) => {
        setError("Failed to load collection data.");
        setLoading(false);
      });

      return () => unsubscribe(); // Clean up listener on unmount
    }, [qRef, colName]);

    return { error, data, loading };
  };

  // Fetch a single document by ID
  const getDocument = (colName, id) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      const ref = doc(db, colName, id);
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
          setError("");
        } else {
          setError("No document found");
        }
        setLoading(false);
      }, (error) => {
        setError("Failed to load document.");
        setLoading(false);
      });

      return () => unsubscribe(); // Clean up listener on unmount
    }, [colName, id]);

    return { data, error, loading };
  };

  // Add a new document
  const addDocument = async (colName, item) => {
    item.date = serverTimestamp();
    const ref = collection(db, colName);
    return addDoc(ref, item);
  };

  // Delete a document by ID
  const deleteDocument = async (colName, id) => {
    const ref = doc(db, colName, id);
    return deleteDoc(ref);
  };

  // Update an existing document
  const updateDocument = async (colName, item, id) => {
    item.date = serverTimestamp();
    const ref = doc(db, colName, id);
    return updateDoc(ref, item);
  };

  return {
    getCollection,
    addDocument,
    deleteDocument,
    updateDocument,
    getDocument,
  };
};
