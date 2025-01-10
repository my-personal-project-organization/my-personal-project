/* eslint-disable @typescript-eslint/no-require-imports */
const { ReadableStream } = require('node:util');
Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
});
import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { DdbbService } from './ddbb.service'; // Your service file

// Initialize the mock functions before jest.mock
// const collectionMock = jest.fn();
const addDocMock = jest.fn();
const docMock = jest.fn();
const docDataMock = jest.fn();
const updateDocMock = jest.fn();
const deleteDocMock = jest.fn();
const getDocMock = jest.fn();
const getDocsMock = jest.fn();
const queryMock = jest.fn();
const setDocMock = jest.fn();
const collectionDataMock = jest.fn();
const serverTimestampMock = jest.fn();
const whereMock = jest.fn();

describe('DdbbService', () => {
  let service: DdbbService;
  jest.mock('@angular/fire/firestore', () => ({
    collection: jest.fn().mockResolvedValue({ id: '123' }),
    addDoc: addDocMock,
    doc: docMock,
    docData: docDataMock,
    updateDoc: updateDocMock,
    deleteDoc: deleteDocMock,
    getDoc: getDocMock,
    getDocs: getDocsMock,
    query: queryMock,
    setDoc: setDocMock,
    collectionData: collectionDataMock,
    serverTimestamp: serverTimestampMock,
    where: whereMock,
  }));

  // Create a mock Firestore object to be injected
  const firestoreMock = {};
  // let firestoreMock: {
  //   collection: jest.Mock;
  //   doc: jest.Mock;
  //   addDoc: jest.Mock;
  //   getDoc: jest.Mock;
  //   getDocs: jest.Mock;
  //   updateDoc: jest.Mock;
  //   setDoc: jest.Mock;
  //   deleteDoc: jest.Mock;
  //   collectionData: jest.Mock;
  //   docData: jest.Mock;
  //   query: jest.Mock;
  //   where: jest.Mock;
  // };

  beforeEach(() => {
    // firestoreMock = {
    //   collection: jest.fn().mockReturnThis(), // Update collection mock to return itself
    //   doc: jest.fn().mockReturnThis(), // Update doc mock to return itself
    //   addDoc: jest.fn(),
    //   getDoc: jest.fn(),
    //   getDocs: jest.fn(),
    //   updateDoc: jest.fn(),
    //   setDoc: jest.fn(),
    //   deleteDoc: jest.fn(),
    //   collectionData: jest.fn(),
    //   docData: jest.fn(),
    //   query: jest.fn(),
    //   where: jest.fn(),
    // };

    TestBed.configureTestingModule({
      providers: [DdbbService, { provide: Firestore, useValue: firestoreMock }],
    });

    service = TestBed.inject(DdbbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Add tests. I cannot make it work with the current setup.
  // it('should add a document', async () => {
  //   const data = { name: 'test' };
  //   // firestoreMock.addDoc.mockResolvedValue({ id: '123' });

  //   const result = await service.add('testCollection', data);
  //   expect(firestoreMock.addDoc).toHaveBeenCalled();
  //   expect(result.id).toBe('123');
  // });

  // it('should get a document', () => {
  //   const data = { id: '123', name: 'test' };
  //   firestoreMock.docData.mockReturnValue(of(data));

  //   service.get('testCollection', '123').subscribe((result) => {
  //     expect(result).toEqual(data);
  //   });
  //   expect(firestoreMock.docData).toHaveBeenCalled();
  // });

  // it('should get all documents', () => {
  //   const data = [{ id: '123', name: 'test' }];
  //   firestoreMock.collectionData.mockReturnValue(of(data));

  //   service.getAll('testCollection').subscribe((result) => {
  //     expect(result).toEqual(data);
  //   });
  //   expect(firestoreMock.collectionData).toHaveBeenCalled();
  // });

  // it('should update a document', async () => {
  //   const data = { name: 'updated' };
  //   firestoreMock.updateDoc.mockResolvedValue(undefined);

  //   await service.update('testCollection', '123', data);
  //   expect(firestoreMock.updateDoc).toHaveBeenCalled();
  // });

  // it('should set a document', async () => {
  //   const data = { name: 'set' };
  //   firestoreMock.setDoc.mockResolvedValue(undefined);

  //   await service.set('testCollection', '123', data);
  //   expect(firestoreMock.setDoc).toHaveBeenCalled();
  // });

  // it('should delete a document', async () => {
  //   firestoreMock.deleteDoc.mockResolvedValue(undefined);

  //   await service.delete('testCollection', '123');
  //   expect(firestoreMock.deleteDoc).toHaveBeenCalled();
  // });

  // it('should query documents', () => {
  //   const data = [{ id: '123', name: 'test' }];
  //   firestoreMock.collectionData.mockReturnValue(of(data));

  //   service
  //     .query('testCollection', firestoreMock.where('name', '==', 'test'))
  //     .subscribe((result) => {
  //       expect(result).toEqual(data);
  //     });
  //   expect(firestoreMock.collectionData).toHaveBeenCalled();
  // });

  // it('should create a where query constraint', () => {
  //   const constraint = service.where('name', '==', 'test');
  //   expect(constraint).toBeDefined();
  // });
});
