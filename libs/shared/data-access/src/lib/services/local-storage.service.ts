import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes the service available throughout the application
})
export class LocalStorageService {
  /**
   * Saves data to local storage.
   *
   * @param key The key to use for storing the data.
   * @param data The data to save.
   */
  saveData<TData>(key: string, data: TData): void {
    const dataJSON = JSON.stringify(data);
    localStorage.setItem(key, dataJSON);
  }

  /**
   * Retrieves data from local storage.
   *
   * @param key The key to use for retrieving the data.
   * @returns The data stored under the given key, or null if no data is found.
   */
  getData<TData>(key: string): TData | null {
    const dataJSON = localStorage.getItem(key);
    if (dataJSON) {
      return JSON.parse(dataJSON);
    } else {
      return null;
    }
  }

  /**
   * Removes data from local storage.
   *
   * @param key The key to use for removing the data.
   */
  removeData(key: string): void {
    localStorage.removeItem(key);
  }
}
