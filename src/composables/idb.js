import { openDB } from "idb";

let dbPromise;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB("chime-db", 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings");
                }
            },
        });
    }
  return dbPromise;
}

export function useIDB() {
    const get = async (key) => {
        const db = await getDB();
        return db.get("settings", key);
    };

    const set = async (key, value) => {
        const db = await getDB();
        return db.put("settings", value, key);
    };

    const del = async (key) => {
        const db = await getDB();
        return db.delete("settings", key);
    };
    const keys = async () => {
        const db = await getDB();
        return db.getAllKeys("settings");
    };

    return { get, set, del, keys };
}