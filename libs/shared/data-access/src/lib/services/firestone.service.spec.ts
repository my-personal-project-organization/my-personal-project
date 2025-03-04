import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { FirestoneService } from './ddbb.service';

// Mock Firestore
const mockFirestore = {
  collection: jest.fn(),
};

// Mock addDoc
const mockAddDoc = jest.fn();

describe('FirestoneService', () => {
  let service: FirestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirestoneService,
        { provide: Firestore, useValue: mockFirestore },
      ],
    });

    service = TestBed.inject(FirestoneService);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('add', () => {
  //   it('should add a document to the specified collection with server timestamp', async () => {
  //     const collectionName = 'testCollection';
  //     const data = { name: 'Test Data', value: 123 };
  //     const expectedData = { ...data, createdAt: 'mockTimestamp' };
  //     const mockCollectionRef = { _path: { segments: [collectionName] } };
  //     const mockDocRef = { id: 'newDocId', path: `${collectionName}/newDocId`, _converter: null, type: "document", firestore: mockFirestore};

  //     mockFirestore.collection.mockReturnValueOnce(mockCollectionRef);
  //     mockAddDoc.mockResolvedValueOnce(mockDocRef);

  //     // Mock serverTimestamp to return a specific value for testing
  //     (serverTimestamp as unknown as jest.Mock).mockReturnValue('mockTimestamp');

  //     const result = await service.add(collectionName, data);

  //     expect(mockFirestore.collection).toHaveBeenCalledWith(mockFirestore, collectionName);
  //     expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, expectedData);
  //     expect(result).toEqual(mockDocRef);
  //   });

  //   it('should handle errors during document addition', async () => {
  //     const collectionName = 'testCollection';
  //     const data = { name: 'Test Data', value: 123 };
  //     const mockCollectionRef = { _path: { segments: [collectionName] } };
  //     const errorMessage = 'Error adding document';

  //     mockFirestore.collection.mockReturnValueOnce(mockCollectionRef);
  //     mockAddDoc.mockRejectedValueOnce(new Error(errorMessage));

  //     // Mock serverTimestamp to return a specific value for testing
  //     (serverTimestamp as unknown as jest.Mock).mockReturnValue('mockTimestamp');

  //     await expect(service.add(collectionName, data)).rejects.toThrow(errorMessage);

  //     expect(mockFirestore.collection).toHaveBeenCalledWith(mockFirestore, collectionName);
  //     expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, { ...data, createdAt: 'mockTimestamp' });
  //   });

  //   it('should add a document with various data types', async () => {
  //       const collectionName = 'testCollection';
  //       const data = {
  //         string: 'Test String',
  //         number: 123,
  //         boolean: true,
  //         array: [1, 2, 3],
  //         object: { key: 'value' }
  //       };
  //       const expectedData = { ...data, createdAt: 'mockTimestamp' };
  //       const mockCollectionRef = { _path: { segments: [collectionName] } };
  //       const mockDocRef = { id: 'newDocId', path: `${collectionName}/newDocId`, _converter: null, type: "document", firestore: mockFirestore};

  //       mockFirestore.collection.mockReturnValueOnce(mockCollectionRef);
  //       mockAddDoc.mockResolvedValueOnce(mockDocRef);

  //       // Mock serverTimestamp to return a specific value for testing
  //       (serverTimestamp as unknown as jest.Mock).mockReturnValue('mockTimestamp');

  //       const result = await service.add(collectionName, data);

  //       expect(mockFirestore.collection).toHaveBeenCalledWith(mockFirestore, collectionName);
  //       expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, expectedData);
  //       expect(result).toEqual(mockDocRef);
  //     });

  //     it('should add a document with an empty object', async () => {
  //       const collectionName = 'testCollection';
  //       const data = {};
  //       const expectedData = { createdAt: 'mockTimestamp' };
  //       const mockCollectionRef = { _path: { segments: [collectionName] } };
  //       const mockDocRef = { id: 'newDocId', path: `${collectionName}/newDocId`, _converter: null, type: "document", firestore: mockFirestore};

  //       mockFirestore.collection.mockReturnValueOnce(mockCollectionRef);
  //       mockAddDoc.mockResolvedValueOnce(mockDocRef);

  //       (serverTimestamp as unknown as jest.Mock).mockReturnValue('mockTimestamp');

  //       const result = await service.add(collectionName, data);

  //       expect(mockFirestore.collection).toHaveBeenCalledWith(mockFirestore, collectionName);
  //       expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, expectedData);
  //       expect(result).toEqual(mockDocRef);
  //     });

  //     it('should add a document with nested objects', async () => {
  //       const collectionName = 'testCollection';
  //       const data = {
  //         name: 'Nested Object',
  //         details: {
  //           age: 30,
  //           address: {
  //             city: 'Test City',
  //             country: 'Test Country'
  //           }
  //         }
  //       };
  //       const expectedData = { ...data, createdAt: 'mockTimestamp' };
  //       const mockCollectionRef = { _path: { segments: [collectionName] } };
  //       const mockDocRef = { id: 'newDocId', path: `${collectionName}/newDocId`, _converter: null, type: "document", firestore: mockFirestore};

  //       mockFirestore.collection.mockReturnValueOnce(mockCollectionRef);
  //       mockAddDoc.mockResolvedValueOnce(mockDocRef);

  //       (serverTimestamp as unknown as jest.Mock).mockReturnValue('mockTimestamp');

  //       const result = await service.add(collectionName, data);

  //       expect(mockFirestore.collection).toHaveBeenCalledWith(mockFirestore, collectionName);
  //       expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionRef, expectedData);
  //       expect(result).toEqual(mockDocRef);
  //     });
  // });
});
