import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  WhereFilterOp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DdbbService {
  private readonly firestore = inject(Firestore);

  /**
   * Adds a new document to the specified collection.
   * @param collectionName The name of the collection.
   * @param data The data to add to the document.
   * @returns A promise that resolves with the document reference.
   */
  add<T extends Record<string, unknown>>(collectionName: string, data: T) {
    const collectionRef = collection(this.firestore, collectionName);
    return addDoc(collectionRef, { ...data, createdAt: serverTimestamp() });
  }

  /**
   * Gets a single document from the specified collection.
   * @param collectionName The name of the collection.
   * @param documentId The ID of the document.
   * @returns An observable that emits the document data.
   */
  get<T>(
    collectionName: string,
    documentId: string,
  ): Observable<T | undefined> {
    const documentRef = doc(this.firestore, collectionName, documentId);
    return docData(documentRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  /**
   * Gets all documents from the specified collection.
   * @param collectionName The name of the collection.
   * @returns An observable that emits an array of document data.
   */
  getAll<T>(collectionName: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Gets a single document from the specified collection using getDoc - not a real time listener.
   * @param collectionName The name of the collection.
   * @param documentId The ID of the document.
   * @returns A promise that emits the document data.
   */
  async getOne<T>(
    collectionName: string,
    documentId: string,
  ): Promise<T | undefined> {
    const documentRef = doc(this.firestore, collectionName, documentId);
    const docSnap = await getDoc(documentRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return undefined;
  }

  /**
   * Gets all documents from the specified collection using getDocs - not a real time listener.
   * @param collectionName The name of the collection.
   * @returns A promise that emits an array of document data.
   */
  async getMany<T>(collectionName: string): Promise<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as T,
    );
  }

  /**
   * Updates a document in the specified collection.
   * @param collectionName The name of the collection.
   * @param documentId The ID of the document.
   * @param data The data to update in the document.
   * @returns A promise that resolves when the update is complete.
   */
  update<T extends Record<string, unknown>>(
    collectionName: string,
    documentId: string,
    data: Partial<T>,
  ) {
    const documentRef = doc(this.firestore, collectionName, documentId);
    return updateDoc(documentRef, { ...data, updatedAt: serverTimestamp() });
  }

  /**
   * Sets a document in the specified collection. If document exists, it will be overwritten
   * @param collectionName The name of the collection.
   * @param documentId The ID of the document.
   * @param data The data to set in the document.
   * @returns A promise that resolves when the set is complete.
   */
  set<T extends Record<string, unknown>>(
    collectionName: string,
    documentId: string,
    data: T,
  ) {
    const documentRef = doc(this.firestore, collectionName, documentId);
    return setDoc(documentRef, { ...data, createdAt: serverTimestamp() });
  }

  /**
   * Deletes a document from the specified collection.
   * @param collectionName The name of the collection.
   * @param documentId The ID of the document.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(collectionName: string, documentId: string) {
    const documentRef = doc(this.firestore, collectionName, documentId);
    return deleteDoc(documentRef);
  }

  /**
   * Queries the specified collection based on the provided query constraints.
   * @param collectionName The name of the collection.
   * @param queryConstraints The query constraints to apply.
   * @returns An observable that emits an array of document data.
   */
  query<T>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Queries the specified collection based on the provided query constraints using getDocs - not a real time listener.
   * @param collectionName The name of the collection.
   * @param queryConstraints The query constraints to apply.
   * @returns A promise that emits an array of document data.
   */
  async queryMany<T>(
    collectionName: string,
    ...queryConstraints: QueryConstraint[]
  ): Promise<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as T,
    );
  }

  /**
   * Example of creating a where query constraint.
   * @param field The field to filter on.
   * @param operator The comparison operator.
   * @param value The value to compare against.
   * @returns A where query constraint.
   */
  where(
    field: string,
    operator: WhereFilterOp,
    value: unknown,
  ): QueryConstraint {
    return where(field, operator, value);
  }
}
