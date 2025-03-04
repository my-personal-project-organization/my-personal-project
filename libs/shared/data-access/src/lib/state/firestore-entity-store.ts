import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { addEntity, setAllEntities } from '@ngrx/signals/entities';
import { ZodSchema } from 'zod';
import { Entity } from '../models';
import { FirestoneService } from '../services/firestone.service';

export function witFirestoreEntityStore<T extends Entity>(collectionName: string, schema: ZodSchema<T>) {
  return signalStoreFeature(
    withMethods((store) => {
      const firestoneService = inject(FirestoneService);

      return {
        async add(entity: Omit<T, 'id'>) {
          patchState(store, { loading: true, error: null });
          try {
            const validatedEntity = schema.parse({
              ...entity,
              id: 'fake-id',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...entityWithoutId } = validatedEntity;
            const docRef = await firestoneService.add(collectionName, entityWithoutId);
            const newEntity = await firestoneService.getOne<T>(collectionName, docRef.id);
            if (newEntity) {
              const validEntity = schema.parse(newEntity);
              patchState(store, addEntity(validEntity, { collection: collectionName }));
            }
            // patchState(store, { loading: false });
            return newEntity;
          } catch (error: any) {
            console.error(error || 'Failed to add entity');
            patchState(store, {
              loading: false,
              error: error.message || 'Failed to add entity',
            });
            return undefined;
          }
        },
        async loadAll() {
          patchState(store, { loading: true, error: null });
          try {
            const entities = await firestoneService.getMany<T>(collectionName);
            const validEntities = entities.map((entity) => schema.parse(entity));
            patchState(store, setAllEntities(validEntities), { collection: collectionName });
            patchState(store, { loading: false });
          } catch (error: any) {
            console.error(error || 'Failed to load data');
            patchState(store, {
              loading: false,
              error: error.message || 'Failed to load data',
            });
          }
        },

        //   async loadByQuery(...queryConstraints: QueryConstraint[]) {
        //     patchState(store, { loading: true, error: null });
        //     try {
        //       const entities = await firestoneService.queryMany<T>(
        //         collectionName,
        //         ...queryConstraints,
        //       );
        //       const validEntities = entities.map((entity) => schema.parse(entity));
        //       patchState(store, setAllEntities(validEntities, {collection: collectionName}));
        //       patchState(store, { loading: false });
        //     } catch (error: any) {
        //       patchState(store, {
        //         loading: false,
        //         error: error.message || 'Failed to load data',
        //       });
        //     }
        //   },

        //   async loadOne(id: string) {
        //     patchState(store, { loading: true, error: null });
        //     try {
        //       const entity = await firestoneService.getOne<T>(collectionName, id);
        //       if (entity) {
        //         const validEntity = schema.parse(entity);
        //         patchState(store, setEntities([validEntity],{collection: collectionName})); // Use setEntities
        //       }
        //       patchState(store, { loading: false });
        //     } catch (error: any) {
        //       patchState(store, {
        //         loading: false,
        //         error: error.message || 'Failed to load entity',
        //       });
        //     }
        //   },
        //   async update(id: string, changes: Partial<T>) {
        //     patchState(store, { loading: true, error: null });
        //     try {
        //       // Partial validation, but exclude 'id'
        //       const validatedChanges = schema.partial({id: false}).parse(changes);

        //       await firestoneService.update(collectionName, id, {...validatedChanges, updatedAt: new Date()});
        //       const updatedEntity = await firestoneService.getOne<T>(collectionName, id);

        //       if(updatedEntity) {
        //         const validEntity = schema.parse(updatedEntity)
        //         patchState(store, setEntities([validEntity], {collection: collectionName}));
        //       }
        //       patchState(store, { loading: false });
        //        return updatedEntity;
        //     } catch (error: any) {
        //       patchState(store, { loading: false, error: error.message || 'Failed to update entity' });
        //       return undefined;
        //     }
        //   },

        //   async delete(id: string) {
        //     patchState(store, { loading: true, error: null });
        //     try {
        //       await firestoneService.delete(collectionName, id);
        //       patchState(store, { loading: false });
        //     } catch (error: any) {
        //       patchState(store, {
        //         loading: false,
        //         error: error.message || 'Failed to delete entity',
        //       });
        //     }
        //   },
      };
    }),
  );
}
