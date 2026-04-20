/**
 * @fileoverview Firestore-backed key-value and collection management for Print-o-Tron.
 *
 * This module provides a simplified interface for persistent storage using
 * Google Cloud Firestore. it handles authentication, document CRUD operations,
 * and specialized array-based storage with hashed identifiers.
 */

import { createHash } from "node:crypto";
import { Firestore } from "@google-cloud/firestore";
import { env } from "~/env";

/**
 * Initialize the Firestore client.
 *
 * Requirements:
 * - FIRE_STORE_PROJECT_ID: The GCP project ID.
 * - FIRE_STORE_CREDENTIAL: Service account JSON string.
 *
 * The database 'print-o-tron-key-value' is used to isolate application state.
 */
const db = new Firestore({
  projectId: env.FIRE_STORE_PROJECT_ID,
  credentials: env.FIRE_STORE_CREDENTIAL ? JSON.parse(env.FIRE_STORE_CREDENTIAL!) : undefined,
  databaseId:env.FIRE_STORE_DATABASE
});

/**
 * Saves a document to a specific collection using a provided document ID.
 *
 * This operation will create the document if it doesn't exist, or overwrite
 * it entirely if it does.
 *
 * @param collection - The name of the Firestore collection.
 * @param docId - The unique document identifier.
 * @param data - The object to be stored.
 * @returns A promise resolving to the Firestore WriteResult.
 */
export const saveWithKey = async (
	collection: string,
	docId: string,
	data: object,
) => {
	if (process.env.NODE_ENV === "development") {
		console.log(
			`Saving document to collection '${collection}' with ID '${docId}'`,
		);
		console.log(data);
	}
	const doc = await db.collection(collection).doc(docId).set(data);
	return doc;
};

/**
 * Appends a value to an 'items' array across multiple documents.
 *
 * This function is used for mapping relationships where multiple identifiers
 * need to point to the same value (e.g., tracking which files belong to which job).
 *
 * Implementation Details:
 * - Document IDs are SHA-256 hashed to ensure they are valid Firestore document paths.
 * - It performs a read-modify-write cycle to append to the 'items' array.
 * - Uses `{ merge: true }` to preserve other fields in the document.
 *
 * @param collectionPath - Array of strings representing the collection/subcollection path.
 * @param docIds - List of raw identifiers to be hashed and used as document keys.
 * @param value - The string value to append to each document's 'items' array.
 * @returns A promise that resolves when all updates are complete.
 */
export const saveWithArray = async (
	collectionPath: string[],
	docIds: string[],
	value: string,
) => {
	const ref = db.collection(`${collectionPath.join("/")}`);

	for (const id of docIds) {
		// Hash the ID to ensure it's a safe and consistent document key
		const hashOfId = createHash("sha256").update(id).digest("hex");
		const docRef = ref.doc(hashOfId);
		const snapshot = await docRef.get();

		let arr: string[] = [];

		if (snapshot.exists) {
			const data = snapshot.data();

			if (Array.isArray(data?.items)) {
				arr = data.items;
			}
		}

		arr.push(value);

		// Update the document with the expanded array
		await docRef.set(
			{
				items: arr,
			},
			{ merge: true },
		);
	}
};

/**
 * Retrieves a document from a collection by its ID.
 *
 * @param collection - The name of the Firestore collection.
 * @param docId - The unique document identifier.
 * @returns A promise resolving to the document data, or null if not found.
 */
export const getWithKey = async (collection: string, docId: string) => {

	const doc = await db.collection(collection).doc(docId).get();

	if (!doc.exists) return null;

	return doc.data()!;
};

/**
 * Retrieves all documents from a specific collection.
 *
 * @param collection - The name of the Firestore collection.
 * @returns A promise resolving to an array of document data.
 */
export const getAllDocsInCollection = async (collection: string) => {
	const snapshot = await db.collection(collection).get();
	return snapshot.docs.map((doc) => doc.data());
};


/**
 * Retrieves a document from a collection by its ID.
 *
 * @param collection - The name of the Firestore collection.
 * @param docId - The unique document identifier.
 * @returns A promise resolving to the document data, or null if not found.
 */
export const getWithKeyHash = async (collection: string, docId: string) => {

	const hashOfId = createHash("sha256").update(docId).digest("hex");
	const doc = await db.collection(collection).doc(hashOfId).get();

	if (!doc.exists) return null;

	return doc.data()!;
};