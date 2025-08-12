import { Client, Databases, ID, Query } from "appwrite"

const PROJECT_ID= import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID= import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID= import.meta.env.VITE_APPWRITE_COLLECTION_ID

let client, database;

console.log('Appwrite Environment Check:');
console.log('PROJECT_ID:', PROJECT_ID ? 'Present' : 'Missing');
console.log('DATABASE_ID:', DATABASE_ID ? 'Present' : 'Missing');
console.log('COLLECTION_ID:', COLLECTION_ID ? 'Present' : 'Missing');

if (PROJECT_ID && DATABASE_ID && COLLECTION_ID) {
  client = new Client()
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject(PROJECT_ID)
  database = new Databases(client)
  console.log('Appwrite client initialized successfully');
} else {
  console.warn('Appwrite environment variables missing. Trending features disabled.')
}
export const updateSearchCount = async (searchTerm, movie)=>{
    if (!database) return;
    
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ])
        if (result.documents.length > 0){
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,{
                count: doc.count + 1,
            })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.error("Error updating search count:", error)
    }
}

export const getTrendigMovies = async () =>{
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(10),
            Query.orderDesc('count')
        ])
        return result.documents;
    } catch(error){
        console.error('Error in getTrendigMovies:', error)
        return [];
    }
}